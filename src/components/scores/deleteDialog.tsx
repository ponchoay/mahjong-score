import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button.tsx";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

interface DeleteDialogProps {
  isOpen: boolean;
  date: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function DeleteDialog({
  isOpen,
  date,
  onConfirm,
  onClose,
}: DeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // showModal()による自動フォーカスを解除し、不要なフォーカス枠線を防ぐ
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-sm rounded-dialog p-0 backdrop:bg-black/50"
    >
      <div className="p-6 text-center">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-3xl text-danger-500 mb-3"
        />
        <p className="text-gray-800 font-medium">この試合を削除しますか？</p>
        <p className="mt-1 text-sm text-gray-500">{formatDate(date)} の記録</p>
        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            isLoading={isDeleting}
            className="flex-1"
          >
            {isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : "削除"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
