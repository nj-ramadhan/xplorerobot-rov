import React from 'react';

const BlueOSVersion = () => {
  return (
    <div className="p-8 text-slate-300 max-w-5xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-white">BlueOS Version</h2>

      {/* Local Versions Card */}
      <div className="bg-[#1A2332] border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="font-semibold text-white mb-6">Local Versions</h3>
        <div className="space-y-4">
          {[
            { version: '1.4.0', status: 'Running', active: true },
            { version: '1.3.1', status: 'Inactive', active: false },
            { version: 'factory', status: 'Inactive', active: false },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                <div>
                  <p className="font-bold text-white">{item.version}</p>
                  <p className="text-xs text-slate-500">dc8b6a7ec - 2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                {item.active && <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">RUNNING</span>}
                {!item.active && <button className="px-4 py-1 bg-slate-700 hover:bg-slate-600 text-xs rounded transition-all">DELETE</button>}
                <button className={`px-4 py-1 text-xs rounded transition-all ${item.active ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                  {item.active ? 'UPDATE BOOTSTRAP' : 'APPLY'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remote Versions Card */}
      <div className="bg-[#1A2332] border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-white">Remote Versions</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300 underline">DOCKER LOGIN</button>
        </div>
        
        <input 
          type="text" 
          placeholder="custom-user/blueos-core" 
          className="w-full bg-[#0F172A] border border-slate-700 rounded p-3 text-sm mb-6 focus:border-blue-500 outline-none"
        />

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#0F172A] rounded border border-slate-800">
            <span className="text-sm">master <span className="text-slate-500 text-xs">(a2e96468)</span></span>
            <button className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded">DOWNLOAD AND APPLY</button>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0F172A] rounded border border-slate-800">
            <span className="text-sm">1.4.0-beta.15</span>
            <button className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded">DOWNLOAD AND APPLY</button>
          </div>
        </div>
        
        {/* Pagination mock */}
        <div className="flex gap-2 justify-center mt-6">
          {[1, 2, 3, 4, 5].map(num => (
            <button key={num} className={`w-8 h-8 rounded text-xs ${num === 1 ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}`}>{num}</button>
          ))}
        </div>
      </div>

      {/* Manual Upload Card */}
      <div className="bg-[#1A2332] border border-slate-700 rounded-xl p-6 shadow-lg">
        <h3 className="font-semibold text-white mb-2">Manual Upload</h3>
        <p className="text-xs text-slate-400 mb-4">Use this to upload a .tar docker image.</p>
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 transition-all cursor-pointer">
          <span className="text-sm">Click or drag file here</span>
        </div>
        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded text-sm font-bold">UPLOAD</button>
      </div>
    </div>
  );
};

export default BlueOSVersion;