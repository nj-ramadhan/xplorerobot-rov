"""
mavlink.py — WebSocket Bridge untuk MAVLink / ROV
Jalankan TERPISAH: uvicorn mavlink:app --host 0.0.0.0 --port 8001 --reload

CATATAN: File ini hanya dijalankan kalau ROV / SITL sudah aktif.
         Kalau ROV belum nyala, tidak perlu jalankan file ini.
"""

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pymavlink import mavutil
import asyncio
import json

# ══════════════════════════════════════════════════════════════════════════════
# KONEKSI MAVLINK
# Ganti alamat sesuai koneksi ROV kamu:
#   SITL lokal  : tcp:127.0.0.1:5762
#   Serial       : /dev/ttyUSB0  (Linux) atau COM3 (Windows)
#   UDP          : udp:0.0.0.0:14550
# ══════════════════════════════════════════════════════════════════════════════

MAVLINK_ADDRESS = "tcp:127.0.0.1:5762"

print(f"🔄 Menghubungkan ke ROV di {MAVLINK_ADDRESS} ...")
master = mavutil.mavlink_connection(MAVLINK_ADDRESS)
print("✅ MAVLink terhubung!")

# ══════════════════════════════════════════════════════════════════════════════
# FASTAPI APP
# ══════════════════════════════════════════════════════════════════════════════

app = FastAPI(title="ROV MAVLink WebSocket Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ══════════════════════════════════════════════════════════════════════════════
# WEBSOCKET
# ══════════════════════════════════════════════════════════════════════════════

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("🚀 Frontend terhubung via WebSocket!")

    async def receive_from_web():
        """Terima perintah dari frontend (arm, disarm, rc, dll)."""
        try:
            while True:
                data   = await websocket.receive_text()
                cmd    = json.loads(data)
                action = cmd.get("action")

                if action == "arm":
                    master.arducopter_arm()
                    print("⚙️  ARM")

                elif action == "disarm":
                    master.arducopter_disarm()
                    print("🛑 DISARM")

                elif action == "get_params":
                    master.mav.param_request_list_send(
                        master.target_system, master.target_component
                    )
                    print("📡 Request params...")

                elif action == "rc":
                    channels  = cmd.get("channels", {})
                    rc_values = [65535] * 8
                    for ch, pwm in channels.items():
                        rc_values[int(ch) - 1] = pwm
                    master.mav.rc_channels_override_send(
                        master.target_system, master.target_component, *rc_values
                    )
        except Exception:
            pass

    async def send_to_web():
        """Kirim data telemetry ROV ke frontend."""
        try:
            while True:
                msg = master.recv_match(blocking=False)
                while msg:
                    t = msg.get_type()
                    if t == "ATTITUDE":
                        await websocket.send_json({
                            "type":  "ATTITUDE",
                            "roll":  round(msg.roll,  2),
                            "pitch": round(msg.pitch, 2),
                            "yaw":   round(msg.yaw,   2),
                        })
                    elif t == "PARAM_VALUE":
                        await websocket.send_json({
                            "type":  "PARAM",
                            "name":  msg.param_id,
                            "value": msg.param_value,
                        })
                    msg = master.recv_match(blocking=False)
                await asyncio.sleep(0.05)
        except Exception:
            pass

    await asyncio.gather(receive_from_web(), send_to_web())