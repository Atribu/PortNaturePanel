// components/ConfirmDialog.jsx
"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function ConfirmDialog({ open, onOpenChange, onConfirm }) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
          <AlertDialog.Title className="text-lg font-bold">
            Eğitimi Tamamla
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-gray-600">
            Bu eğitimi tamamladığınıza emin misiniz? Bu işlem geri alınamaz.
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
              Vazgeç
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Evet, Eminim
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}