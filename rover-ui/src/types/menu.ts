import { 
  Home, 
  Activity, 
  Settings, 
  Info, 
  Package, 
  Gamepad2,
  Navigation, 
  Terminal,
  Video,
  Cpu, 
  SlidersHorizontal, 
  FileSearch 
} from 'lucide-react';

export const menuGroups = [
  {
    title: "VEHICLE",
    items: [
      { title: "Home Menu", icon: Home, path: "/" },
      { title: "Live Telemetry", icon: Activity, path: "/live" },
      { title: "Vehicle Setup", icon: Settings, path: "/setup" },
      { title: "Simulation", icon: Gamepad2, path: "/manualros2" },
      { title: "Autonomous", icon: Navigation, path: "/autonomous" } 
    ]
  },
  {
    title: "AUTOPILOT",
    items: [
      { title: "Autopilot Firmware", icon: Cpu, path: "/manual" }, 
      { title: "Autopilot Parameters", icon: SlidersHorizontal, path: "/params" }, 
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { title: "System Information", icon: Info, path: "/system-info" },
      { title: "BlueOS Version", icon: Package, path: "/blueos", status: "BETA" },
      { title: "Terminal", icon: Terminal, path: "/terminal" },
      { title: "Video Streams", icon: Video, path: "/video" },
      { title: "Log Browser", icon: FileSearch, path: "/logs" } 
    ]
  }
];