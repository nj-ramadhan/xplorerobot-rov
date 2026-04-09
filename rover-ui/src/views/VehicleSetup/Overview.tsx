export default function Overview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Kolom Kiri: 3D Model Placeholder (Span 2 kolom) */}
      <div className="lg:col-span-2 bg-[#0b111a] border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-slate-600 font-mono">[ 3D Model / Image Placeholder ]</span>
      </div>

      {/* Kolom Kanan: System Info & Sensors */}
      <div className="space-y-6">
        {/* System Info */}
        <div className="bg-[#0b111a] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-400 mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Flight Controller</span><span className="font-semibold">Pixhawk1</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Firmware</span><span className="font-semibold">ArduSub 4.5.0</span></div>
          </div>
        </div>

        {/* Sensors */}
        <div className="bg-[#0b111a] border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-400 mb-4">Autopilot Sensors</h2>
          <div className="space-y-3">
             {['ACC_MPU6000', 'LSM303D', 'MS5611'].map((sensor) => (
                <div key={sensor} className="flex justify-between items-center text-sm">
                    <span>{sensor}</span>
                    <span className="flex items-center text-green-500 text-xs"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>OK</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Status Cards */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'BATTERY', value: '15.8 V', status: 'OK' },
          { label: 'LEAK SENSOR', value: 'Dry', status: 'OK' },
          { label: 'LIGHTS', value: 'On', status: 'WARN' },
          { label: 'VIDEO', value: 'Active', status: 'OK' },
        ].map((item) => (
          <div key={item.label} className="bg-[#0b111a] border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="text-xl font-bold mt-1">{item.value}</p>
            <p className="text-xs text-green-500 mt-2">● {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}