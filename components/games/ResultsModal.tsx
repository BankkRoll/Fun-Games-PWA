// components/games/resultsModal.tsx
import React, { useEffect, useRef } from "react";

interface OutcomeModalProps {
  show: boolean;
  outcome: "win" | "loss";
  onClose: () => void;
  winningAmount?: number | null;
  closeModalKey: string;
}


const OutcomeModal: React.FC<OutcomeModalProps> = ({
  show,
  outcome,
  onClose,
  winningAmount,
  closeModalKey,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === closeModalKey) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, closeModalKey]);

  if (!show) {
    return null;
  }

  return (
    <div
      className="z-50 fixed inset-0 flex items-center justify-center bg-opacity-80 bg-black"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-card rounded-lg shadow-lg max-w-xl mx-auto p-2 text-foreground relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-destructive dark:text-destructive text-4xl md:text-6xl transition-colors duration-300 ease-in-out"
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-4 text-center">
          <div className="text-center p-4">
            <h2 className="text-xl md:text-4xl my-8 text-shadow text-foreground">
              {outcome === "win"
                ? `🎉 You won ${winningAmount} coins! 🎉`
                : "🍀 Better luck next time 🍀"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomeModal;
