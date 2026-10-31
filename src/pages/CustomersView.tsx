import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FolderKanban,
  FileText,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { Customer, CustomerType } from '../types';
import { Modal } from '../components/common/Modal';
import { DeleteBlockedModal } from '../components/common/DeleteBlockedModal';
import { PrintableStatement } from '../components/common/PrintableStatement';

interface CustomersViewProps {
  onNavigateToProject?: (projectId: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onNavigateToProject }) => {
  const {
    settings,
    customers,
    projects,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerReceivable,
    addProject,
  } = useContractor();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer Modal
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<CustomerType>('Commercial');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [notes, setNotes] = useState('');

  // Quick New Project for this customer modal
  const [isQuickProjModalOpen, setIsQuickProjModalOpen] = useState(false);
  const [quickProjTitle, setQuickProjTitle] = useState('');
  const [quickArea, setQuickArea] = useState<number>(1800);
  const [quickRate, setQuickRate] = useState<number>(3.5);

  // Statement Print Preview Modal
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);

  // Deletion restriction modal state
  const [deleteBlockedInfo, setDeleteBlockedInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const filteredCustomers = customers.filter((c) => {
    const matchesType = selectedType === 'All' ? true : c.type === selectedType;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const created = addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      type,
      address: address.trim(),
      city: city.trim(),
      notes: notes.trim(),
    });

    setIsNewCustModalOpen(false);
    setSelectedCustomer(created);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
  };

  const handleQuickProjectCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !quickProjTitle.trim()) return;

    const totalCost = quickArea * quickRate;
    addProject({
      title: quickProjTitle.trim(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      siteAddress: selectedCustomer.address,
      city: selectedCustomer.city,
      serviceType: ['Waterproofing'],
      areaSqFt: Number(quickArea),
      ratePerSqFt: Number(quickRate),
      totalCost,
      status: 'In Progress',
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
      notes: 'Initiated from customer profile direct workflow.',
      assignedLaborerIds: ['lab-1'],
    });

    setIsQuickProjModalOpen(false);
    setQuickProjTitle('');
  };

  const handleDeleteAttempt = (customerId: string) => {
    const res = deleteCustomer(customerId);
    if (!res.success) {
      setDeleteBlockedInfo({
        isOpen: true,
        title: 'Outstanding Account Balances',
        message: res.message || 'Cannot delete customer with pending receivables.',
      });
    } else {
      setSelectedCustomer(null);
    }
  };

  const activeCustomerProjects = selectedCustomer
    ? projects.filter((p) => p.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Directory & Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Client contacts, aggregated project receivables, statements, and one-click project initiation
          </p>
        </div>

        <button
          onClick={() => setIsNewCustModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit overflow-x-auto">
          {['All', 'Residential', 'Commercial', 'Industrial'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                selectedType === t
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers, phones, addresses..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grid: Customer Cards & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${selectedCustomer ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3`}>
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              No customers found matching search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomers.map((c) => {
                const totalDue = getCustomerReceivable(c.id);
                const custProjects = projects.filter((p) => p.customerId === c.id);
                const isSelected = selectedCustomer?.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {c.type}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                          {c.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold tabular-nums block ${
                            totalDue > 0 ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {totalDue > 0
                            ? `Due: ${settings.currencySymbol}${totalDue.toLocaleString()}`
                            : 'Account Clear'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {custProjects.length} {custProjects.length === 1 ? 'Project' : 'Projects'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{c.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{c.address}, {c.city}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer Detail Drawer */}
        {selectedCustomer && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Client Account
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedCustomer.name}</h2>
                <p className="text-xs text-slate-500">{selectedCustomer.type} Client</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Financial Overview Card */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Active Balance:</span>
                <span
                  className={`font-bold tabular-nums text-sm ${
                    getCustomerReceivable(selectedCustomer.id) > 0
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {settings.currencySymbol}
                  {getCustomerReceivable(selectedCustomer.id).toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatementCustomer(selectedCustomer)}
                  className="flex-1 py-1.5 px-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Statement PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickProjTitle(`${selectedCustomer.name} - Site 2`);
                    setIsQuickProjModalOpen(true);
                  }}
                  className="flex-1 py-1.5 px-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Project</span>
                </button>
              </div>
            </div>

            {/* Client's Projects */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">
                Associated Projects ({activeCustomerProjects.length})
              </h4>
              {activeCustomerProjects.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No projects linked to this customer.</p>
              ) : (
                <div className="space-y-2">
                  {activeCustomerProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onNavigateToProject && onNavigateToProject(p.id)}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex justify-between font-semibold text-slate-900">
                        <span className="truncate max-w-[180px]">{p.title}</span>
                        <span className="tabular-nums">
                          {settings.currencySymbol}{p.totalCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>Status: {p.status}</span>
                        <span className="text-amber-700 font-medium tabular-nums">
                          Due: {settings.currencySymbol}{p.amountReceivable.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedCustomer.notes && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700 block mb-0.5">Account Notes:</span>
                <p className="text-slate-600 leading-relaxed">{selectedCustomer.notes}</p>
              </div>
            )}

            {/* Deletion protection button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDeleteAttempt(selectedCustomer.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 p-1 hover:bg-rose-50 rounded transition-colors"
                title="Delete customer (Requires all project receivables to be cleared)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Customer Account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Customer Modal */}
      <Modal
        isOpen={isNewCustModalOpen}
        onClose={() => setIsNewCustModalOpen(false)}
        title="Add Customer Account"
        subtitle="Registers client for multi-project billing and work orders"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer / Entity Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Hospitality Group"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CustomerType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="billing@company.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="100 Main Street"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate code, billing contact, inspection protocols..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewCustModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Project from Customer Workflow Modal (Core Feature!) */}
      {selectedCustomer && (
        <Modal
          isOpen={isQuickProjModalOpen}
          onClose={() => setIsQuickProjModalOpen(false)}
          title={`New Project for ${selectedCustomer.name}`}
          subtitle="Pre-populates client address and contact info"
          maxWidth="md"
        >
          <form onSubmit={handleQuickProjectCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={quickProjTitle}
                onChange={(e) => setQuickProjTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Area (sq ft)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quickArea}
                  onChange={(e) => setQuickArea(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
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
                  value={quickRate}
                  onChange={(e) => setQuickRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
              <span className="text-slate-600">Calculated Project Cost:</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {settings.currencySymbol}{(quickArea * quickRate).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsQuickProjModalOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Create & Assign
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Professional Customer Statement Print Preview Modal */}
      {statementCustomer && (
        <PrintableStatement
          customer={statementCustomer}
          projects={projects.filter((p) => p.customerId === statementCustomer.id)}
          onClose={() => setStatementCustomer(null)}
        />
      )}

      {/* Deletion Restricted Modal (Enforces data integrity rule!) */}
      <DeleteBlockedModal
        isOpen={deleteBlockedInfo.isOpen}
        onClose={() => setDeleteBlockedInfo((prev) => ({ ...prev, isOpen: false }))}
        title={deleteBlockedInfo.title}
        message={deleteBlockedInfo.message}
      />
    </div>
  );
};
