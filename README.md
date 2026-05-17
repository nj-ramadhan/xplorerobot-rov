# 🌊 ROV Ground Control Station (GCS) 

## 📖 Tentang Proyek

<div align="justify">
Website ini merupakan antarmuka <b>Ground Control Station (GCS)</b> yang dirancang secara khusus untuk memonitor, mengontrol, dan menyimulasikan <i>Remotely Operated Vehicle</i> (ROV) bawah air. Proyek ini dikembangkan sebagai bagian dari sistem Rancang Bangun ROV untuk mendukung aktivitas eksplorasi dan observasi bawah laut.
<br><br>
Dashboard ini bertindak sebagai pusat komando yang menjembatani komunikasi <i>real-time</i> antara operator dan sistem robotika. Sistem ini mengintegrasikan data telemetri dari robot dengan simulasi visual, memberikan kendali penuh kepada operator melalui antarmuka web modern yang responsif.
</div>

### ✨ Fitur Utama
- **Mission Control (Pusat Misi):** Antarmuka utama untuk memberikan perintah kendali pergerakan ROV (mendukung manuver navigasi 6-DOF) dan memantau status operasional robot secara keseluruhan.
- **Engineering Data (Data Teknikal):** Visualisasi data telemetri secara *real-time*. Fitur ini menampilkan status sensor, kinerja aktuator/kinematika *thruster*, kondisi baterai, dan diagnostik sistem robot.
- **Simulasi Terintegrasi:** Terhubung langsung dengan *environment* simulasi (Gazebo), memungkinkan operator untuk melakukan pengujian pergerakan dan logika ROV di lingkungan virtual sebelum diturunkan ke perairan asli.
- **Komunikasi Web-ke-ROS2:** Menggunakan backend API sebagai jembatan untuk menerjemahkan interaksi di web (HTTP/WebSocket) menjadi *topics* dan *services* yang secara langsung dibaca dan dieksekusi oleh ekosistem ROS2 pada perangkat keras robot.

### 🛠️ Bahasa & Tools yang Digunakan
Proyek ini dibangun menggunakan arsitektur modern yang memisahkan frontend, backend, dan sistem robotika agar sistem berjalan ringan dan *scalable*:
- **Frontend:** React.js, Tailwind CSS (Menghadirkan UI/UX yang intuitif dan mudah dibaca oleh operator).
- **Backend & API Bridge:** Python, FastAPI (Menangani *routing* data secara asinkron dan cepat dari web ke sistem robot).
- **Robot Framework:** ROS2 (Humble / Jazzy) sebagai sistem operasi utama penyusun *node* robotika.
- **Simulasi:** Gazebo (Lingkungan pengujian virtual 3D).

---

## 🚀 Cara Clone dan Menjalankan Website

Ikuti langkah-langkah di bawah ini untuk menjalankan dashboard ini di komputer lokal kamu.

### 1. Clone Repository
Buka terminal dan jalankan perintah berikut untuk mengunduh kode dari GitHub:

```bash
git clone [ https://github.com/MahendraNur/ROV-Polman-Bandung ]
cd rover-ui
```

### 2. Setup Frontend (React)
Pastikan kamu sudah berada di dalam folder `rover-ui`. Kemudian, masuk ke folder frontend, install dependencies, dan jalankan server:

```bash
cd frontend
npm install
npm run dev
```
*Website biasanya akan berjalan di http://localhost:5173.*

### 3. Setup Backend (FastAPI & ROS2 Bridge)
Buka terminal baru. Masuk dulu ke folder utama `rover-ui`, lalu masuk ke folder backend. Pastikan environment ROS2 sudah di-source, lalu jalankan server API:

```bash
cd rover-ui
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🤖 Panduan Instalasi ROS2
Proyek ini membutuhkan ROS2 (direkomendasikan versi Humble untuk Ubuntu 22.04 atau Jazzy untuk Ubuntu 24.04).

### Langkah Instalasi (Ubuntu)

**1. Set Locale**
```bash
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

