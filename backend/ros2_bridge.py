"""
ros2_bridge.py — ROS 2 Hardware WebSocket Bridge
Jalankan TERPISAH: python3 ros2_bridge.py 
(Tidak menggunakan uvicorn --reload karena rclpy tidak mendukung multiprocessing reload dengan baik)

CATATAN:
File ini digunakan untuk menangkap data dari perangkat keras tambahan (Non-Pixhawk)
yang terhubung ke ekosistem ROS 2, seperti ESP32, Lidar, atau Sensor Sonar.
"""

import asyncio
import threading
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import rclpy
from rclpy.node import Node

# Import pesan standar ROS 2 (Sesuaikan jika nanti kamu punya tipe pesan custom)
from std_msgs.msg import Float32, String
from sensor_msgs.msg import Range

app = FastAPI(title="ROV ROS 2 Hardware Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Menyimpan daftar websocket tab browser yang aktif
active_websockets = []

# ==========================================
# 1. NODE ROS 2 UNTUK HARDWARE
# ==========================================
class HardwareBridgeNode(Node):
    def __init__(self):
        super().__init__('rov_hardware_bridge')
        
        # ── SUBSCRIBE: Menerima data DARI Hardware ke Website ──
        # Contoh 1: Menangkap data dari sensor jarak Sonar Ping
        self.sonar_sub = self.create_subscription(Range, '/rov/sensors/ping_sonar', self.sonar_callback, 10)
        
        # Contoh 2: Menangkap suhu air dari ESP32 (micro-ROS)
        self.temp_sub = self.create_subscription(Float32, '/rov/sensors/water_temp', self.temp_callback, 10)

        # ── PUBLISH: Mengirim perintah DARI Website ke Hardware ──
        # Contoh: Perintah menyalakan/mematikan lampu bawah air (Lights)
        self.light_pub = self.create_publisher(Float32, '/rov/actuators/lights', 10)

        self.get_logger().info("✅ ROS 2 Hardware Bridge Node Active!")

    # Callback saat hardware mengirim data Sonar
    def sonar_callback(self, msg):
        data = {
            "type": "SENSOR_SONAR",
            "distance_meter": round(msg.range, 2)
        }
        self.broadcast_to_web(data)

    # Callback saat hardware (ESP32) mengirim data Suhu
    def temp_callback(self, msg):
        data = {
            "type": "SENSOR_TEMP",
            "celcius": round(msg.data, 2)
        }
        self.broadcast_to_web(data)

    # Fungsi untuk menyiarkan data ke semua tab React yang terbuka
    def broadcast_to_web(self, data):
        for ws in active_websockets:
            try:
                # Harus menggunakan threadsafe karena rclpy berjalan di thread berbeda dari FastAPI
                asyncio.run_coroutine_threadsafe(ws.send_json(data), loop)
            except Exception as e:
                pass


# ==========================================
# 2. FASTAPI WEBSOCKET (Ke React UI)
# ==========================================
@app.websocket("/ws/hardware")
async def websocket_hardware(websocket: WebSocket):
    await websocket.accept()
    active_websockets.append(websocket)
    print("🚀 Frontend React terhubung ke ROS 2 Hardware!")
    
    try:
        while True:
            # Menerima perintah ketikan/tombol dari Website
            command = await websocket.receive_json()
            action = command.get("action")
            
            # Meneruskan perintah dari Website ke Hardware via ROS 2
            if action == "SET_LIGHTS":
                brightness = float(command.get("value", 0.0))
                msg = Float32()
                msg.data = brightness
                ros2_node.light_pub.publish(msg)
                print(f"💡 Perintah lampu dikirim: {brightness}%")
                
    except Exception as e:
        active_websockets.remove(websocket)


# ==========================================
# 3. BACKGROUND RUNNER MANAGER
# ==========================================
def spin_ros2_node():
    """Fungsi ini berjalan di background thread agar rclpy tidak memblokir FastAPI."""
    rclpy.init()
    global ros2_node
    ros2_node = HardwareBridgeNode()
    rclpy.spin(ros2_node)
    
    # Cleanup saat dimatikan
    ros2_node.destroy_node()
    rclpy.shutdown()

@app.on_event("startup")
async def startup_event():
    global loop
    loop = asyncio.get_running_loop()
    # Mulai mesin ROS 2 di thread terpisah saat server web menyala
    threading.Thread(target=spin_ros2_node, daemon=True).start()

if __name__ == "__main__":
    import uvicorn
    # Jalankan server di port 8003 khusus untuk Hardware Tambahan ROS 2
    uvicorn.run(app, host="0.0.0.0", port=8003)