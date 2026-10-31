import React, { useState } from 'react';
import {
  FolderKanban,
  DollarSign,
  AlertCircle,
  Truck,
  Users2,
  CalendarCheck,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { Project, Customer } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: string, contextId?: string) => void;
  onOpenNewProject: () => void;
  onOpenLogPayment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewProject,
  onOpenLogPayment,
}) => {
  const {
    settings,
    metrics,
    projects,
    customers,
    attendance,
    expiringImages,
    laborers,
  } = useContractor();

  const todayStr = '2026-10-31';

  // Find attendance for today
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentCountToday = todayAttendance.filter((a) => a.present).length;

  // Active sites today (projects that have laborers present today)
  const activeProjectIdsToday = Array.from(
    new Set(todayAttendance.filter((a) => a.present).map((a) => a.projectId))
  );
  const activeProjectsToday = projects.filter((p) => activeProjectIdsToday.includes(p.id));

  // Recent 4 projects
  const recentProjects = [...projects].slice(0, 4);

  // Generate last 7 days for mini calendar
  const last7Days = [
    { date: '2026-10-25', day: 'Sun', short: '25' },
    { date: '2026-10-26', day: 'Mon', short: '26' },
    { date: '2026-10-27', day: 'Tue', short: '27' },
    { date: '2026-10-28', day: 'Wed', short: '28' },
    { date: '2026-10-29', day: 'Thu', short: '29' },
    { date: '2026-10-30', day: 'Fri', short: '30' },
    { date: '2026-10-31', day: 'Sat', short: '31' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Contractor Executive Console</span>
            <span aria-hidden="true">·</span>
            <span>License: {settings.contractorLicense}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Operational Dashboard
          </h1>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLogPayment}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Log Payment</span>
          </button>
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Automated Retention Alert (Core FieldBook requirement) */}
      {expiringImages.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Automated Image Retention Alert</p>
              <p className="text-xs text-amber-800">
                {expiringImages.length} site inspection {expiringImages.length === 1 ? 'photo is' : 'photos are'} reaching the {settings.imageRetentionDays}-day retention cutoff and will be purged in less than 7 days.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('site-images')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Review Gallery
          </button>
        </div>
      )}

      {/* Real-Time Financial & Operational Metrics (5 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Active Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Projects</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {metrics.activeProjectsCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>{projects.length} total registered</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>

        {/* Metric 2: Total Revenue Collected */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Revenue Collected</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-700 tabular-nums">
            {settings.currencySymbol}
            {metrics.totalRevenueCollected.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Across all jobs</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>

        {/* Metric 3: Consolidated Customer Receivables */}
        <div
          onClick={() => onNavigate('invoices')}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Receivables</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-700 tabular-nums">
            {settings.currencySymbol}
            {metrics.consolidatedCustomerReceivables.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Customer balance due</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>

        {/* Metric 4: Supplier Dues */}
        <div
          onClick={() => onNavigate('suppliers')}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Supplier Dues</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {settings.currencySymbol}
            {metrics.supplierDues.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Material payables</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>

        {/* Metric 5: Pending Labor Payments */}
        <div
          onClick={() => onNavigate('attendance')}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Labor Wages Owed</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {settings.currencySymbol}
            {metrics.pendingLaborPayments.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Net accrued minus advances</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* 2-Column Split: Today's Active Sites & Crew + Clickable Mini Attendance Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Sites Today */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">Sites Active Today ({activeProjectsToday.length})</h2>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">Date: Oct 31, 2026</span>
          </div>

          <div className="mt-4 space-y-3">
            {activeProjectsToday.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No active sites logged for today yet.
              </div>
            ) : (
              activeProjectsToday.map((proj) => {
                const assignedPresent = todayAttendance.filter(
                  (a) => a.projectId === proj.id && a.present
                );
                const progressPct =
                  proj.totalCost > 0
                    ? Math.round((proj.paidTillNow / proj.totalCost) * 100)
                    : 0;

                return (
                  <div
                    key={proj.id}
                    onClick={() => onNavigate('projects', proj.id)}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group bg-slate-50/50 hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                            {proj.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{proj.siteAddress}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold text-slate-900 tabular-nums">
                          {settings.currencySymbol}
                          {proj.totalCost.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 block tabular-nums">
                          Rec: {settings.currencySymbol}
                          {proj.amountReceivable.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Crew Present */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-slate-700">Crew on Site:</span>
                        <div className="flex items-center -space-x-1">
                          {assignedPresent.map((a) => (
                            <span
                              key={a.id}
                              className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800 rounded border border-white"
                              title={`${a.laborerName} (${a.note || 'Active'})`}
                            >
                              {a.laborerName?.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium tabular-nums">{progressPct}% Paid</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Clickable Mini Attendance Calendar (Core Feature) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">Attendance Tracker</h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {presentCountToday} / {laborers.length} Present
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Click any day in the mini calendar below to jump directly into the full site roster and daily log.
            </p>

            {/* Interactive Mini Calendar Strip */}
            <div className="grid grid-cols-7 gap-1.5 mt-4 text-center">
              {last7Days.map((d) => {
                const dayAtt = attendance.filter((a) => a.date === d.date);
                const dayPresent = dayAtt.filter((a) => a.present).length;
                const isToday = d.date === todayStr;

                return (
                  <button
                    key={d.date}
                    onClick={() => onNavigate('attendance', d.date)}
                    className={`p-2 rounded-lg border transition-all flex flex-col items-center cursor-pointer ${
                      isToday
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-medium opacity-80">{d.day}</span>
                    <span className="text-xs font-bold mt-0.5 tabular-nums">{d.short}</span>
                    <div className="mt-1.5 flex items-center justify-center">
                      {dayPresent > 0 ? (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isToday ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Today's Labor Outlay Snapshot */}
            <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Today's Labor Outlay:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {settings.currencySymbol}
                  {todayAttendance
                    .reduce((sum, a) => sum + (a.wageForDay || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Advances Disbursed:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {settings.currencySymbol}
                  {todayAttendance
                    .reduce((sum, a) => sum + (a.advancePaidToday || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('attendance')}
            className="w-full mt-4 py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Consolidated Attendance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Projects & Balances</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, area calculations, and outstanding balances
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-2.5 px-3">Project Title</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Area (sq ft)</th>
                <th className="py-2.5 px-3 text-right">Total Cost</th>
                <th className="py-2.5 px-3 text-right">Paid</th>
                <th className="py-2.5 px-3 text-right">Receivable</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentProjects.map((proj) => {
                const statusStyles: Record<string, string> = {
                  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
                  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'Not Started': 'bg-slate-100 text-slate-700 border-slate-200',
                  'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
                };

                return (
                  <tr
                    key={proj.id}
                    onClick={() => onNavigate('projects', proj.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">
                      {proj.title}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{proj.customerName}</td>
                    <td className="py-3 px-3 text-slate-500">{proj.serviceType.join(', ')}</td>
                    <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                      {proj.areaSqFt.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-900 tabular-nums">
                      {settings.currencySymbol}
                      {proj.totalCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-medium tabular-nums">
                      {settings.currencySymbol}
                      {proj.paidTillNow.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-amber-800 tabular-nums">
                      {settings.currencySymbol}
                      {proj.amountReceivable.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                          statusStyles[proj.status] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
