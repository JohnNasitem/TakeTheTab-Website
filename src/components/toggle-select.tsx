"use client";

import React, { useState } from "react";

interface ToggleSelectProps {
  toggleName: string;
  leftLabel: string;
  rightLabel: string;
  leftDefault?: boolean;
  onChange?: (isLeftSelected: boolean) => void;
}

const ToggleSelect: React.FC<ToggleSelectProps> = ({
  toggleName,
  leftLabel,
  rightLabel,
  leftDefault = true,
  onChange,
}) => {
  const [isLeftSelected, setIsLeftSelected] = useState(leftDefault);

  const handleSelect = (value: boolean) => {
    setIsLeftSelected(value);
    onChange?.(value);
  };

  return (
    <div className="grid grid-cols-[auto_1fr_1fr] gap-4 place-items-center w-full">
      <div>{toggleName}</div>
      <button
        type="button"
        onClick={() => handleSelect(true)}
        className={`rounded-lg p-2 md:p-3 w-full ${
          isLeftSelected
            ? "bg-[var(--color-bg-alt-accent)] border-2 border-transparent hover:border-[var(--color-border)]"
            : "bg-[var(--color-bg-accent)] border-2 border-transparent hover:border-[var(--color-border)]"
        }`}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => handleSelect(false)}
        className={`rounded-lg p-2 md:p-3 w-full ${
          !isLeftSelected
            ? "bg-[var(--color-bg-alt-accent)] border-2 border-transparent hover:border-[var(--color-border)]"
            : "bg-[var(--color-bg-accent)] border-2 border-transparent hover:border-[var(--color-border)]"
        }`}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default ToggleSelect;
