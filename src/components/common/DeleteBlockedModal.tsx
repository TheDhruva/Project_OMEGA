import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Modal } from './Modal';

interface DeleteBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onSettleAction?: () => void;
  settleButtonText?: string;
}

export const DeleteBlockedModal: React.FC<DeleteBlockedModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onSettleAction,
  settleButtonText = 'Go to Settlement / Payment',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Financial Protection Rule"
      subtitle="Data deletion restricted by FieldBook integrity engine"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-900">{title}</h4>
            <p className="text-xs text-amber-800 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
          <div className="font-medium text-slate-700 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
            Why is this restricted?
          </div>
          <p>
            FieldBook enforces double-entry contractor audit compliance. Deleting active projects or accounts with pending receivables would corrupt accounts receivable ledgers and tax records.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {onSettleAction && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSettleAction();
              }}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              {settleButtonText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
