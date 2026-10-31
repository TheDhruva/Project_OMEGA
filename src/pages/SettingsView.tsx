import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Building,
  DollarSign,
  Clock,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { Modal } from '../components/common/Modal';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetAllData,
    exportDataJson,
    importDataJson,
  } = useContractor();

  const [formData, setFormData] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const dataStr = exportDataJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fieldbook-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    const success = importDataJson(importJsonText);
    if (success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
      window.location.reload();
    } else {
      setImportError('Invalid JSON structure. Please ensure this is a valid FieldBook backup file.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Contractor Business Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Company identity, license compliance, currency configuration, and data backup ledgers
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Business settings saved successfully! All generated invoices and statements will reflect these changes.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Contractor Profile & Licensing</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Trading Name</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contractor License #</label>
              <input
                type="text"
                required
                value={formData.contractorLicense}
                onChange={(e) => setFormData({ ...formData, contractorLicense: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Tax ID / GSTIN / VAT</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office / Yard Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Parameters */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Financial & Compliance Standards</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Symbol</label>
              <select
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-bold bg-white"
              >
                <option value="$">$ (USD / CAD / AUD)</option>
                <option value="₹">₹ (INR Rupee)</option>
                <option value="£">£ (GBP Pound)</option>
                <option value="€">€ (EUR Euro)</option>
                <option value="AED">AED (Emirati Dirham)</option>
                <option value="SAR">SAR (Saudi Riyal)</option>
                <option value="₱">₱ (PHP Peso)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.defaultTaxRate}
                onChange={(e) =>
                  setFormData({ ...formData, defaultTaxRate: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Site Image Retention (Days)
              </label>
              <input
                type="number"
                min="7"
                max="365"
                value={formData.imageRetentionDays}
                onChange={(e) =>
                  setFormData({ ...formData, imageRetentionDays: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>

      {/* Database Management & Backup Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Database Tools & Offline Backup</h2>
        </div>

        <p className="text-xs text-slate-600">
          Export complete project records, customer accounts, daily attendance sheets, and material ledgers as an offline JSON archive, or restore sample data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Restore From JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Demo Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Entire Database to Sample Data"
        subtitle="Restores sample projects, laborers, suppliers, and customer ledgers"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This will overwrite local edits and reset the system to the initial clean showcase dataset with active projects, attendance logs, and sample invoices.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-3 py-1.5 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                resetAllData();
                setIsResetConfirmOpen(false);
                window.location.reload();
              }}
              className="px-3.5 py-1.5 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
            >
              Yes, Reset Data
            </button>
          </div>
        </div>
      </Modal>

      {/* Import JSON Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Restore Database from JSON"
        subtitle="Paste your backup JSON content below"
        maxWidth="lg"
      >
        <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
          {importError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
              {importError}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">JSON Backup Content</label>
            <textarea
              rows={8}
              required
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste backup JSON..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-3.5 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Import & Restore
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
