// src/components/Tabs.tsx
interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-800 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`py-3 px-6 text-sm font-semibold transition-all ${
            activeTab === tab
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}