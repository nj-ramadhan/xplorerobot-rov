export default function Parameters() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Card 1: Reset Parameters */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="font-bold text-lg text-slate-200 mb-4">Reset Parameters to Firmware Defaults</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          This will effectively wipe your "eeprom". You will lose all your parameters, vehicle setup, and calibrations. 
          Use this if you don't know which parameters you changed and need a clean start.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition duration-200">
          RESET ALL PARAMETERS
        </button>
      </div>

      {/* Card 2: Load Recommended */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="font-bold text-lg text-slate-200 mb-4">Load Recommended Parameter sets</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          These are the recommended parameter sets for your vehicle and firmware version. Curated by Blue Robotics.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition duration-200">
            STANDARD BLUEROV2.PARAMS
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition duration-200">
            HEAVY BLUEROV2.PARAMS
          </button>
        </div>
      </div>

    </div>
  );
}