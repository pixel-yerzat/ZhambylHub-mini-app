import React from 'react';
import { useApp } from '@/context';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const NotificationToast = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-[#0c0f1e]/95 border border-[#663af3]/60 px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(102,58,243,0.35)] backdrop-blur-xl animate-[fadeIn_0.25s_ease-out] max-w-sm w-full"
        >
          <div className="w-8 h-8 rounded-full bg-[#663af3]/25 flex items-center justify-center text-[#d8ecf8] shrink-0">
            <Sparkles className="w-4 h-4 text-[#d1c4e9]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{toast.title}</p>
            <p className="text-xs text-[#c7d3ea] line-clamp-1">{toast.message}</p>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#269684] shrink-0" />
        </div>
      ))}
    </div>
  );
};
