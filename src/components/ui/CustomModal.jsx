"use client";

import { X } from "lucide-react";

export function CustomModal({ isOpen, onClose, title, message, onConfirm, isAlert }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[var(--sidebar)] rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-[var(--foreground)]">{title || "Notice"}</h3>
          <button 
            onClick={onClose} 
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1 rounded-md hover:bg-[var(--border)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex items-center justify-end gap-3">
          {!isAlert && (
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg font-medium text-[var(--foreground)] bg-[var(--border)] hover:bg-[var(--border)]/80 transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }} 
            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors shadow-md ${
              isAlert ? 'bg-[var(--primary)] hover:bg-[var(--primary)]/90' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isAlert ? "OK" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
