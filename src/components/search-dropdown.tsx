"use client"

import { useState, useRef, useEffect } from "react";

export default function SearchDropdown<T>({
  placeholder = "Search...",
  data,
  displayFn,
  onSelect,
}: {
  placeholder?: string;
  data: Record<string | number, T> | T[];
  displayFn?: (item: T) => string;
  onSelect?: (id: string | number, item: T) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Normalize data into entries
  const entries = Array.isArray(data)
    ? data.map((item, i) => [i, item] as [string | number, T])
    : Object.entries(data);

  // Filter logic
  const filtered = entries.filter(([_, value]) =>
    (displayFn?.(value) ?? String(value))
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="rounded-lg px-3 py-2 w-full focus:outline-none h-full bg-[var(--color-background)]"
        value={searchValue}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      {isFocused && filtered.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 border text-[var(--color-bg-alt-accent)] rounded overflow-y-auto bg-[var(--color-bg-accent)] max-h-[20dvh] h-max z-10">
          {filtered.map(([id, item]) => (
            <li
              key={id}
              className="px-3 py-2 hover:bg-[var(--color-bg-alt-accent)] text-[var(--color-foreground)] cursor-pointer"
              onMouseDown={() => {
                onSelect?.(id, item);
                setSearchValue("");
                setIsFocused(false);
              }}
            >
              <div className="truncate w-[65dvw] md:w-[45dvw] inline-block">
                {displayFn ? displayFn(item) : String(item)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
