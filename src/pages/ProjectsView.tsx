import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  Layers,
  Trash2,
  CheckCircle2,
  ArrowUpRight,
  Receipt,
  FileText,
  UserCheck,
  Package,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { Project, ServiceType, ProjectStatus, PaymentMethod } from '../types';
import { Modal } from '../components/common/Modal';
import { DeleteBlockedModal } from '../components/common/DeleteBlockedModal';

interface ProjectsViewProps {
  selectedProjectId?: string | null;
  onClearSelectedProject?: () => void;
  onNavigateToInvoice?: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  selectedProjectId,
  onClearSelectedProject,
  onNavigateToInvoice,
}) => {
  const {
    settings,
    projects,
    customers,
    laborers,
    addProject,
    updateProject,
    deleteProject,
    addProjectPayment,
    siteImages,
  } = useContractor();

  const [activeTabStatus, setActiveTabStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailId, setActiveDetailId] = useState<string | null>(selectedProjectId || null);

  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCustomerId, setNewCustomerId] = useState(customers[0]?.id || '');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Metro City');
  const [newServices, setNewServices] = useState<ServiceType[]>(['Waterproofing']);
  const [newAreaSqFt, setNewAreaSqFt] = useState<number>(2000);
  const [newRatePerSqFt, setNewRatePerSqFt] = useState<number>(3.5);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Log Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentProjectId, setPaymentProjectId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(1000);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  // Deletion Blocked Modal State
  const [deleteBlockedInfo, setDeleteBlockedInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    projectId?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const activeProject = projects.find((p) => p.id === (activeDetailId || selectedProjectId));

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      activeTabStatus === 'All' ? true : p.status === activeTabStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.siteAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newCustomerId);
    if (!cust || !newTitle.trim()) return;

    const totalCost = newAreaSqFt * newRatePerSqFt;

    const created = addProject({
      title: newTitle.trim(),
      customerId: cust.id,
      customerName: cust.name,
      siteAddress: newAddress.trim() || cust.address,
      city: newCity.trim() || cust.city,
      serviceType: newServices,
      areaSqFt: Number(newAreaSqFt),
      ratePerSqFt: Number(newRatePerSqFt),
      totalCost,
      status: 'In Progress',
      startDate: newStartDate,
      expectedEndDate: newEndDate || newStartDate,
      notes: newNotes.trim(),
      assignedLaborerIds: [laborers[0]?.id || 'lab-1'],
    });

    setIsNewProjectModalOpen(false);
    setActiveDetailId(created.id);
  };

  const handleLogPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentProjectId || paymentAmount <= 0) return;

    addProjectPayment(paymentProjectId, {
      amount: Number(paymentAmount),
      date: paymentDate,
      method: paymentMethod,
      note: paymentNote.trim(),
      referenceId: paymentRef.trim(),
    });

    setIsPaymentModalOpen(false);
    setPaymentAmount(1000);
    setPaymentNote('');
    setPaymentRef('');
  };

  const handleDeleteAttempt = (projectId: string) => {
    const res = deleteProject(projectId);
    if (!res.success) {
      setDeleteBlockedInfo({
        isOpen: true,
        title: 'Outstanding Balance Detected',
        message: res.message || 'Cannot delete project with pending receivables.',
        projectId,
      });
    } else {
      setActiveDetailId(null);
      if (onClearSelectedProject) onClearSelectedProject();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Projects Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cost estimation, real-time receivables, milestone payments, and site materials
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status segmented tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit overflow-x-auto">
          {['All', 'In Progress', 'Completed', 'Not Started', 'On Hold'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveTabStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTabStatus === st
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, clients, site addresses..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
          />
        </div>
      </div>

      {/* Main Layout: Projects Grid & Optional Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List (2 columns or 3 columns depending on selection) */}
        <div className={`${activeProject ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3`}>
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              No projects found matching the filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((p) => {
                const progressPct =
                  p.totalCost > 0
                    ? Math.min(100, Math.round((p.paidTillNow / p.totalCost) * 100))
                    : 0;

                const isSelected = activeDetailId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveDetailId(p.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.serviceType.map((st) => (
                            <span
                              key={st}
                              className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                            >
                              {st}
                            </span>
                          ))}
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                              p.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : p.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug line-clamp-1">
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-500">{p.customerName}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {settings.currencySymbol}
                          {p.totalCost.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-amber-700 font-semibold block tabular-nums">
                          Due: {settings.currencySymbol}
                          {p.amountReceivable.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{p.siteAddress}</span>
                    </p>

                    {/* Financial Progress Bar */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Paid: {settings.currencySymbol}{p.paidTillNow.toLocaleString()}</span>
                        <span className="tabular-nums">{progressPct}% collected</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            progressPct >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{p.areaSqFt.toLocaleString()} sq ft @ {settings.currencySymbol}{p.ratePerSqFt}/sq ft</span>
                      <span className="text-slate-600 font-semibold flex items-center gap-0.5">
                        Details <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Detail Drawer / Inspector */}
        {activeProject && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Project Inspector
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{activeProject.title}</h2>
                <p className="text-xs text-slate-500">{activeProject.customerName}</p>
              </div>
              <button
                onClick={() => {
                  setActiveDetailId(null);
                  if (onClearSelectedProject) onClearSelectedProject();
                }}
                className="text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Status Control */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Current Phase:</span>
              <select
                value={activeProject.status}
                onChange={(e) =>
                  updateProject(activeProject.id, {
                    status: e.target.value as ProjectStatus,
                  })
                }
                className="text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Project Value:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {settings.currencySymbol}
                  {activeProject.totalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Paid Till Now:</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  {settings.currencySymbol}
                  {activeProject.paidTillNow.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs border-t border-slate-200 pt-1.5">
                <span className="font-semibold text-slate-700">Amount Receivable:</span>
                <span className="font-extrabold text-amber-700 tabular-nums">
                  {settings.currencySymbol}
                  {activeProject.amountReceivable.toLocaleString()}
                </span>
              </div>

              {/* Log Payment Button */}
              <button
                onClick={() => {
                  setPaymentProjectId(activeProject.id);
                  setPaymentAmount(activeProject.amountReceivable || 1000);
                  setIsPaymentModalOpen(true);
                }}
                className="w-full mt-2 py-1.5 px-3 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>+ Log Customer Payment</span>
              </button>
            </div>

            {/* Payment History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Payment Records ({activeProject.paymentHistory.length})</span>
              </h4>
              {activeProject.paymentHistory.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No payments logged yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeProject.paymentHistory.map((pm) => (
                    <div
                      key={pm.id}
                      className="p-2 rounded bg-white border border-slate-200 text-xs flex justify-between items-start"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">
                          {settings.currencySymbol}{pm.amount.toLocaleString()}{' '}
                          <span className="text-[10px] font-normal text-slate-500">
                            via {pm.method}
                          </span>
                        </div>
                        {pm.note && <p className="text-[11px] text-slate-500">{pm.note}</p>}
                      </div>
                      <span className="text-[10px] text-slate-400 tabular-nums">{pm.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Site Materials Logged */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">
                Site Material Consumption ({activeProject.materials.length})
              </h4>
              {activeProject.materials.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No direct materials linked.</p>
              ) : (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {activeProject.materials.map((m) => (
                    <div
                      key={m.id}
                      className="p-2 rounded bg-white border border-slate-200 text-xs flex justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{m.materialName}</p>
                        <p className="text-[10px] text-slate-500">
                          {m.quantityUsed} {m.unit}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {settings.currencySymbol}{m.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions: Delete Project (Enforcing Data Integrity) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteAttempt(activeProject.id)}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium p-1 hover:bg-rose-50 rounded transition-colors"
                title="Delete project (Requires zero receivable balance)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>

              {onNavigateToInvoice && (
                <button
                  type="button"
                  onClick={() => onNavigateToInvoice(activeProject.id)}
                  className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Create New Contractor Project"
        subtitle="Auto-calculates total contract cost from area and rate"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Oakridge Heights Terrace Waterproofing"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer / Client</label>
              <select
                value={newCustomerId}
                onChange={(e) => setNewCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 text-xs bg-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Service Type</label>
              <div className="flex items-center gap-3 py-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newServices.includes('Waterproofing')}
                    onChange={(e) => {
                      if (e.target.checked) setNewServices((prev) => [...prev, 'Waterproofing']);
                      else setNewServices((prev) => prev.filter((s) => s !== 'Waterproofing'));
                    }}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Waterproofing</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newServices.includes('Heatproofing')}
                    onChange={(e) => {
                      if (e.target.checked) setNewServices((prev) => [...prev, 'Heatproofing']);
                      else setNewServices((prev) => prev.filter((s) => s !== 'Heatproofing'));
                    }}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Heatproofing</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area (sq ft)</label>
              <input
                type="number"
                min="1"
                required
                value={newAreaSqFt}
                onChange={(e) => setNewAreaSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rate / sq ft ({settings.currencySymbol})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={newRatePerSqFt}
                onChange={(e) => setNewRatePerSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Estimated Cost</label>
              <div className="px-3 py-2 rounded-lg bg-slate-100 font-bold text-slate-900 text-xs font-mono tabular-nums">
                {settings.currencySymbol}
                {(newAreaSqFt * newRatePerSqFt).toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Site Address</label>
            <input
              type="text"
              required
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="e.g. 500 Park Avenue, Terrace Level"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expected Completion</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scope & Technical Notes</label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Substrate preparation, coating specification, warranty details..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Log Customer Milestone Payment"
        subtitle="Immediately updates paid totals and accounts receivable ledger"
        maxWidth="md"
      >
        <form onSubmit={handleLogPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Project</label>
            <select
              value={paymentProjectId}
              onChange={(e) => setPaymentProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
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
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Transaction Date</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reference / Cheque No.</label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="TXN-9901 / CHQ-104"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Receipt Note</label>
            <input
              type="text"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="e.g. 50% Milestone completion payment"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Deletion Restricted Modal (Financial Integrity rule!) */}
      <DeleteBlockedModal
        isOpen={deleteBlockedInfo.isOpen}
        onClose={() => setDeleteBlockedInfo((prev) => ({ ...prev, isOpen: false }))}
        title={deleteBlockedInfo.title}
        message={deleteBlockedInfo.message}
        onSettleAction={() => {
          if (deleteBlockedInfo.projectId) {
            setPaymentProjectId(deleteBlockedInfo.projectId);
            const proj = projects.find((p) => p.id === deleteBlockedInfo.projectId);
            setPaymentAmount(proj?.amountReceivable || 1000);
            setIsPaymentModalOpen(true);
          }
        }}
        settleButtonText="Settle Outstanding Balance Now"
      />
    </div>
  );
};
