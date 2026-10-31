import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck2,
  Users,
  Smartphone,
  HardHat,
} from 'lucide-react';
import { useContractor } from '../../context/ContractorContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { activeRole, setActiveRole } = useContractor();

  if (activeRole === 'laborer') {
    return (
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentTab('worker-home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'worker-home'
              ? 'text-blue-600 bg-blue-50/70'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Worker Portal</span>
        </button>

        <button
          onClick={() => setCurrentTab('site-images')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold ${
            currentTab === 'site-images'
              ? 'text-blue-600 bg-blue-50/70'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Site Photos</span>
        </button>

        <button
          onClick={() => {
            setActiveRole('admin');
            setCurrentTab('dashboard');
          }}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold text-amber-700 hover:text-amber-800"
        >
          <HardHat className="w-4 h-4" />
          <span>Switch Admin</span>
        </button>
      </nav>
    );
  }

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'worker-home', label: 'Worker Portal', icon: Smartphone, onSelect: () => setActiveRole('laborer') },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.onSelect) item.onSelect();
              setCurrentTab(item.id);
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-colors ${
              isActive
                ? 'text-slate-900 bg-slate-100 font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
