import { 
  Home, 
  Activity, 
  Settings, 
  Info, 
  Package, 
  Gamepad2,
  Navigation, 
  MapPinPlusInsideIcon,
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
      { title: "Autonomous", icon: Navigation, path: "/autonomous" },
      { title: "Mission Control", icon: MapPinPlusInsideIcon, path: "/mission" }
    ]
  },
  {
    title: "AUTOPILOT",
    items: [
      { title: "Firmware Mavlink", icon: Cpu, path: "/manual" }, 
      { title: "Autopilot Firmware", icon: Cpu, path: "/firmware" }, 
      { title: "Autopilot Parameters", icon: SlidersHorizontal, path: "/params" }, 
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { title: "System Information", icon: Info, path: "/system-info" },
      { title: "Xplore Robot Version", icon: Package, path: "/blueos", status: "BETA" },
      { title: "Terminal", icon: Terminal, path: "/terminal" },
      { title: "Video Streams", icon: Video, path: "/video" },
      { title: "Log Browser", icon: FileSearch, path: "/logs" } 
    ]
  }
];