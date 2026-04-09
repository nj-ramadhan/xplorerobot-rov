import { useState } from 'react';
import Overview from './Overview';
import PwmOutputs from './PwmOutputs'; // 1. Tambahkan import ini
import Configure from './Configure';

export default function VehicleSetup() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'pwm', label: 'PWM OUTPUTS' },
    { id: 'configure', label: 'CONFIGURE' },
  ];

  return (
    <div className="w-full text-slate-200">
      <h1 className="text-2xl font-bold mb-6">Vehicle Setup</h1>

      {/* Tab Header */}
      <div className="flex space-x-8 border-b border-slate-700/50 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="mt-4">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'pwm' && <PwmOutputs />}
        {activeTab === 'configure' && <Configure />}
      </div>
    </div>
  );
}