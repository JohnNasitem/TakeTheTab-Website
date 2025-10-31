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
    <div className="grid grid-cols-[auto_1fr] gap-4 place-items-center w-full">
      <div>{toggleName}</div>
      <div className="grid grid-cols-2 bg-[var(--color-background)] rounded-lg">
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={`rounded-lg p-2 md:p-3 w-full ${
            isLeftSelected
              ? "bg-[var(--color-bg-alt-accent)]"
              : "bg-[var(--color-background)]"
          }`}
        >
          {leftLabel}
        </button>
        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={`rounded-lg p-2 md:p-3 w-full ${
            !isLeftSelected
              ? "bg-[var(--color-bg-alt-accent)]"
              : "bg-[var(--color-background)]"
          }`}
        >
          {rightLabel}
        </button>
      </div>
    </div>
  );
};

export default ToggleSelect;
