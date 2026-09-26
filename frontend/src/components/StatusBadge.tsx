import { useEffect, useRef, useState } from "react";

import type { LeadStatus } from "../types/lead";

const statusOptions: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];

const statusClassMap: Record<LeadStatus, string> = {
  New: "status-new",
  Contacted: "status-contacted",
  Qualified: "status-qualified",
  Lost: "status-lost",
};

interface StatusBadgeProps {
  status: LeadStatus;
  onChange: (status: LeadStatus) => void;
}

const StatusBadge = ({ status, onChange }: StatusBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && !buttonRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      event.preventDefault();
      const options = statusOptions.filter((option) => option !== status);
      const activeIndex = options.findIndex(
        (_option, index) => optionRefs.current[index] === document.activeElement,
      );

      const nextIndex =
        event.key === "ArrowDown"
          ? (activeIndex + 1 + options.length) % options.length
          : (activeIndex - 1 + options.length) % options.length;

      optionRefs.current[nextIndex]?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, status]);

  const handleSelect = (nextStatus: LeadStatus) => {
    onChange(nextStatus);
    setIsOpen(false);
    setIsFlashing(true);

    window.setTimeout(() => {
      setIsFlashing(false);
    }, 300);
  };

  const availableOptions = statusOptions.filter((option) => option !== status);

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        className={`status-pill ${statusClassMap[status]} ${isFlashing ? "status-badge--flash" : ""}`}
        aria-label={`Status: ${status}. Click to change.`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentOpen) => !currentOpen)}
      >
        <span>{status}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="status-chevron">
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <div ref={menuRef} role="menu" aria-label="Change lead status" className="status-menu">
          {availableOptions.map((option, index) => (
            <button
              key={option}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="menuitem"
              aria-label={`Set status to ${option}`}
              className={`status-menu-item ${statusClassMap[option]}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default StatusBadge;
