import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import type { Config, ScoreFormData, ScoreRecord } from "../../types/index.ts";
import { ScoreForm } from "./scoreForm.tsx";

interface ScoreModalProps {
  isOpen: boolean;
  config: Config;
  editTarget?: ScoreRecord;
  onSubmit: (data: ScoreFormData) => Promise<void>;
  onClose: () => void;
}

export function ScoreModal({
  isOpen,
  config,
  editTarget,
  onSubmit,
  onClose,
}: ScoreModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-md rounded-dialog p-0 backdrop:bg-black/50"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            <FontAwesomeIcon
              icon={editTarget ? faPenToSquare : faPlus}
              className="mr-2 text-brand-600"
            />
            {editTarget ? "試合を編集" : "試合を追加"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>
        <ScoreForm
          config={config}
          initialData={editTarget}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </dialog>
  );
}
