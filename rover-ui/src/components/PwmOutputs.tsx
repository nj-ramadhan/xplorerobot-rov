// src/components/PwmOutputs.tsx

// 1. Definisikan tipe data untuk channel motor
interface ChannelProps {
  id: number;
  value: number;
}

export default function PwmOutputs() {
  // 2. Data dummy (nanti kita ganti dengan data real dari backend)
  const channels: ChannelProps[] = [
    { id: 1, value: 1500 }, { id: 2, value: 1550 },
    { id: 3, value: 1400 }, { id: 4, value: 1600 },
    { id: 5, value: 1500 }, { id: 6, value: 1500 },
    { id: 7, value: 1900 }, { id: 8, value: 1100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bagian PWM */}
      <div>
        <h2 className="text-xl font-bold text-white">Motor & Servo Outputs</h2>
        <p className="text-sm text-gray-400">Monitoring real-time sinyal PWM ke ESC/Motor.</p>
      </div>

      {/* Grid List PWM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch) => (
          <div key={ch.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-200">Channel {ch.id}</span>
              <span className="text-blue-400 font-mono text-sm">{ch.value} µs</span>
            </div>
            
            {/* Bar Indikator */}
            <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((ch.value - 1100) / (1900 - 1100)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}