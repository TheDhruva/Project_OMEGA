import React, { useState } from 'react';
import {
  CalendarCheck2,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  DollarSign,
  Briefcase,
  Check,
  X,
  Clock,
  UserPlus,
  Edit2,
  Phone,
  Coins,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { AttendanceStatus, Laborer } from '../types';
import { Modal } from '../components/common/Modal';

export const AttendanceView: React.FC = () => {
  const {
    settings,
    laborers,
    projects,
    attendance,
    recordAttendance,
    addLaborer,
    updateLaborer,
    getLaborerEarnings,
  } = useContractor();

  const [activeSubTab, setActiveSubTab] = useState<'sheet' | 'laborers'>('sheet');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-31');

  // New Laborer Modal
  const [isAddLaborerModalOpen, setIsAddLaborerModalOpen] = useState(false);
  const [labName, setLabName] = useState('');
  const [labPhone, setLabPhone] = useState('');
  const [labEmail, setLabEmail] = useState('');
  const [labTrade, setLabTrade] = useState('Master Waterproofer');
  const [labDailyWage, setLabDailyWage] = useState<number>(75);
  const [labAddress, setLabAddress] = useState('');

  // Settle / Advance Modal
  const [settleModalLaborer, setSettleModalLaborer] = useState<Laborer | null>(null);
  const [advanceAmount, setAdvanceAmount] = useState<number>(50);
  const [advanceNote, setAdvanceNote] = useState('Mid-week advance disbursement');

  // Change date handler
  const handleDateOffset = (offsetDays: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offsetDays);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Find attendance records for the selected date
  const dayRecords = attendance.filter((a) => a.date === selectedDate);

  // Quick lookup helper for laborer status on selected date
  const getRecordForLaborer = (laborerId: string) => {
    return dayRecords.find((a) => a.laborerId === laborerId);
  };

  const handleStatusChange = (laborer: Laborer, newStatus: AttendanceStatus) => {
    const existing = getRecordForLaborer(laborer.id);
    const isPresent = newStatus !== 'Absent';
    const defaultProj = projects[0]?.id || 'proj-1';
    const wage =
      newStatus === 'Present'
        ? laborer.defaultDailyWage
        : newStatus === 'Half-Day'
        ? laborer.defaultDailyWage / 2
        : 0;

    recordAttendance({
      laborerId: laborer.id,
      laborerName: laborer.name,
      projectId: existing?.projectId || defaultProj,
      projectName: projects.find((p) => p.id === (existing?.projectId || defaultProj))?.title,
      date: selectedDate,
      present: isPresent,
      status: newStatus,
      wageForDay: wage,
      advancePaidToday: existing?.advancePaidToday || 0,
      note: existing?.note || '',
    });
  };

  const handleProjectChange = (laborer: Laborer, projectId: string) => {
    const existing = getRecordForLaborer(laborer.id);
    const proj = projects.find((p) => p.id === projectId);
    recordAttendance({
      laborerId: laborer.id,
      laborerName: laborer.name,
      projectId,
      projectName: proj?.title,
      date: selectedDate,
      present: existing ? existing.present : true,
      status: existing ? existing.status : 'Present',
      wageForDay: existing ? existing.wageForDay : laborer.defaultDailyWage,
      advancePaidToday: existing?.advancePaidToday || 0,
      note: existing?.note || '',
    });
  };

  const handleAdvanceChange = (laborer: Laborer, advanceVal: number) => {
    const existing = getRecordForLaborer(laborer.id);
    const defaultProj = projects[0]?.id || 'proj-1';
    recordAttendance({
      laborerId: laborer.id,
      laborerName: laborer.name,
      projectId: existing?.projectId || defaultProj,
      projectName: projects.find((p) => p.id === (existing?.projectId || defaultProj))?.title,
      date: selectedDate,
      present: existing ? existing.present : false,
      status: existing ? existing.status : 'Absent',
      wageForDay: existing ? existing.wageForDay : 0,
      advancePaidToday: advanceVal,
      note: existing?.note || '',
    });
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    laborers.forEach((lab) => {
      handleStatusChange(lab, status);
    });
  };

  const handleCreateLaborer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim() || !labPhone.trim()) return;

    addLaborer({
      name: labName.trim(),
      phone: labPhone.trim(),
      email: labEmail.trim() || undefined,
      role: 'laborer',
      trade: labTrade,
      defaultDailyWage: Number(labDailyWage),
      address: labAddress.trim(),
      isActive: true,
    });

    setIsAddLaborerModalOpen(false);
    setLabName('');
    setLabPhone('');
    setLabEmail('');
    setLabAddress('');
  };

  const handleDisburseAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleModalLaborer || advanceAmount <= 0) return;

    handleAdvanceChange(settleModalLaborer, advanceAmount);
    setSettleModalLaborer(null);
  };

  // Day metrics
  const activeCount = dayRecords.filter((r) => r.present).length;
  const totalDayWage = dayRecords.reduce((sum, r) => sum + (r.wageForDay || 0), 0);
  const totalDayAdvances = dayRecords.reduce((sum, r) => sum + (r.advancePaidToday || 0), 0);
  const netDayAccrual = Math.max(0, totalDayWage - totalDayAdvances);

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Labor & Daily Attendance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated daily site presence, site assignments, wage calculations, and advance ledgers
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveSubTab('sheet')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'sheet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Sheet
            </button>
            <button
              onClick={() => setActiveSubTab('laborers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'laborers'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Workers & Wage Dues
            </button>
          </div>

          <button
            onClick={() => setIsAddLaborerModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'sheet' && (
        <div className="space-y-4">
          {/* Date Selector Bar with Quick Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            {/* Date Navigator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDateOffset(-1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
              />

              <button
                onClick={() => handleDateOffset(1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedDate('2026-10-31')}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            {/* Quick Bulk Action Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Batch:</span>
              <button
                onClick={() => handleMarkAll('Present')}
                className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('Absent')}
                className="px-2.5 py-1 text-xs font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Consolidated Attendance Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
                    <th className="py-3 px-4">Worker & Trade</th>
                    <th className="py-3 px-3 text-center">Status (Click to toggle)</th>
                    <th className="py-3 px-3">Assigned Site / Project</th>
                    <th className="py-3 px-3 text-right">Daily Wage Rate</th>
                    <th className="py-3 px-3 text-right">Day Outlay</th>
                    <th className="py-3 px-3 text-right">Advance Disbursed</th>
                    <th className="py-3 px-4">Work Note / Tasks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laborers.map((lab) => {
                    const record = getRecordForLaborer(lab.id);
                    const currentStatus: AttendanceStatus = record ? record.status : 'Absent';
                    const isPresent = record ? record.present : false;

                    return (
                      <tr
                        key={lab.id}
                        className={`transition-colors ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-50/20'
                            : currentStatus === 'Half-Day'
                            ? 'bg-amber-50/20'
                            : 'hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Worker Name & Role */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{lab.name}</div>
                          <div className="text-[11px] text-slate-500">{lab.trade}</div>
                        </td>

                        {/* Status Toggle Buttons (Green for Present, Red for Absent as required by README!) */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(lab, 'Present')}
                              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                                currentStatus === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-emerald-700'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(lab, 'Half-Day')}
                              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                                currentStatus === 'Half-Day'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-amber-700'
                              }`}
                            >
                              ½ Day
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(lab, 'Absent')}
                              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                                currentStatus === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-rose-700'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>

                        {/* Assigned Project */}
                        <td className="py-3 px-3">
                          <select
                            value={record?.projectId || projects[0]?.id || ''}
                            onChange={(e) => handleProjectChange(lab, e.target.value)}
                            disabled={!isPresent}
                            className={`w-full max-w-[200px] text-xs px-2 py-1 border rounded-md focus:outline-none ${
                              isPresent
                                ? 'bg-white border-slate-200 text-slate-900 font-medium'
                                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {projects.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Wage Rate */}
                        <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                          {settings.currencySymbol}
                          {lab.defaultDailyWage}
                        </td>

                        {/* Day Outlay */}
                        <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                          {settings.currencySymbol}
                          {record ? record.wageForDay : 0}
                        </td>

                        {/* Advance Today */}
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={record?.advancePaidToday || 0}
                            onChange={(e) => handleAdvanceChange(lab, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-right text-xs font-mono font-medium border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                          />
                        </td>

                        {/* Notes */}
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={record?.note || ''}
                            onChange={(e) => {
                              const existing = getRecordForLaborer(lab.id);
                              recordAttendance({
                                laborerId: lab.id,
                                laborerName: lab.name,
                                projectId: existing?.projectId || projects[0]?.id || 'proj-1',
                                date: selectedDate,
                                present: existing ? existing.present : false,
                                status: existing ? existing.status : 'Absent',
                                wageForDay: existing ? existing.wageForDay : 0,
                                advancePaidToday: existing?.advancePaidToday || 0,
                                note: e.target.value,
                              });
                            }}
                            placeholder="Tasks performed..."
                            className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-200 focus:border-slate-300 rounded bg-transparent focus:bg-white text-slate-800"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Daily Financial Totals Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Crew Present:</span>
                <span className="text-sm font-bold text-slate-900">
                  {activeCount} / {laborers.length} Workers
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Daily Wage Outlay:</span>
                <span className="text-sm font-bold text-emerald-700 tabular-nums">
                  {settings.currencySymbol}
                  {totalDayWage.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Advances Disbursed Today:</span>
                <span className="text-sm font-bold text-rose-700 tabular-nums">
                  {settings.currencySymbol}
                  {totalDayAdvances.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Net Daily Accrued Balance:</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  {settings.currencySymbol}
                  {netDayAccrual.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workers Roster & Financial Ledger SubTab */}
      {activeSubTab === 'laborers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {laborers.map((lab) => {
              const earnings = getLaborerEarnings(lab.id);

              return (
                <div
                  key={lab.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{lab.name}</h3>
                      <p className="text-xs text-slate-500">{lab.trade}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 tabular-nums">
                      {settings.currencySymbol}{lab.defaultDailyWage} / day
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{lab.phone}</span>
                    </div>
                    {lab.email && <div className="text-[11px] text-slate-400">{lab.email}</div>}
                  </div>

                  {/* Earnings & Advances Ledger */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Days Worked:</span>
                      <span className="font-semibold text-slate-900">{earnings.totalDaysWorked} days</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Wages Earned:</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {settings.currencySymbol}{earnings.totalEarned.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Advances Received:</span>
                      <span className="font-semibold text-rose-600 tabular-nums">
                        {settings.currencySymbol}{earnings.totalAdvances.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-slate-200 pt-1 text-slate-900">
                      <span>Balance Due to Worker:</span>
                      <span className="text-amber-700 tabular-nums">
                        {settings.currencySymbol}{earnings.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSettleModalLaborer(lab);
                        setAdvanceAmount(50);
                      }}
                      className="w-full py-1.5 px-3 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>Disburse Advance</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Laborer Modal */}
      <Modal
        isOpen={isAddLaborerModalOpen}
        onClose={() => setIsAddLaborerModalOpen(false)}
        title="Onboard New Site Worker"
        subtitle="Registers laborer into company payroll roster"
        maxWidth="md"
      >
        <form onSubmit={handleCreateLaborer} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              placeholder="e.g. Victor Morales"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={labPhone}
                onChange={(e) => setLabPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Daily Wage Rate ({settings.currencySymbol})</label>
              <input
                type="number"
                min="0"
                required
                value={labDailyWage}
                onChange={(e) => setLabDailyWage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Specialized Trade</label>
            <select
              value={labTrade}
              onChange={(e) => setLabTrade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
            >
              <option value="Master Waterproofer">Master Waterproofer</option>
              <option value="Thermal Coating Specialist">Thermal Coating Specialist</option>
              <option value="Mason & Surface Prep">Mason & Surface Prep</option>
              <option value="Site Technician & Applicator">Site Technician & Applicator</option>
              <option value="General Site Helper">General Site Helper</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email / Portal Access (Optional)</label>
            <input
              type="email"
              value={labEmail}
              onChange={(e) => setLabEmail(e.target.value)}
              placeholder="worker@fieldbook.internal"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddLaborerModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Add to Roster
            </button>
          </div>
        </form>
      </Modal>

      {/* Disburse Advance Modal */}
      {settleModalLaborer && (
        <Modal
          isOpen={!!settleModalLaborer}
          onClose={() => setSettleModalLaborer(null)}
          title={`Disburse Advance to ${settleModalLaborer.name}`}
          subtitle="Logs cash or transfer advance into laborer's account"
          maxWidth="md"
        >
          <form onSubmit={handleDisburseAdvance} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Advance Amount ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="1"
                required
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Disbursement Note</label>
              <input
                type="text"
                value={advanceNote}
                onChange={(e) => setAdvanceNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSettleModalLaborer(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Confirm Advance
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
