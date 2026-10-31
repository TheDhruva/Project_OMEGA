import React, { useState } from 'react';
import { ContractorProvider, useContractor } from './context/ContractorContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './pages/DashboardView';
import { ProjectsView } from './pages/ProjectsView';
import { CustomersView } from './pages/CustomersView';
import { AttendanceView } from './pages/AttendanceView';
import { LaborerPortalView } from './pages/LaborerPortalView';
import { SuppliersView } from './pages/SuppliersView';
import { InvoicesView } from './pages/InvoicesView';
import { SiteImagesView } from './pages/SiteImagesView';
import { SettingsView } from './pages/SettingsView';
import { Modal } from './components/common/Modal';
import { PaymentMethod } from './types';

const MainLayout: React.FC = () => {
  const {
    activeRole,
    projects,
    settings,
    addProjectPayment,
  } = useContractor();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Global Quick Log Payment Modal
  const [isQuickPaymentModalOpen, setIsQuickPaymentModalOpen] = useState(false);
  const [quickPayProjectId, setQuickPayProjectId] = useState(projects[0]?.id || '');
  const [quickPayAmount, setQuickPayAmount] = useState<number>(1500);
  const [quickPayDate, setQuickPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickPayMethod, setQuickPayMethod] = useState<PaymentMethod>('Bank Transfer');
  const [quickPayNote, setQuickPayNote] = useState('');

  const handleNavigate = (tab: string, contextId?: string) => {
    if (tab === 'projects' && contextId) {
      setSelectedProjectId(contextId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPayProjectId || quickPayAmount <= 0) return;

    addProjectPayment(quickPayProjectId, {
      amount: Number(quickPayAmount),
      date: quickPayDate,
      method: quickPayMethod,
      note: quickPayNote.trim() || 'Customer milestone receipt',
    });

    setIsQuickPaymentModalOpen(false);
    setQuickPayNote('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedProjectId(null);
          setCurrentTab(tab);
        }}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            onOpenNewProject={() => {
              setSelectedProjectId(null);
              setCurrentTab('projects');
            }}
            onOpenLogPayment={() => {
              if (projects.length > 0) {
                setQuickPayProjectId(projects[0].id);
                setQuickPayAmount(projects[0].amountReceivable || 1000);
              }
              setIsQuickPaymentModalOpen(true);
            }}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsView
            selectedProjectId={selectedProjectId}
            onClearSelectedProject={() => setSelectedProjectId(null)}
            onNavigateToInvoice={(projId) => {
              setCurrentTab('invoices');
            }}
          />
        )}

        {currentTab === 'customers' && (
          <CustomersView
            onNavigateToProject={(projId) => {
              setSelectedProjectId(projId);
              setCurrentTab('projects');
            }}
          />
        )}

        {currentTab === 'attendance' && <AttendanceView />}

        {currentTab === 'worker-home' && <LaborerPortalView />}

        {currentTab === 'suppliers' && <SuppliersView />}

        {currentTab === 'invoices' && <InvoicesView />}

        {currentTab === 'site-images' && <SiteImagesView />}

        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Ergonomic Bottom Navigation */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Global Quick Payment Receipt Modal */}
      <Modal
        isOpen={isQuickPaymentModalOpen}
        onClose={() => setIsQuickPaymentModalOpen(false)}
        title="Quick Log Customer Payment"
        subtitle="Immediately updates receivables ledger across all screens"
        maxWidth="md"
      >
        <form onSubmit={handleQuickPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Project</label>
            <select
              value={quickPayProjectId}
              onChange={(e) => setQuickPayProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (Due: {settings.currencySymbol}{p.amountReceivable.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Amount ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="1"
                required
                value={quickPayAmount}
                onChange={(e) => setQuickPayAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Method</label>
              <select
                value={quickPayMethod}
                onChange={(e) => setQuickPayMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Date</label>
            <input
              type="date"
              required
              value={quickPayDate}
              onChange={(e) => setQuickPayDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Receipt Note</label>
            <input
              type="text"
              value={quickPayNote}
              onChange={(e) => setQuickPayNote(e.target.value)}
              placeholder="e.g. Check #5019 cleared / Wire Transfer confirmed"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsQuickPaymentModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
            >
              Save Receipt
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default function App() {
  return (
    <ContractorProvider>
      <MainLayout />
    </ContractorProvider>
  );
}
