# polman-dsk-ros2-amr
Autonomous Mobile Robot (AMR) using ROS2 framework developed in Bandung Polytechnic for Manufacturing (Polman Bandung)


### **XR ROV: System Setup & Deployment Guide**

#### **1. Initial System Preparation**
To ensure the AMR software runs correctly, the system must support **UTF-8** and have the necessary repositories enabled.

*   **Set Locale:** 
    ```bash
    sudo apt update && sudo apt install locales
    sudo locale-gen en_US en_US.UTF-8
    sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
    export LANG=en_US.UTF-8
    ```
    *This ensures communication between ROS nodes doesn't fail due to encoding issues.*

*   **Enable Repositories:**
    ```bash
    sudo apt install software-properties-common
    sudo add-apt-repository universe
    ```
    *The Universe repository is required for many ROS 2 dependencies.*

#### **2. Automated ROS 2 Installation**
For easy re-deployment, use the `ros2-apt-source` package to automatically configure your repository settings.

*   **Configure Repository:**
    ```bash
    sudo apt update && sudo apt install curl -y
    export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F\" '{print $4}')
    curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
    sudo dpkg -i /tmp/ros2-apt-source.deb
    ```

*   **Install Core Packages:**
    ```bash
    sudo apt update && sudo apt upgrade
    sudo apt install ros-${ROS_DISTRO}-desktop ros-dev-tools -y
    ```
    *The **Desktop Install** includes RViz, demos, and tutorials essential for AMR development.*

#### **3. Re-deployment Automation (Environment Setup)**
To avoid manually running setup scripts every time you open a terminal, automate the environment variables.

*   **Clone this Repository:**
    ```bash
    git clone https://github.com/nj-ramadhan/polman-mbd-ros2-polebot-amr.git
    ```


*   **Configure Bash Session:**
    ```bash
    echo "source /opt/ros/${ROS_DISTRO}/setup.bash" >> ~/.bashrc
    echo "source ~/xr_rov_ws/install/setup.bash" >> ~/.bashrc
    source ~/.bashrc
    ```
    *This command tells your computer how to find ROS 2 commands automatically in every new terminal window.*

*   **Initialize Dependency Manager:**
    ```bash
    sudo rosdep init
    rosdep update
    ```
    *`rosdep` helps manage and install dependencies for your specific XR ROV packages.*

#### **4. Simulation & Support Tools**
XR ROV relies on **Gazebo** for simulation and **NumPy** for scientific computing.

*   **Install Gazebo and Python Tools:**
    ```bash
    sudo apt-get install python3-pip python3-numpy -y
    sudo apt-get install ros-jazzy-ros-gz -y
    ```

*   **Verification:** Test the simulation environment by running:
    ```bash
    gz sim -v 4 shapes.sdf
    ```
    *If successful, you can also launch it via ROS 2:*
    `ros2 launch ros_gz_sim gz_sim.launch.py gz_args:="shapes.sdf"`.

#### **5. Validating Communication (The "Hello World")**
To ensure the Polebot nodes can talk to each other, use the built-in demo nodes.

1.  **Terminal 1 (Publisher):** `ros2 run demo_nodes_cpp talker`.
2.  **Terminal 2 (Subscriber):** `ros2 run demo_nodes_py listener`.

**Tip:** Install **Terminator** to manage multiple AMR processes in a single window.
```bash
sudo apt-get install terminator -y
```

---

### **Core Concepts for Developers**
When documenting new code for XR ROV, remember these three vital ROS 2 terms:
1.  **Nodes:** Programs that perform tasks.
2.  **Publishers:** Programs (like sensors) that send data (e.g., a depth camera).
3.  **Subscribers:** Programs (like wheel controllers) that receive data to act upon it (e.g., stopping if an obstacle is detected).

The XR ROV code is distributed under the **GPL-3.0 license**. For easier workspace management, you may use the provided `.code-workspace` file in the repository.


# Install all missing dependencies automatically
```bash
rosdep install --from-paths src --ignore-src -r -y
```

# Enter the src folder to clone depedencies
```bash
cd src
git clone https://github.com/nj-ramadhan/ros2_pose_to_tf.git
git clone https://github.com/nj-ramadhan/ros2_auv_control.git
git clone https://github.com/nj-ramadhan/ros2_thruster_manager.git
```

## Check for Roboteq Driver
Note on Permissions (Outside Source Information): If you find the correct port but still get an error, it might be a permission issue. You may need to grant access to the dialout group using 
```bash
sudo usermod -a -G dialout $USER
```
and then restart your session.

## install slider_publisher
```bash
sudo apt-get install ros-${ROS_DISTRO}-slider-publisher
```

## install rtab_map
```bash
sudo apt-get install ros-${ROS_DISTRO}-rtabmap ros-${ROS_DISTRO}-rtabmap-odom ros-${ROS_DISTRO}-rtabmap-viz ros-${ROS_DISTRO}-rtabmap-slam -y
```

## install Nav2
```bash
sudo apt-get install ros-${ROS_DISTRO}-nav2-bringup -y
```

## install Resbridge Server and NPM for GUI server
```bash
sudo apt install ros-${ROS_DISTRO}-rosbridge-server -y
```

### Install NPM, makes sure it's latest version to support vite.js
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install node
```

### Run GUI Front-end
```bash
cd ~/xr_rov_ws/src/xr_rov/xr_rov_webserver
npm install
npm run dev
```

### Install Database back-end
#### Install MariaDB for Backend
```bash
sudo apt install mariadb-server
sudo systemctl status mariadb
```

#### Install PHP my Admin for Backend
```bash
sudo apt install phpmyadmin
```
choose apache
choose yes for password config
input your PASSWORD

```bash
sudo mysql
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'amr2025';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE USER 'amr'@'localhost' IDENTIFIED BY 'amr2025';
GRANT ALL PRIVILEGES ON *.* TO 'amr'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE DATABASE polebot;
exit

sudo mysql -u amr -p polebot < polebot.sql
```

### Run GUI Back-end
```bash
cd ~/xr_rov_ws/src/xr_rov/xr_rov_webserver_backend
npm install
node index.js
```


### Running
To run a demonstration with the vehicle, you can run a Gazebo scenario, such as an empty world with buoyancy and sensors setup:

    ros2 launch xr_rov_description world_launch.py

and then spawn the robot with a GUI to control the thrusters:

    ros2 launch xr_rov_description upload_xr_rov_launch.py sliders:=true

### High-level control
Basic control is available in the auv_control package
In this case spawn the robot without manual sliders and run e.g. a cascaded PID controller:

    ros2 launch xr_rov_description upload_xr_rov_launch.py
    ros2 launch xr_rov_control cascaded_pids_launch.py sliders:=true