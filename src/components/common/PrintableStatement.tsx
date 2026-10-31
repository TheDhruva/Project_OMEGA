import React from 'react';
import { Printer, Download, X, HardHat, CheckCircle } from 'lucide-react';
import { Customer, Project, Invoice } from '../../types';
import { useContractor } from '../../context/ContractorContext';

interface PrintableStatementProps {
  customer?: Customer;
  projects?: Project[];
  invoice?: Invoice;
  onClose: () => void;
}

export const PrintableStatement: React.FC<PrintableStatementProps> = ({
  customer,
  projects = [],
  invoice,
  onClose,
}) => {
  const { settings } = useContractor();

  const handlePrint = () => {
    window.print();
  };

  const isInvoiceMode = !!invoice;

  // For Customer Statement:
  const totalCost = projects.reduce((sum, p) => sum + p.totalCost, 0);
  const totalPaid = projects.reduce((sum, p) => sum + p.paidTillNow, 0);
  const totalBalanceDue = projects.reduce((sum, p) => sum + p.amountReceivable, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      {/* Top action bar (hidden during print) */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {isInvoiceMode ? 'Tax Invoice Document' : 'Consolidated Outstanding Statement'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white text-slate-900 print-page space-y-8 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                  <HardHat className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                    {settings.companyName}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    License: {settings.contractorLicense} · Tax ID: {settings.taxId}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                <p>{settings.address}</p>
                <p>Tel: {settings.phone} · Email: {settings.email}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                {isInvoiceMode ? 'OFFICIAL INVOICE' : 'OUTSTANDING STATEMENT'}
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-0.5 font-mono">
                <p>
                  <span className="text-slate-400 font-sans">Doc Ref: </span>
                  <span className="font-bold text-slate-900">
                    {isInvoiceMode ? invoice?.invoiceNumber : `STMT-${customer?.id?.toUpperCase()}`}
                  </span>
                </p>
                <p>
                  <span className="text-slate-400 font-sans">Date: </span>
                  <span className="font-semibold text-slate-900">
                    {isInvoiceMode ? invoice?.issueDate : new Date().toISOString().split('T')[0]}
                  </span>
                </p>
                {isInvoiceMode && invoice?.dueDate && (
                  <p>
                    <span className="text-slate-400 font-sans">Payment Due: </span>
                    <span className="font-semibold text-rose-700">{invoice.dueDate}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Billed To / Account Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Account / Client Details
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {isInvoiceMode ? invoice?.customerName : customer?.name}
              </p>
              <p className="text-slate-600 mt-0.5">
                {isInvoiceMode ? invoice?.customerAddress : `${customer?.address}, ${customer?.city}`}
              </p>
              <p className="text-slate-600 mt-0.5">
                Tel: {isInvoiceMode ? invoice?.customerPhone : customer?.phone}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Consolidated Balance Payable
              </span>
              <p className="text-2xl font-black text-rose-700 tabular-nums">
                {settings.currencySymbol}
                {(isInvoiceMode ? invoice?.balance || 0 : totalBalanceDue).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isInvoiceMode
                  ? `Invoice Status: ${invoice?.status?.toUpperCase()}`
                  : `${projects.length} Active Work Order(s)`}
              </p>
            </div>
          </div>

          {/* Breakdown Table */}
          {isInvoiceMode ? (
            <div className="space-y-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-2.5 px-2">Line Item / Service Scope</th>
                    <th className="py-2.5 px-2 text-right">Quantity</th>
                    <th className="py-2.5 px-2 text-right">Unit Rate</th>
                    <th className="py-2.5 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice?.lineItems.map((li) => (
                    <tr key={li.id}>
                      <td className="py-3 px-2 font-medium text-slate-900">{li.description}</td>
                      <td className="py-3 px-2 text-right text-slate-600 tabular-nums font-mono">
                        {li.quantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right text-slate-600 tabular-nums font-mono">
                        {settings.currencySymbol}{li.unitPrice}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-slate-900 tabular-nums font-mono">
                        {settings.currencySymbol}{li.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Calculation */}
              <div className="flex justify-end pt-3">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900 tabular-nums font-mono">
                      {settings.currencySymbol}{invoice?.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable Tax ({invoice?.taxRate}%):</span>
                    <span className="font-semibold text-slate-900 tabular-nums font-mono">
                      {settings.currencySymbol}{invoice?.tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5 text-sm">
                    <span>Total Amount:</span>
                    <span className="tabular-nums font-mono">
                      {settings.currencySymbol}{invoice?.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Amount Paid Till Now:</span>
                    <span className="tabular-nums font-mono">
                      - {settings.currencySymbol}{invoice?.amountPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-extrabold border-t-2 border-slate-900 pt-1.5 text-base">
                    <span>Outstanding Due:</span>
                    <span className="tabular-nums font-mono">
                      {settings.currencySymbol}{invoice?.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Customer Statement Breakdown */
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Project Schedule & Financial Balance Breakdown
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-2">Project Site & Scope</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Contract Cost</th>
                    <th className="py-2.5 px-2 text-right">Paid To Date</th>
                    <th className="py-2.5 px-2 text-right">Pending Receivable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-2">
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="text-[11px] text-slate-500">{p.siteAddress}</div>
                      </td>
                      <td className="py-3 px-2 text-slate-700 font-medium">{p.status}</td>
                      <td className="py-3 px-2 text-right font-medium text-slate-900 tabular-nums font-mono">
                        {settings.currencySymbol}{p.totalCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right text-emerald-700 font-medium tabular-nums font-mono">
                        {settings.currencySymbol}{p.paidTillNow.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right font-extrabold text-rose-700 tabular-nums font-mono">
                        {settings.currencySymbol}{p.amountReceivable.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end pt-3">
                <div className="w-72 space-y-2 text-xs p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Consolidated Contracts:</span>
                    <span className="font-bold text-slate-900 tabular-nums font-mono">
                      {settings.currencySymbol}{totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Consolidated Paid Receipts:</span>
                    <span className="tabular-nums font-mono">
                      {settings.currencySymbol}{totalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-black border-t border-slate-300 pt-2 text-sm">
                    <span>Total Outstanding Balance:</span>
                    <span className="tabular-nums font-mono">
                      {settings.currencySymbol}{totalBalanceDue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Instructions & Legal Note */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-900 block">Payment Remittance Details:</span>
            <p>Direct Bank Deposit: First Industrial Commercial Bank · Routing: 121000358 · Acc: 9940291048</p>
            <p>Cheque Payable To: "{settings.companyName}" · Memo must note project title or invoice reference.</p>
            <p className="text-[11px] text-slate-500 pt-1">
              FieldBook Contractor Automated Billing Engine · All balances subject to contractual terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
