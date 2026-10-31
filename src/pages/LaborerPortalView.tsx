import React, { useState } from 'react';
import {
  CalendarCheck,
  Camera,
  Coins,
  MapPin,
  Clock,
  CheckCircle,
  Upload,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  HardHat,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { PhotoTag } from '../types';

export const LaborerPortalView: React.FC = () => {
  const {
    settings,
    activeLaborer,
    projects,
    attendance,
    recordAttendance,
    uploadSiteImage,
    getLaborerEarnings,
  } = useContractor();

  const todayStr = '2026-10-31';

  // Find worker's attendance today
  const myTodayRecord = attendance.find(
    (a) => a.laborerId === activeLaborer?.id && a.date === todayStr
  );
  const isPresentToday = myTodayRecord ? myTodayRecord.present : false;

  // Photo upload state
  const [photoProjectId, setPhotoProjectId] = useState<string>(projects[0]?.id || '');
  const [photoTag, setPhotoTag] = useState<PhotoTag>('Membrane Laying');
  const [photoCaption, setPhotoCaption] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Worker earnings
  const earnings = activeLaborer
    ? getLaborerEarnings(activeLaborer.id)
    : { totalDaysWorked: 0, totalEarned: 0, totalAdvances: 0, balanceDue: 0 };

  // Assigned project today
  const assignedProject = projects.find(
    (p) => p.id === (myTodayRecord?.projectId || projects[0]?.id)
  );

  // Toggle today's punch in
  const handleTogglePunchIn = () => {
    if (!activeLaborer) return;
    const newPresentState = !isPresentToday;
    const defaultProj = projects[0]?.id || 'proj-1';
    recordAttendance({
      laborerId: activeLaborer.id,
      laborerName: activeLaborer.name,
      projectId: myTodayRecord?.projectId || defaultProj,
      projectName: projects.find((p) => p.id === (myTodayRecord?.projectId || defaultProj))?.title,
      date: todayStr,
      present: newPresentState,
      status: newPresentState ? 'Present' : 'Absent',
      wageForDay: newPresentState ? activeLaborer.defaultDailyWage : 0,
      advancePaidToday: myTodayRecord?.advancePaidToday || 0,
      note: newPresentState ? 'Worker self punch-in via Mobile Portal' : 'Unmarked',
    });
  };

  // Photo file selection handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage || !activeLaborer) return;

    uploadSiteImage({
      projectId: photoProjectId,
      caption: photoCaption.trim() || `${photoTag} progress photo by ${activeLaborer.name}`,
      tag: photoTag,
      fileOrUrl: previewImage,
      uploaderName: activeLaborer.name,
      uploaderRole: 'laborer',
    });

    setPreviewImage(null);
    setPhotoCaption('');
    setUploadSuccessMessage('Site photo uploaded to company gallery successfully!');
    setTimeout(() => setUploadSuccessMessage(null), 4000);
  };

  // Calendar matrix generator for October 2026
  // October 2026 starts on Thursday (index 4) and has 31 days
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
    const rec = attendance.find((a) => a.laborerId === activeLaborer?.id && a.date === dateStr);
    return {
      day: dayNum,
      dateStr,
      status: rec ? (rec.present ? (rec.status === 'Half-Day' ? 'half' : 'present') : 'absent') : 'none',
      wage: rec?.wageForDay || 0,
    };
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Top Mobile Worker Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                On-Site Worker Portal
              </span>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                {activeLaborer?.name || 'Worker'}
              </h1>
              <p className="text-xs text-slate-300">{activeLaborer?.trade}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Daily Rate</span>
            <span className="text-base font-extrabold text-amber-400 tabular-nums">
              {settings.currencySymbol}
              {activeLaborer?.defaultDailyWage}
            </span>
          </div>
        </div>

        {/* Assigned Site Badge */}
        {assignedProject && (
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px]">Today's Assigned Site:</span>
              <span className="font-semibold text-white block">{assignedProject.title}</span>
              <span className="text-slate-300 text-[11px]">{assignedProject.siteAddress}</span>
            </div>
          </div>
        )}
      </div>

      {/* Today's Punch-In & Check-In Action Card */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400">Today's Date:</span>
            <h2 className="text-sm font-bold text-slate-900">Saturday, October 31, 2026</h2>
          </div>
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
              isPresentToday
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isPresentToday ? '✓ Present on Site' : 'Not Punched In'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleTogglePunchIn}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
            isPresentToday
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{isPresentToday ? 'Undo Today’s Check-In' : 'Punch In — Mark Present for Today'}</span>
        </button>
      </div>

      {/* Personal Earnings & Balances Summary (Core Feature from README) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Coins className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900">My Earnings & Advances Ledger</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Days Worked</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {earnings.totalDaysWorked}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Total Earned</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block tabular-nums">
              {settings.currencySymbol}{earnings.totalEarned.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Advances Received</span>
            <span className="text-lg font-bold text-rose-600 mt-0.5 block tabular-nums">
              {settings.currencySymbol}{earnings.totalAdvances.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <span className="text-[11px] text-amber-800 font-medium block">Balance Left</span>
            <span className="text-lg font-extrabold text-amber-900 mt-0.5 block tabular-nums">
              {settings.currencySymbol}{earnings.balanceDue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Large Interactive Attendance Calendar (Core Feature from README) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Attendance Calendar</h2>
            <p className="text-xs text-slate-500">October 2026 Monthly Log</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-600">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="text-slate-600">Absent</span>
            </div>
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 pb-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar days grid (October 1st 2026 was a Thursday, so 4 empty lead days) */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty slot for Sun-Wed */}
          <div className="h-10 rounded-lg bg-slate-50/40" />
          <div className="h-10 rounded-lg bg-slate-50/40" />
          <div className="h-10 rounded-lg bg-slate-50/40" />
          <div className="h-10 rounded-lg bg-slate-50/40" />

          {daysInMonth.map((item) => {
            const isToday = item.dateStr === todayStr;

            return (
              <div
                key={item.day}
                className={`h-11 rounded-lg border p-1 flex flex-col justify-between items-center transition-all ${
                  isToday
                    ? 'border-slate-900 ring-2 ring-slate-900/10 bg-slate-50 font-bold'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <span className="text-[11px] text-slate-700">{item.day}</span>
                <div className="flex items-center justify-center">
                  {item.status === 'present' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Present" />
                  )}
                  {item.status === 'half' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" title="Half-Day" />
                  )}
                  {item.status === 'absent' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" title="Absent" />
                  )}
                  {item.status === 'none' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Site Photos Directly (Core Feature from README) */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Camera className="w-4 h-4 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Upload Site Progress Photos</h2>
            <p className="text-xs text-slate-500">
              Attach inspection & progress snapshots directly to your project site
            </p>
          </div>
        </div>

        {uploadSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
            {uploadSuccessMessage}
          </div>
        )}

        <form onSubmit={handleUploadPhotoSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Project Site</label>
            <select
              value={photoProjectId}
              onChange={(e) => setPhotoProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Process Stage / Tag</label>
              <select
                value={photoTag}
                onChange={(e) => setPhotoTag(e.target.value as PhotoTag)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs bg-white"
              >
                <option value="Surface Prep">Surface Prep</option>
                <option value="Primer Application">Primer Application</option>
                <option value="Membrane Laying">Membrane Laying</option>
                <option value="Final Seal">Final Seal</option>
                <option value="Inspection">Inspection</option>
                <option value="Before">Before Work</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Take or Choose Photo</label>
              <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 bg-slate-50 cursor-pointer text-slate-600 font-medium">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>{previewImage ? 'Change Image' : 'Select Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {previewImage && (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-900">
              <img
                src={previewImage}
                alt="Selected site preview"
                className="w-full h-44 object-contain"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Photo Description / Location</label>
            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="e.g. Parapet membrane joint after 2nd elastomeric coat"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={!previewImage}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              previewImage
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo to Site Archive</span>
          </button>
        </form>
      </div>
    </div>
  );
};
