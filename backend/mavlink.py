"""
mavlink.py — WebSocket Bridge untuk MAVLink / ROV (Pixhawk / ArduSub)
Jalankan TERPISAH: uvicorn mavlink:app --host 0.0.0.0 --port 8001 --reload

CATATAN: 
File ini menghubungkan sistem kontrol dasar robot (Pixhawk).
Untuk hardware asli, ubah MAVLINK_ADDRESS ke port Serial atau IP Companion Computer.
"""

import asyncio
import json
import time
import os
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pymavlink import mavutil
import threading


load_dotenv()

# ══════════════════════════════════════════════════════════════════════════════
# KONEKSI MAVLINK
# Ganti alamat sesuai koneksi ROV kamu:
#   SITL lokal  : tcp:127.0.0.1:5762
#   Serial asli : /dev/ttyACM0 atau /dev/ttyUSB0 (Colok langsung Pixhawk ke Raspberry Pi)
#   UDP BlueOS  : udp:192.168.2.1:14550
# ══════════════════════════════════════════════════════════════════════════════

MAVLINK_ADDRESS = os.getenv("MAVLINK_CONNECTION_STRING", "tcp:127.0.0.1:5762")

app = FastAPI(title="ROV MAVLink Bridge")

print(f"🔄 Menghubungkan ke ROV Pixhawk di {MAVLINK_ADDRESS} ...")
while True:
    try:
        master = mavutil.mavlink_connection(MAVLINK_ADDRESS)
        master.wait_heartbeat(timeout=2)
        print("✅ MAVLink terhubung!")
        break
    except Exception as e:
        print(f"⏳ SITL belum nyala, mencoba lagi dalam 3 detik...")
        time.sleep(3)

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
    print("🚀 Frontend React terhubung ke Telemetry MAVLink!")

    async def receive_from_web():
        """Terima perintah dari frontend (arm, disarm, rc, dll)."""
        try:
            while True:
                data   = await websocket.receive_text()
                cmd    = json.loads(data)
                action = cmd.get("action")

                if action == "arm":
                    master.arducopter_arm()
                    print("⚙️  ARM COMMAND SENT")

                elif action == "disarm":
                    master.arducopter_disarm()
                    print("🛑 DISARM COMMAND SENT")

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
        """Kirim data telemetry ROV ke frontend secara real-time."""
        try:
            while True:
                msg = master.recv_match(blocking=False)
                while msg:
                    t = msg.get_type()
                    
                    # 1. Data Kemiringan (Roll, Pitch, Yaw)
                    if t == "ATTITUDE":
                        await websocket.send_json({
                            "type":  "ATTITUDE",
                            "roll":  round(msg.roll,  2),
                            "pitch": round(msg.pitch, 2),
                            "yaw":   round(msg.yaw,   2),
                        })
                        
                    # 2. Data Kedalaman (Depth) dan Arah Kompas (Heading)
                    elif t == "VFR_HUD":
                        await websocket.send_json({
                            "type":  "VFR_HUD",
                            "depth": round(msg.alt, 2), # alt merepresentasikan depth meter
                            "heading": msg.heading
                        })
                        
                    # 3. Data Baterai (Voltage)
                    elif t == "SYS_STATUS":
                        await websocket.send_json({
                            "type":  "BATTERY",
                            "voltage": round(msg.voltage_battery / 1000.0, 2) # Ubah milivolt ke Volt
                        })
                        
                    # 4. Status Sistem (Armed/Disarm & Mode Navigasi)
                    elif t == "HEARTBEAT":
                        # 🔥 FILTER: Pastikan ini detak jantung dari robot (Target System), bukan dari QGroundControl
                        if msg.get_srcSystem() == master.target_system:
                            is_armed = msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED
                            mode_name = mavutil.mode_string_v10(msg)
                            await websocket.send_json({
                                "type":  "HEARTBEAT",
                                "armed": bool(is_armed),
                                "mode":  mode_name
                            })
                        
                    # 5. Data Parameter (Kalibrasi dll)
                    elif t == "PARAM_VALUE":
                        await websocket.send_json({
                            "type":  "PARAM",
                            "name":  msg.param_id,
                            "value": msg.param_value,
                        })
                        
                    # 6. Data Output PWM Motor (Untuk Grafik Thruster)
                    elif t == "SERVO_OUTPUT_RAW":
                        await websocket.send_json({
                            "type": "SERVO_OUTPUT",
                            "ch1": msg.servo1_raw,
                            "ch2": msg.servo2_raw,
                            "ch3": msg.servo3_raw,
                            "ch4": msg.servo4_raw,
                            "ch5": msg.servo5_raw,
                            "ch6": msg.servo6_raw,
                            "ch7": msg.servo7_raw,
                            "ch8": msg.servo8_raw
                        })
                        
                    msg = master.recv_match(blocking=False)
                
                # Jeda kecil agar CPU tidak overload
                await asyncio.sleep(0.05)
        except Exception:
            pass

    await asyncio.gather(receive_from_web(), send_to_web())