import React from 'react';
import {
  HardHat,
  LayoutDashboard,
  FolderKanban,
  Users,
  CalendarCheck2,
  Truck,
  FileSpreadsheet,
  Camera,
  Settings as SettingsIcon,
  UserCheck,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useContractor } from '../../context/ContractorContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQuickNew?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { activeRole, setActiveRole, laborers, activeLaborerId, setActiveLaborerId, settings } = useContractor();

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'suppliers', label: 'Suppliers & Stock', icon: Truck },
    { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet },
    { id: 'site-images', label: 'Site Gallery', icon: Camera },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark (Single text element wordmark as per Top Bar Contract) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-xs transition-transform group-hover:scale-105">
                <HardHat className="w-5 h-5 text-slate-950" />
              </div>
              <div className="whitespace-nowrap shrink-0">
                <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                  FieldBook
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-none">
                  {settings.companyName.split(' ')[0]} Contractor OS
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean active state) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Portal Switcher & Role Tools */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Portal Switcher (Admin Mode <-> Laborer Site Mode) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setActiveRole('admin');
                  if (currentTab === 'worker-home') setCurrentTab('dashboard');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeRole === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Contractor Admin Suite"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole('laborer');
                  setCurrentTab('worker-home');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeRole === 'laborer'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to On-Site Laborer Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden sm:inline">Worker Portal</span>
              </button>
            </div>

            {/* If Laborer Mode: pick which laborer profile to simulate */}
            {activeRole === 'laborer' && (
              <div className="hidden md:flex items-center gap-1.5 pl-1">
                <span className="text-[11px] text-slate-400">Worker:</span>
                <select
                  value={activeLaborerId}
                  onChange={(e) => setActiveLaborerId(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {laborers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.trade})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Settings button */}
            <button
              onClick={() => setCurrentTab('settings')}
              className={`p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors ${
                currentTab === 'settings' ? 'bg-slate-100 text-slate-900' : ''
              }`}
              title="Contractor Business Settings & Backup"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Mobile Horizontal Scroll Bar for screen sizes under xl */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-100 scrollbar-none bg-slate-50/70">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setCurrentTab(link.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
