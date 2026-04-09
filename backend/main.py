from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pymavlink import mavutil
import asyncio
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Koneksi ke SITL 
print("🔄 Menghubungkan ke ROV di TCP 5762...")
master = mavutil.mavlink_connection('tcp:127.0.0.1:5762')

# Sengaja dimatikan agar Uvicorn langsung bisa jalan
# master.wait_heartbeat() 

print("✅ Backend Siap & Terhubung!")

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("🚀 Frontend React Terhubung!")
    
    async def receive_from_web():
        try:
            while True:
                data = await websocket.receive_text()
                cmd = json.loads(data)
                action = cmd.get("action")
                
                if action == "arm":
                    master.arducopter_arm()
                    print("⚙️ Perintah: ARM")
                elif action == "disarm":
                    master.arducopter_disarm()
                    print("🛑 Perintah: DISARM")
                elif action == "get_params":
                    master.mav.param_request_list_send(master.target_system, master.target_component)
                    print("📡 Meminta Daftar Parameter...")
                elif action == "rc":
                    channels = cmd.get("channels")
                    rc_values = [65535] * 8
                    for ch, pwm in channels.items():
                        rc_values[int(ch) - 1] = pwm
                    master.mav.rc_channels_override_send(
                        master.target_system, master.target_component, *rc_values
                    )
        except: pass

    async def send_to_web():
        try:
            while True:
                msg = master.recv_match(blocking=False)
                while msg:
                    msg_type = msg.get_type()
                    if msg_type == "ATTITUDE":
                        await websocket.send_json({
                            "type": "ATTITUDE", 
                            "roll": round(msg.roll, 2), 
                            "pitch": round(msg.pitch, 2), 
                            "yaw": round(msg.yaw, 2)
                        })
                    elif msg_type == "PARAM_VALUE":
                        await websocket.send_json({
                            "type": "PARAM", 
                            "name": msg.param_id, 
                            "value": msg.param_value
                        })
                    msg = master.recv_match(blocking=False)
                await asyncio.sleep(0.05)
        except: pass

    await asyncio.gather(receive_from_web(), send_to_web())