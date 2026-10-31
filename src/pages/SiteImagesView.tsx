import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Filter,
  Calendar,
  AlertTriangle,
  Trash2,
  Download,
  Eye,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  HardHat,
} from 'lucide-react';
import { useContractor } from '../context/ContractorContext';
import { SiteImage, PhotoTag } from '../types';
import { Modal } from '../components/common/Modal';

export const SiteImagesView: React.FC = () => {
  const {
    settings,
    siteImages,
    projects,
    uploadSiteImage,
    deleteSiteImage,
    expiringImages,
    activeRole,
  } = useContractor();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [previewImage, setPreviewImage] = useState<SiteImage | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<string>(projects[0]?.id || '');
  const [uploadTag, setUploadTag] = useState<PhotoTag>('Membrane Laying');
  const [uploadCaption, setUploadCaption] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);

  const filteredImages = siteImages.filter((img) => {
    const matchesProj = selectedProjectId === 'All' ? true : img.projectId === selectedProjectId;
    const matchesTag = selectedTag === 'All' ? true : img.tag === selectedTag;
    return matchesProj && matchesTag;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileDataUrl || !targetProjectId) return;

    uploadSiteImage({
      projectId: targetProjectId,
      caption: uploadCaption.trim() || `${uploadTag} site photo`,
      tag: uploadTag,
      fileOrUrl: fileDataUrl,
    });

    setIsUploadModalOpen(false);
    setFileDataUrl(null);
    setUploadCaption('');
  };

  const getRetentionInfo = (deleteAfterStr: string) => {
    const expiryMs = new Date(deleteAfterStr).getTime();
    const nowMs = Date.now();
    const diffDays = Math.ceil((expiryMs - nowMs) / 86400000);

    if (diffDays <= 0) return { text: 'Purged soon', isUrgent: true };
    if (diffDays <= 7) return { text: `Purging in ${diffDays}d`, isUrgent: true };
    return { text: `Retained for ${diffDays}d`, isUrgent: false };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Site Images & Inspection Archive
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Collaborative job-site photography, milestone verification, and {settings.imageRetentionDays}-day retention compliance
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload Site Photo</span>
        </button>
      </div>

      {/* Retention Alert Banner (Automated alert requirement from README!) */}
      {expiringImages.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Automated Retention Alert:</strong> {expiringImages.length} site inspection photo(s) are scheduled for deletion within 7 days under the {settings.imageRetentionDays}-day archive policy. Download any critical warranty photos to permanent storage.
            </span>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Filter Site:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-medium px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none"
          >
            <option value="All">All Job Sites ({siteImages.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Selector */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg">
          {[
            'All',
            'Before',
            'Surface Prep',
            'Primer Application',
            'Membrane Laying',
            'Final Seal',
            'Inspection',
          ].map((tg) => (
            <button
              key={tg}
              onClick={() => setSelectedTag(tg)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                selectedTag === tg
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tg}
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
          No site photos found for the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((img) => {
            const retention = getRetentionInfo(img.deleteAfter);

            return (
              <div
                key={img.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div
                    onClick={() => setPreviewImage(img)}
                    className="relative aspect-4/3 bg-slate-900 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt={img.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />

                    {/* Tag badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                        {img.tag}
                      </span>
                    </div>

                    {/* Retention indicator badge (amber if expiring soon!) */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-xs ${
                          retention.isUrgent
                            ? 'bg-amber-500/90 text-slate-950 font-black'
                            : 'bg-black/60 text-white'
                        }`}
                      >
                        {retention.text}
                      </span>
                    </div>

                    {/* Hover view overlay */}
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-6 h-6 drop-shadow" />
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-3.5 space-y-1.5">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{img.projectName}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {img.caption}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px]">By: {img.uploadedByName}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewImage(img)}
                      className="text-slate-600 hover:text-slate-900"
                      title="Inspect"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {activeRole === 'admin' && (
                      <button
                        type="button"
                        onClick={() => deleteSiteImage(img.id)}
                        className="text-rose-500 hover:text-rose-700"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {previewImage && (
        <Modal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          title={previewImage.projectName}
          subtitle={`Stage: ${previewImage.tag} · Uploaded by ${previewImage.uploadedByName}`}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[60vh]">
              <img
                src={previewImage.url}
                alt={previewImage.caption}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div>
                <span className="font-bold text-slate-800 block">Inspection Caption:</span>
                <p className="text-slate-700 leading-relaxed">{previewImage.caption}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Uploaded: {new Date(previewImage.uploadedAt).toLocaleString()}</span>
                <span>Scheduled Deletion: {new Date(previewImage.deleteAfter).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {activeRole === 'admin' ? (
                <button
                  type="button"
                  onClick={() => {
                    deleteSiteImage(previewImage.id);
                    setPreviewImage(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete From Cloud</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Site Photo Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Site Progress Photo"
        subtitle="Contribute to real-time project milestone records"
        maxWidth="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Project</label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
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
              <label className="block font-semibold text-slate-700 mb-1">Process Stage</label>
              <select
                value={uploadTag}
                onChange={(e) => setUploadTag(e.target.value as PhotoTag)}
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
              <label className="block font-semibold text-slate-700 mb-1">Select File / Camera</label>
              <label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 bg-slate-50 cursor-pointer text-slate-600 font-medium truncate">
                <Camera className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{fileDataUrl ? 'Change File' : 'Choose Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {fileDataUrl && (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-950 flex items-center justify-center">
              <img src={fileDataUrl} alt="Preview" className="max-h-48 w-auto object-contain" />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Photo Description</label>
            <textarea
              rows={2}
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="e.g. Surface cracks grouted with epoxy and moisture test verified at 3.8%."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fileDataUrl}
              className={`px-4 py-2 text-xs font-semibold rounded-lg ${
                fileDataUrl
                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Upload to Gallery
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
