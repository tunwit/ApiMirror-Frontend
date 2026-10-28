"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

export default function Modal({ children, open, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100svh-40px)] w-[calc(100%-40px)] max-w-140 overflow-y-auto rounded-lg border border-solid border-[#e2e2df] bg-white p-6 text-[#1f1f1f] backdrop:bg-black/25"
    >
      <button type="button" onClick={onClose} className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[#666663] hover:bg-[#f7f7f6] focus-visible:outline-2 focus-visible:outline-offset-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
      {children}
    </dialog>
  );
}
