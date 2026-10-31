import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  DollarSign,
  Printer,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Eye,
  FileText,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { Invoice, InvoiceStatus, InvoiceLineItem, PaymentMethod } from '../types';
import { Modal } from '../components/common/Modal';
import { PrintableStatement } from '../components/common/PrintableStatement';

export const InvoicesView: React.FC = () => {
  const {
    settings,
    invoices,
    projects,
    customers,
    createInvoice,
    addInvoicePayment,
  } = useContractor();

  // Focused view from README: "The invoice list automatically filters out cleared accounts to focus on pending collections."
  const [filterPendingOnly, setFilterPendingOnly] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);

  // Create Invoice Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [taxRate, setTaxRate] = useState<number>(settings.defaultTaxRate);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: 'li-1',
      description: 'Waterproofing Surface Application & Fiber Reinforcement',
      quantity: 1,
      unitPrice: 5000,
      total: 5000,
    },
  ]);
  const [notes, setNotes] = useState(
    'Payment due within 30 days. 5-Year contractor warranty activated upon final payment.'
  );

  // Pay Invoice Modal State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(1000);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [paymentNote, setPaymentNote] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    if (filterPendingOnly && inv.status === 'Paid') return false;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `li-${Date.now()}`,
        description: 'Material & Labor Charges',
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
      },
    ]);
  };

  const handleUpdateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    setLineItems((prev) => {
      const copy = [...prev];
      const item = { ...copy[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        item.total = Number(item.quantity) * Number(item.unitPrice);
      }
      copy[index] = item;
      return copy;
    });
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === selectedProjectId);
    const cust = proj ? customers.find((c) => c.id === proj.customerId) : customers[0];
    if (!proj) return;

    const created = createInvoice({
      projectId: proj.id,
      projectName: proj.title,
      customerId: cust?.id || proj.customerId,
      customerName: cust?.name || proj.customerName,
      customerPhone: cust?.phone,
      customerAddress: cust?.address,
      issueDate,
      dueDate,
      lineItems,
      taxRate: Number(taxRate),
      notes: notes.trim(),
      status: 'Sent',
    });

    setIsCreateModalOpen(false);
    setActivePrintInvoice(created);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice || paymentAmount <= 0) return;

    addInvoicePayment(payingInvoice.id, {
      amount: Number(paymentAmount),
      date: paymentDate,
      method: paymentMethod,
      note: paymentNote.trim(),
    });

    setPayingInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Invoices & Billing Statements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Client billing, automated tax calculation, payment schedule, and printable PDF receipts
          </p>
        </div>

        <button
          onClick={() => {
            const firstProj = projects[0];
            if (firstProj) {
              setSelectedProjectId(firstProj.id);
              setLineItems([
                {
                  id: 'li-1',
                  description: `${firstProj.serviceType.join('/')} System (${firstProj.areaSqFt} sq ft)`,
                  quantity: firstProj.areaSqFt,
                  unitPrice: firstProj.ratePerSqFt,
                  total: firstProj.totalCost,
                },
              ]);
            }
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Filter Bar with Focused View Toggle (from README) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Focused View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterPendingOnly(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterPendingOnly
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Collections ({invoices.filter((i) => i.status !== 'Paid').length})
            </button>
            <button
              onClick={() => setFilterPendingOnly(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                !filterPendingOnly
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Invoices ({invoices.length})
            </button>
          </div>
        </div>

        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, customer, project..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Customer & Project</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3 text-right">Amount Paid</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No invoices matching current filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const statusStyles: Record<string, string> = {
                    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    Partial: 'bg-amber-50 text-amber-700 border-amber-200',
                    Sent: 'bg-blue-50 text-blue-700 border-blue-200',
                    Draft: 'bg-slate-100 text-slate-700 border-slate-200',
                    Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{inv.customerName}</div>
                        <div className="text-[11px] text-slate-500 max-w-xs truncate">
                          {inv.projectName}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 tabular-nums">{inv.issueDate}</td>
                      <td className="py-3 px-3 text-slate-600 tabular-nums">{inv.dueDate}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums font-mono">
                        {settings.currencySymbol}
                        {inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-700 font-medium tabular-nums font-mono">
                        {settings.currencySymbol}
                        {inv.amountPaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-amber-800 tabular-nums font-mono">
                        {settings.currencySymbol}
                        {inv.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            statusStyles[inv.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActivePrintInvoice(inv)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="Print / View Statement PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          {inv.balance > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPayingInvoice(inv);
                                setPaymentAmount(inv.balance);
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                              title="Record payment receipt"
                            >
                              + Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate Tax Invoice"
        subtitle="Automatic tax calculation and line-item billing schedule"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const proj = projects.find((p) => p.id === e.target.value);
                if (proj) {
                  setLineItems([
                    {
                      id: 'li-1',
                      description: `${proj.serviceType.join('/')} System (${proj.areaSqFt} sq ft)`,
                      quantity: proj.areaSqFt,
                      unitPrice: proj.ratePerSqFt,
                      total: proj.totalCost,
                    },
                  ]);
                }
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - {p.customerName} ({settings.currencySymbol}{p.totalCost.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Applicable Tax Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          {/* Line items list */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Invoice Line Items</span>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-800"
              >
                + Add Another Item
              </button>
            </div>

            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-6">
                  <input
                    type="text"
                    required
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleUpdateLineItem(index, 'description', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleUpdateLineItem(index, 'quantity', Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-mono text-right"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Rate"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateLineItem(index, 'unitPrice', Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-mono text-right"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between font-mono font-bold text-slate-800 text-right">
                  <span>{settings.currencySymbol}{item.total.toLocaleString()}</span>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(index)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 ml-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contractor Notes & Terms</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Generate & Preview
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Invoice Payment Modal */}
      {payingInvoice && (
        <Modal
          isOpen={!!payingInvoice}
          onClose={() => setPayingInvoice(null)}
          title={`Log Payment for ${payingInvoice.invoiceNumber}`}
          subtitle={`Customer: ${payingInvoice.customerName} · Due: ${settings.currencySymbol}${payingInvoice.balance.toLocaleString()}`}
          maxWidth="md"
        >
          <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Amount ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  min="1"
                  max={payingInvoice.balance}
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
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Memo / Receipt Note</label>
              <input
                type="text"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="e.g. Partial remittance via Wire Transfer"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Confirm Receipt
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Printable Statement / Invoice View Modal */}
      {activePrintInvoice && (
        <PrintableStatement
          invoice={activePrintInvoice}
          onClose={() => setActivePrintInvoice(null)}
        />
      )}
    </div>
  );
};
