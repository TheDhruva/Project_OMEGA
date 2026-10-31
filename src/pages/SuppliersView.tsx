import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Merge,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { Supplier, MaterialItem, PaymentMethod } from '../types';
import { Modal } from '../components/common/Modal';

export const SuppliersView: React.FC = () => {
  const {
    settings,
    suppliers,
    materials,
    projects,
    addSupplier,
    addMaterialItem,
    addSupplierPayment,
  } = useContractor();

  const [activeTab, setActiveTab] = useState<'suppliers' | 'materials'>('suppliers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // New Supplier Modal
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [compName, setCompName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [smartMergeNotice, setSmartMergeNotice] = useState<string | null>(null);

  // Log Supplier Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paySupplierId, setPaySupplierId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<number>(1000);
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Bank Transfer');
  const [payNote, setPayNote] = useState('');

  // Add Material Modal
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [matName, setMatName] = useState('');
  const [matSupplierId, setMatSupplierId] = useState(suppliers[0]?.id || '');
  const [matUnit, setMatUnit] = useState('Drums (20L)');
  const [matQty, setMatQty] = useState<number>(10);
  const [matPrice, setMatPrice] = useState<number>(240);
  const [matPaid, setMatPaid] = useState<number>(1000);
  const [matLinkedProject, setMatLinkedProject] = useState<string>('');

  const filteredSuppliers = suppliers.filter((s) => {
    return (
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
    );
  });

  const filteredMaterials = materials.filter((m) => {
    return (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim() || !phone.trim()) return;

    const res = addSupplier({
      companyName: compName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    });

    if (res.mergedWithExisting) {
      setSmartMergeNotice(
        `Smart Phone Merge: Matching phone number "${phone}" was detected. Supplier records, purchase orders, and payment histories have been consolidated automatically.`
      );
      setTimeout(() => setSmartMergeNotice(null), 6000);
    }

    setIsAddSupplierModalOpen(false);
    setSelectedSupplier(res.supplier);
    setCompName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  const handleSupplierPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySupplierId || payAmount <= 0) return;

    addSupplierPayment(paySupplierId, {
      amount: Number(payAmount),
      date: payDate,
      method: payMethod,
      note: payNote.trim(),
    });

    setIsPaymentModalOpen(false);
    setPayNote('');
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName.trim() || !matSupplierId) return;

    addMaterialItem({
      supplierId: matSupplierId,
      name: matName.trim(),
      unit: matUnit,
      quantityPurchased: Number(matQty),
      quantityAvailable: Number(matQty),
      purchaseDate: new Date().toISOString().split('T')[0],
      pricePerUnit: Number(matPrice),
      amountPaid: Number(matPaid),
      linkedProjectId: matLinkedProject || undefined,
    });

    setIsAddMaterialModalOpen(false);
    setMatName('');
  };

  const activeSupplierMaterials = selectedSupplier
    ? materials.filter((m) => m.supplierId === selectedSupplier.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Suppliers & Material Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-derived purchase totals, smart phone deduplication, and project consumption tracking
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'suppliers'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suppliers & Dues
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'materials'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Material Stock Log
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'suppliers') setIsAddSupplierModalOpen(true);
              else setIsAddMaterialModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'suppliers' ? 'Add Supplier' : 'Log Material'}</span>
          </button>
        </div>
      </div>

      {/* Smart Merge Banner Alert */}
      {smartMergeNotice && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
          <Merge className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{smartMergeNotice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'suppliers'
                ? 'Search suppliers, phone, contact...'
                : 'Search materials, specs, vendors...'
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
          />
        </div>
      </div>

      {/* Tab 1: Suppliers Directory & Balances */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedSupplier ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSuppliers.map((sup) => {
                const isSelected = selectedSupplier?.id === sup.id;

                return (
                  <div
                    key={sup.id}
                    onClick={() => setSelectedSupplier(sup)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                            sup.status === 'Cleared'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {sup.status}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                          {sup.companyName}
                        </h3>
                        <p className="text-xs text-slate-500">Contact: {sup.contactPerson}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold tabular-nums block ${
                            sup.balance > 0 ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {sup.balance > 0
                            ? `Due: ${settings.currencySymbol}${sup.balance.toLocaleString()}`
                            : 'All Paid'}
                        </span>
                        <span className="text-[10px] text-slate-400 block tabular-nums">
                          Total: {settings.currencySymbol}{sup.totalPurchased.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{sup.phone}</span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-600">
                        Paid: {settings.currencySymbol}{sup.totalPaid.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supplier Detail Drawer */}
          {selectedSupplier && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Supplier Account
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedSupplier.companyName}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedSupplier.contactPerson}</p>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Auto-Derived Total Purchased:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {settings.currencySymbol}{selectedSupplier.totalPurchased.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Settled / Paid:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {settings.currencySymbol}{selectedSupplier.totalPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="font-semibold text-slate-700">Outstanding Balance Due:</span>
                  <span className="font-extrabold text-rose-700 tabular-nums">
                    {settings.currencySymbol}{selectedSupplier.balance.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPaySupplierId(selectedSupplier.id);
                    setPayAmount(selectedSupplier.balance || 500);
                    setIsPaymentModalOpen(true);
                  }}
                  className="w-full mt-2 py-1.5 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Log Supplier Payment</span>
                </button>
              </div>

              {/* Materials Supplied by this Vendor */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">
                  Materials Catalog ({activeSupplierMaterials.length})
                </h4>
                {activeSupplierMaterials.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No materials logged for this vendor.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {activeSupplierMaterials.map((m) => (
                      <div
                        key={m.id}
                        className="p-2 rounded bg-white border border-slate-200 text-xs flex justify-between"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{m.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {m.quantityPurchased} {m.unit} @ {settings.currencySymbol}{m.pricePerUnit}
                          </p>
                        </div>
                        <span className="font-bold text-slate-800 tabular-nums">
                          {settings.currencySymbol}{m.totalCost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Payment Disbursements</h4>
                {selectedSupplier.paymentHistory.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No payment disbursements logged.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedSupplier.paymentHistory.map((p) => (
                      <div
                        key={p.id}
                        className="p-2 rounded bg-white border border-slate-200 text-xs flex justify-between"
                      >
                        <div>
                          <span className="font-semibold text-emerald-800">
                            {settings.currencySymbol}{p.amount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1.5">via {p.method}</span>
                          {p.note && <p className="text-[11px] text-slate-500 mt-0.5">{p.note}</p>}
                        </div>
                        <span className="text-[10px] text-slate-400 tabular-nums">{p.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Materials Catalog */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
                  <th className="py-3 px-4">Material Description</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3 text-right">Quantity Purchased</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-right">Total Cost</th>
                  <th className="py-3 px-3 text-right">Paid</th>
                  <th className="py-3 px-3 text-right">Balance Due</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{mat.name}</td>
                    <td className="py-3 px-3 text-slate-600">{mat.supplierName}</td>
                    <td className="py-3 px-3 text-right text-slate-700 font-medium tabular-nums">
                      {mat.quantityPurchased} {mat.unit}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                      {settings.currencySymbol}{mat.pricePerUnit}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {settings.currencySymbol}{mat.totalCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-medium tabular-nums">
                      {settings.currencySymbol}{mat.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-rose-700 tabular-nums">
                      {settings.currencySymbol}{mat.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          mat.paidCompletely
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {mat.paidCompletely ? 'Cleared' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        title="Add Material Supplier"
        subtitle="Automatic deduplication and history consolidation on phone match"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company / Brand Name</label>
            <input
              type="text"
              required
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              placeholder="e.g. HydroShield Sealant Corp"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Representative</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Sales manager name"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number (Deduplication Key)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="orders@supplier.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Warehouse Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Industrial Zone Depot"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddSupplierModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Material Modal */}
      <Modal
        isOpen={isAddMaterialModalOpen}
        onClose={() => setIsAddMaterialModalOpen(false)}
        title="Log Material Purchase"
        subtitle="Auto-updates supplier purchased balances and optionally tracks site usage"
        maxWidth="lg"
      >
        <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Material Name & Specification</label>
              <input
                type="text"
                required
                value={matName}
                onChange={(e) => setMatName(e.target.value)}
                placeholder="e.g. SBR Bonding Polymer Latex (50kg)"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supplier</label>
              <select
                value={matSupplierId}
                onChange={(e) => setMatSupplierId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white font-medium"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
              <select
                value={matUnit}
                onChange={(e) => setMatUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
              >
                <option value="Drums (20L)">Drums (20L)</option>
                <option value="Rolls (10m)">Rolls (10m)</option>
                <option value="Buckets (20kg)">Buckets (20kg)</option>
                <option value="Bags (50kg)">Bags (50kg)</option>
                <option value="Liters">Liters</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={matQty}
                onChange={(e) => setMatQty(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Price / Unit ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="1"
                required
                value={matPrice}
                onChange={(e) => setMatPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Advance Paid to Supplier ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                value={matPaid}
                onChange={(e) => setMatPaid(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assign to Project (Optional)</label>
              <select
                value={matLinkedProject}
                onChange={(e) => setMatLinkedProject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
              >
                <option value="">General Inventory (Not linked)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
            <span className="text-slate-600">Total Purchase Cost:</span>
            <span className="font-bold text-slate-900 font-mono tabular-nums">
              {settings.currencySymbol}{(matQty * matPrice).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddMaterialModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Log & Update Supplier Balance
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Supplier Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Disburse Supplier Payment"
        subtitle="Reduces accounts payable balance owed to material vendor"
        maxWidth="md"
      >
        <form onSubmit={handleSupplierPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Supplier</label>
            <select
              value={paySupplierId}
              onChange={(e) => setPaySupplierId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white font-medium"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.companyName} (Due: {settings.currencySymbol}{s.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="1"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Disbursement / Receipt Note</label>
            <input
              type="text"
              value={payNote}
              onChange={(e) => setPayNote(e.target.value)}
              placeholder="e.g. Paid against Invoice #CS-1092"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Confirm Disbursement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