**2. Setup Sources**
```bash
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL [https://raw.githubusercontent.com/ros/rosdistro/master/ros.key](https://raw.githubusercontent.com/ros/rosdistro/master/ros.key) -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] [http://packages.ros.org/ros2/ubuntu](http://packages.ros.org/ros2/ubuntu) $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

**3. Install ROS2 Desktop**
```bash
sudo apt update
sudo apt upgrade
sudo apt install ros-humble-desktop 
```
*(Ganti humble menjadi jazzy jika menggunakan Ubuntu 24.04)*

**4. Environment Setup**
Agar perintah ROS2 bisa dikenali secara otomatis:
```bash
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

**5. Install Development Tools**
```bash
sudo apt install ros-dev-tools python3-colcon-common-extensions
```

---
## 🎮 Panduan Instalasi Gazebo (Harmonic)
Gazebo Harmonic adalah simulator standar untuk ROS 2 Jazzy guna menjalankan simulasi ROV.

**1. Instalasi Gazebo**
```bash
sudo apt-get update
sudo apt-get install lsb-release wget gnupg

# Tambahkan Key & Repository Gazebo
sudo wget [https://packages.osrfoundation.org/gazebo.gpg](https://packages.osrfoundation.org/gazebo.gpg) -O /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] [http://packages.osrfoundation.org/gazebo/ubuntu-stable](http://packages.osrfoundation.org/gazebo/ubuntu-stable) $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list > /dev/null

# Install Gazebo Harmonic
sudo apt-get update
sudo apt-get install gz-harmonic
```
**2. Integrasi ROS 2 & Gazebo (GZ Bridge)**
Agar data dari Gazebo bisa dibaca oleh website melalui ROS 2, kamu perlu menginstal bridge:
```bash
sudo apt install ros-jazzy-ros-gz
```

---
## 🕹️ Fitur Kendali & Simulasi

Dashboard ini menyediakan antarmuka kendali yang komprehensif untuk memastikan operasional ROV berjalan aman dan presisi, baik dalam lingkungan simulasi maupun nyata.

### 🎮 1. Manual Override (6-DOF Control)
Fitur ini memungkinkan operator untuk mengambil kendali penuh atas pergerakan robot secara manual.
- **Linear Axis:** Mengatur pergerakan maju-mundur (*Forward*), geser kiri-kanan (*Lateral*), dan naik-turun (*Vertical*).
- **Angular Axis:** Mengontrol orientasi robot meliputi *Roll*, *Pitch*, dan *Yaw* untuk navigasi bawah air yang kompleks.
- **Real-time PWM Monitoring:** Menampilkan nilai PWM aktif untuk setiap kanal (CH1 - CH6) guna memastikan sinkronisasi antara input operator dan respon *thruster*.
- **Auxiliary Control:** Kendali tambahan untuk menyalakan lampu (*Lights*) dan mengoperasikan penjepit (*Gripper*).

#### 📋Pre-Flight Checklist
Sistem keamanan yang memastikan seluruh komponen perangkat lunak siap sebelum robot dijalankan. Operator wajib menyelesaikan tahapan inisialisasi:
1. **Environment Setup:** Mengaktifkan simulator ArduSub SITL pada Ubuntu/WSL.
2. **QGroundControl Connection:** Opsional, untuk validasi model 3D dan koneksi UDP.
3. **Backend Synchronization:** Memastikan jembatan FastAPI telah terhubung (status *Connected*) untuk transmisi data telemetri.

#### 🌐Integrasi Gazebo & ArduSub SITL
Project ini dirancang untuk bekerja secara mulus dengan simulator **Gazebo** melalui firmware **ArduSub**.
- **Telemetri Real-time:** Menampilkan data *Roll, Pitch,* dan *Heading* langsung dari simulator ke dashboard web.
- **Environment Virtual:** Memungkinkan pengujian logika kontrol dan manuver ROV dalam tangki air virtual tanpa risiko kerusakan perangkat keras asli.
---

