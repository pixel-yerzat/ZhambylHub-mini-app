import React, { useRef, useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';

/**
 * Native iOS / Telegram Mini App Stack Page Modal Sheet Component
 * Features:
 * - Stack card depth & visual hierarchy
 * - Grab handle drag-down pull to dismiss gesture
 * - Smooth spring transitions & backdrop blur
 * - Scaled background viewport effect
 */
export const ModalStackSheet = ({
  isOpen = true,
  onClose,
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  children,
  maxWidth = 'max-w-lg',
  maxHeight = '',
  showGrabber = true,
  showCloseBtn = true
}) => {
  const sheetRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Touch Drag-Down to Dismiss
  const handleTouchStart = (e) => {
    // Only allow drag-down from the top header or grabber area, or when top of modal
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    currentYRef.current = touch.clientY;
    const deltaY = currentYRef.current - startYRef.current;
    
    // Only allow dragging downwards
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaY = currentYRef.current - startYRef.current;

    // If dragged down more than 110px, trigger close
    if (deltaY > 110) {
      hapticFeedback.impact('medium');
      onClose();
    } else {
      // Spring back up
      setDragOffset(0);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={sheetRef}
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
        }}
        className={`modal-sheet modal-sheet-stack ${maxWidth} ${maxHeight} flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Grab Handle Area (Touch Drag zone) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full flex flex-col items-center pt-2.5 pb-1 select-none cursor-grab active:cursor-grabbing shrink-0"
        >
          {showGrabber && <div className="modal-handle-bar" />}
        </div>

        {/* Stack Page Header Bar */}
        {(title || Icon || badge || showCloseBtn) && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(186,215,247,0.12)] shrink-0 gap-3 select-none">
            {/* Left Brand / Icon / Title */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {Icon && (
                <div className="w-8 h-8 rounded-xl bg-[rgba(102,58,243,0.2)] border border-[#663af3]/40 flex items-center justify-center text-[#d8ecf8] shrink-0 shadow-[0_0_10px_rgba(102,58,243,0.3)]">
                  <Icon className="w-4 h-4 text-[#a78bfa]" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                {title && (
                  <h2 className="font-display text-sm sm:text-base font-bold text-white truncate leading-tight">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-[11px] text-[#9da7ba] truncate mt-0.5 leading-tight">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right Actions: Badge / Custom buttons / Close Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              {badge}
              {actions}
              {showCloseBtn && (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost-pill !p-1.5 text-[#c7d3ea] hover:text-white hover:border-[#663af3] transition-all"
                  title="Закрыть"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};
