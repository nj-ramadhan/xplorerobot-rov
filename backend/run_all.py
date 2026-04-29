import subprocess
import sys
import time

# Daftar proses yang akan dijalankan
processes = []

try:
    print("🚀 Memulai XploreRobot Backend Services...\n")

    print("1️⃣ Starting Database & Mission API (Port 8000)...")
    processes.append(subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]))

    print("2️⃣ Starting MAVLink Bridge (Port 8001)...")
    processes.append(subprocess.Popen([sys.executable, "-m", "uvicorn", "mavlink:app", "--host", "0.0.0.0", "--port", "8001"]))

    print("3️⃣ Starting Terminal Server (Port 8002)...")
    processes.append(subprocess.Popen([sys.executable, "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8002"]))

    print("4️⃣ Starting ROS 2 Hardware Bridge (Port 8003)...")
    # ros2_bridge.py dijalankan langsung pakai python, bukan uvicorn
    processes.append(subprocess.Popen([sys.executable, "ros2_bridge.py"]))

    print("\n✅ SEMUA SERVER BERHASIL DIJALANKAN BERBARENGAN!")
    print("💡 Biarkan terminal ini terbuka. Tekan Ctrl+C untuk mematikan semuanya sekaligus.\n")

    # Menjaga script tetap hidup agar proses di latar belakang tidak mati
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\n🛑 Mematikan semua server XploreRobot...")
    for p in processes:
        p.terminate()
    print("✅ Semua server telah berhasil dimatikan.")