### ⚙️ 2. Direct Thruster Matrix & Command Queue
Fitur ini dirancang untuk kebutuhan teknis dan kalibrasi sistem penggerak ROV secara individu.
- **Individual Thruster Control:** Operator dapat mengatur kecepatan/daya tiap thruster (T1 hingga T6) secara mandiri menggunakan slider, memudahkan pengecekan jika ada thruster yang macet atau tidak seimbang.
- **Command Queue (Antrean Perintah):** Fitur untuk menyusun urutan perintah gerakan tertentu sebelum dieksekusi secara masal melalui tombol "Apply Semua".
- **Safety Mechanism:** Dilengkapi dengan tombol **Emergency Stop All** yang akan mematikan seluruh aliran daya ke aktuator secara instan jika terjadi malfungsi saat simulasi.
#### 🛡️ROS 2 Pre-Flight Checklist (Advanced)
Untuk menjamin stabilitas komunikasi antara Web Dashboard dan simulator, sistem menyediakan validasi berlapis:
1. **Gazebo & ROSBridge Aktif:** Memastikan jembatan WebSocket (`rosbridge_suite`) telah berjalan untuk mengirimkan data dari backend ke frontend.
2. **Thruster Manager Standby:** Memvalidasi bahwa node Python `thruster_manager.py` sudah siap memproses kalkulasi matriks kinematika robot.
3. **Connection Guard:** Dashboard akan menampilkan status "Koneksi Gagal" disertai instruksi perbaikan jika komunikasi data terputus.
---

### 🤖 3. Autonomous Mission Control
Fitur navigasi otonom yang memungkinkan ROV menjalankan misi secara mandiri berdasarkan titik koordinat (Waypoints) yang ditentukan. Fitur ini memiliki dua mode utama:

- **Mode 1 — Waypoint + Orientasi:** Operator dapat menentukan titik tujuan pada peta. Setelah titik dipilih, muncul pop-up konfirmasi untuk mengatur kedalaman (*Depth*) dan orientasi robot saat tiba di lokasi tersebut.
- **Mode 2 — Path Drawing:** Memungkinkan operator membuat jalur navigasi dengan cara klik dan tahan pada peta (*drag*) untuk menentukan arah hadap secara visual, lalu melepaskannya untuk menyimpan urutan waypoint.

**Fitur Pendukung Otonom:**
- **Default Depth Control:** Slider untuk mengatur kedalaman operasional standar (contoh: -2.0m) agar ROV tetap berada di level air yang diinginkan.
- **Mission Database:** Kemampuan untuk memuat (*Load*) misi yang sebelumnya telah disimpan di database dan menjalankannya kembali ke simulator.
- **Real-time Telemetry Tracking:** Memantau posisi koordinat X, Y, Z, serta nilai Yaw dan Heading secara presisi saat robot bergerak menuju target.
---
### 📋 4. Mission Management (Builder & Library)
Fitur ini berfungsi sebagai pusat perencanaan misi sebelum ROV dideploy ke simulator atau lapangan. Operator dapat merancang skenario misi yang kompleks secara terorganisir.

- **Mission Builder:** Antarmuka interaktif untuk menyusun urutan koordinat (Sequence) secara grafis. Operator dapat memberikan nama misi (misal: "Inspeksi Pipa A") dan memilih mode navigasi yang diinginkan.
- **Saved Missions Library:** Fitur penyimpanan yang memungkinkan operator mencari dan memuat kembali misi-misi yang telah dibuat sebelumnya dari database. Hal ini memudahkan pengujian ulang skenario yang sama secara konsisten.
- **Mission Sequence Preview:** Panel kanan menampilkan daftar urutan titik waypoint yang telah direncanakan beserta estimasi kedalamannya, memberikan gambaran utuh rencana perjalanan robot.
- **Database Integration:** Seluruh konfigurasi misi disimpan secara terpusat, memastikan data misi tidak hilang saat aplikasi ditutup atau direstart.
---


*Dikembangkan untuk proyek Rancang Bangun ROV - Politeknik Manufaktur Bandung*
