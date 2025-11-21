import React from 'react';

interface SidebarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onChange }) => {
  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'new-scan', label: 'New Scan', icon: '🚀' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'chatbot', label: 'AI Chatbot', icon: '🤖' },
  ];

  const supportMenuItems = [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'help', label: 'Help & Support', icon: 'ℹ️' },
  ];

  const renderMenuButton = (item: { id: string; label: string; icon: string }) => (
    <button
      key={item.id}
      onClick={() => onChange(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        activeTab === item.id
          ? 'bg-[#B9A121] text-white font-bold shadow-md'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <span className={`text-xl transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-[#3C3C3C] text-white flex-shrink-0 flex flex-col shadow-xl h-full z-10">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
          <nav className="space-y-2">
            {mainMenuItems.map(renderMenuButton)}
          </nav>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Preferences</p>
          <nav className="space-y-2">
            {supportMenuItems.map(renderMenuButton)}
          </nav>
        </div>
      </div>

      <div className="p-6 border-t border-gray-700 bg-[#2d2d2d]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#B9A121] to-[#A22C29] flex items-center justify-center text-white font-bold text-sm">
            PT
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Recruiter</p>
          </div>
        </div>
      </div>
    </div>
  );
};