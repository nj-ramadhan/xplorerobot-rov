import React, { useState } from 'react';

const CameraGimbal = () => {
  const [maxPwm, setMaxPwm] = useState(1900);
  const [minPwm, setMinPwm] = useState(1100);
  const [maxAngle, setMaxAngle] = useState(60);
  const [minAngle, setMinAngle] = useState(-60);
  const [stabilize, setStabilize] = useState(true);

  // Perhitungan sederhana PWM per derajat
  const calculatedPwmPerDegree = ((maxPwm - minPwm) / (maxAngle - minAngle)).toFixed(2);

  return (
    <div className="p-6 text-slate-300 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-slate-200 mb-2">Camera Gimbal Configuration</h2>
      <p className="text-sm text-slate-400 mb-8">
        Pitch control for the camera gimbal requires specifying the PWM limits of the gimbal servo motor, 
        and their relationship with its tilt angle range.
      </p>

      <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg mb-6">
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Mount 1 Pitch Servo</label>
        <select className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm mb-6">
          <option>Servo 16 (Mount1Pitch)</option>
        </select>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-blue-500" /> Reverse servo direction
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={stabilize} 
              onChange={() => setStabilize(!stabilize)} 
              className="accent-blue-500" 
            /> Stabilize mount
          </label>
        </div>
      </div>

      {/* Step 1: Physical Limits */}
      <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg mb-6">
        <h3 className="font-semibold text-slate-200 mb-2">Step 1: Find the physical limits</h3>
        <p className="text-xs text-slate-400 mb-4">
          Move the camera to the minimum and maximum positions, then adjust the minimum/maximum PWMs 
          until it reaches the furthest it can move without hitting other components.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">Max PWM</label>
            <input type="number" value={maxPwm} onChange={(e) => setMaxPwm(Number(e.target.value))} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">Min PWM</label>
            <input type="number" value={minPwm} onChange={(e) => setMinPwm(Number(e.target.value))} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 text-yellow-500 text-xs rounded">
          ! The gimbal will move to the new PWM values as you adjust them.
        </div>
      </div>

      {/* Step 2: Measure Angles */}
      <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg">
        <h3 className="font-semibold text-slate-200 mb-2">Step 2: Measure the actual angles</h3>
        <p className="text-xs text-slate-400 mb-4">
          Measure the found limits and input them below. This will allow ArduPilot to know how to convert PWM to angle.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">Max Angle (deg)</label>
            <input type="number" value={maxAngle} onChange={(e) => setMaxAngle(Number(e.target.value))} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1">Min Angle (deg)</label>
            <input type="number" value={minAngle} onChange={(e) => setMinAngle(Number(e.target.value))} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Calculated PWM/degree: <span className="font-mono text-blue-400">{calculatedPwmPerDegree}</span>
        </div>
      </div>
    </div>
  );
};

export default CameraGimbal;