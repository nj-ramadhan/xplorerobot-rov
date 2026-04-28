import asyncio
import os
import signal
import subprocess
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IS_WINDOWS = os.name == 'nt'


def capture_env_after_source(cmd: str, cwd: str, current_env: dict):
    """
    Jalankan 'source ...' lalu capture semua environment variable hasilnya.
    Return (new_env_dict, error_string_or_None)
    """
    capture_cmd = f'{cmd} && printenv'
    result = subprocess.run(
        capture_cmd,
        cwd=cwd,
        shell=True,
        executable='/bin/bash',
        capture_output=True,
        text=True,
        errors='replace',
        env=current_env,
    )

    if result.returncode != 0:
        return None, result.stderr.strip()

    new_env = {}
    for line in result.stdout.splitlines():
        if '=' in line:
            key, _, value = line.partition('=')
            new_env[key] = value

    return new_env, None


@app.websocket("/ws/terminal")
async def websocket_terminal(websocket: WebSocket):
    await websocket.accept()

    current_dir = os.path.expanduser("~")
    session_env = dict(os.environ)

    # Proses yang sedang berjalan di sesi ini (ros2 launch, dll)
    running_procs: dict[int, subprocess.Popen] = {}
    proc_counter = 0

    await websocket.send_json({"type": "path", "path": current_dir})

    async def stream_proc_output(proc: subprocess.Popen, proc_id: int):
        """
        Baca stdout + stderr dari proses secara async dan kirim ke frontend
        baris per baris secara real-time.
        """
        loop = asyncio.get_event_loop()

        async def read_stream(stream):
            while True:
                line = await loop.run_in_executor(None, stream.readline)
                if not line:
                    break
                text = line if isinstance(line, str) else line.decode('utf-8', errors='replace')
                text = text.rstrip('\n')
                if text:
                    try:
                        await websocket.send_json({"type": "output", "text": text})
                    except Exception:
                        break

        await asyncio.gather(
            read_stream(proc.stdout),
            read_stream(proc.stderr),
        )

        # Proses selesai / di-kill
        ret = proc.wait()
        running_procs.pop(proc_id, None)
        try:
            await websocket.send_json({
                "type": "output",
                "text": f"\n[Proses selesai dengan exit code {ret}]"
            })
        except Exception:
            pass

    try:
        while True:
            cmd = await websocket.receive_text()
            cmd = cmd.strip()

            if not cmd:
                continue

            # ── Ctrl+C — kirim SIGINT ke semua proses yang sedang berjalan ──
            if cmd == '\x03' or cmd.lower() in ('ctrl+c', '^c'):
                if running_procs:
                    for pid, proc in list(running_procs.items()):
                        try:
                            if IS_WINDOWS:
                                proc.send_signal(signal.CTRL_C_EVENT)
                            else:
                                # Kirim ke process group agar semua child process ikut berhenti
                                os.killpg(os.getpgid(proc.pid), signal.SIGINT)
                        except Exception:
                            pass
                    await websocket.send_json({"type": "output", "text": "^C (SIGINT dikirim ke proses)"})
                else:
                    await websocket.send_json({"type": "output", "text": "^C (tidak ada proses aktif)"})
                continue

            # ── cd — ubah direktori ──────────────────────────────────────────
            if cmd.startswith("cd ") or cmd == "cd":
                parts = cmd.split(" ", 1)
                target = parts[1].strip() if len(parts) > 1 else "~"

                if target == "~":
                    current_dir = os.path.expanduser("~")
                elif target == "..":
                    current_dir = os.path.dirname(current_dir)
                else:
                    new_dir = os.path.abspath(os.path.join(current_dir, target))
                    if os.path.isdir(new_dir):
                        current_dir = new_dir
                    else:
                        await websocket.send_json({"type": "output", "text": f"cd: {target}: No such file or directory"})
                        continue

                session_env["PWD"] = current_dir
                await websocket.send_json({"type": "path", "path": current_dir})
                await websocket.send_json({"type": "output", "text": ""})
                continue

            # ── source — capture environment variable ────────────────────────
            cmd_stripped = cmd.strip()
            is_source = (
                cmd_stripped.startswith("source ")
                or cmd_stripped.startswith(". ")
            )

            if is_source and not IS_WINDOWS:
                loop = asyncio.get_event_loop()

                def do_source():
                    return capture_env_after_source(cmd_stripped, current_dir, session_env)

                new_env, error = await loop.run_in_executor(None, do_source)

                if error:
                    await websocket.send_json({"type": "output", "text": f"source error: {error}"})
                else:
                    session_env.update(new_env)
                    await websocket.send_json({"type": "output", "text": "✅ Environment loaded successfully."})
                continue

            # ── Custom ROV commands ──────────────────────────────────────────
            cmd_lower = cmd.lower()

            if cmd_lower == "help":
                help_text = (
                    "Xplore Robot Terminal v1.0.4\n"
                    "Available commands:\n"
                    "- help     : Show this message\n"
                    "- clear    : Clear terminal window\n"
                    "- ls       : List directory contents\n"
                    "- cd       : Change directory\n"
                    "- pwd      : Print working directory\n"
                    "- source   : Load environment (persists for session)\n"
                    "- status   : Show vehicle telemetry status\n"
                    "- date     : Show current system date\n"
                    "- Ctrl+C   : Stop running process (ros2 launch, dll)"
                )
                await websocket.send_json({"type": "output", "text": help_text})
                continue

            elif cmd_lower == "status":
                await websocket.send_json({"type": "output", "text": "SYSTEM NORMAL. Armed: False, Mode: STABILIZE, Depth: 0.0m"})
                continue

            # ── Auto-translator Linux → Windows ─────────────────────────────
            if IS_WINDOWS:
                if cmd_lower == "ls" or cmd_lower.startswith("ls "):
                    cmd = "dir"
                elif cmd_lower == "pwd":
                    cmd = "echo %cd%"
                elif cmd_lower == "date":
                    cmd = "date /t"
                elif cmd_lower == "time":
                    cmd = "time /t"

            # ── Deteksi apakah perintah ini "long-running" ───────────────────
            # Perintah ros2 launch dan sejenisnya dijalankan pakai Popen
            # agar bisa di-stream outputnya dan di-kill kapan saja.
            LONG_RUNNING_PREFIXES = (
                'ros2 launch',
                'ros2 run',
                'rosbridge',
                'python ',
                'python3 ',
                'bash ',
                'sh ',
                'node ',
                'npm ',
                'uvicorn',
                'colcon',
            )

            is_long_running = any(cmd.lower().startswith(p) for p in LONG_RUNNING_PREFIXES)

            if is_long_running:
                # ── Background Popen dengan real-time streaming output ────────
                try:
                    exec_env = dict(session_env)
                    exec_dir = current_dir

                    proc = subprocess.Popen(
                        cmd,
                        cwd=exec_dir,
                        shell=True,
                        executable=None if IS_WINDOWS else '/bin/bash',
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                        errors='replace',
                        env=exec_env,
                        # Buat process group sendiri agar os.killpg bisa kill semua child
                        preexec_fn=None if IS_WINDOWS else os.setsid,
                    )

                    proc_counter += 1
                    running_procs[proc_counter] = proc
                    current_proc_id = proc_counter

                    await websocket.send_json({
                        "type": "output",
                        "text": f"▶ Proses dimulai (PID {proc.pid}). Tekan Ctrl+C untuk menghentikan."
                    })

                    # Stream output secara async tanpa blocking loop utama
                    asyncio.create_task(stream_proc_output(proc, current_proc_id))

                except Exception as e:
                    await websocket.send_json({"type": "output", "text": f"Gagal menjalankan: {str(e)}"})

            else:
                # ── Perintah biasa — jalankan dan tunggu hasilnya ────────────
                try:
                    loop = asyncio.get_event_loop()
                    exec_env = dict(session_env)
                    exec_dir = current_dir
                    exec_cmd = cmd

                    def run_terminal():
                        return subprocess.run(
                            exec_cmd,
                            cwd=exec_dir,
                            shell=True,
                            executable=None if IS_WINDOWS else '/bin/bash',
                            capture_output=True,
                            text=True,
                            errors='replace',
                            env=exec_env,
                        )

                    result = await loop.run_in_executor(None, run_terminal)

                    output = ""
                    if result.stdout:
                        output += result.stdout
                    if result.stderr:
                        output += result.stderr

                    await websocket.send_json({
                        "type": "output",
                        "text": output.strip() if output.strip() else "(no output)"
                    })

                except Exception as e:
                    await websocket.send_json({"type": "output", "text": f"Gagal mengeksekusi: {str(e)}"})

    except Exception as e:
        print(f"Client disconnected: {e}")
    finally:
        # Cleanup: kill semua proses yang masih jalan saat client disconnect
        for proc in running_procs.values():
            try:
                if IS_WINDOWS:
                    proc.terminate()
                else:
                    os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
            except Exception:
                pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)