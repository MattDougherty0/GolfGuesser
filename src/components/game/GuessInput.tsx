"use client";

import { useState, useRef, useEffect } from "react";
import { searchCourses } from "@/lib/courses";

interface GuessInputProps {
  onChange: (courseId: string | null, courseName: string) => void;
  disabled?: boolean;
}

export default function GuessInput({ onChange, disabled = false }: GuessInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 3 || selectedId) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const matches = searchCourses(query).map((c) => ({ id: c.id, name: c.name }));
    setResults(matches);
    setIsOpen(matches.length > 0);
    setHighlightIndex(-1);
  }, [query, selectedId]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(id: string, name: string) {
    setQuery(name);
    setSelectedId(id);
    setIsOpen(false);
    onChange(id, name);
  }

  function handleInputChange(value: string) {
    setQuery(value);
    if (selectedId) {
      setSelectedId(null);
    }
    onChange(null, value);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      const match = results[highlightIndex];
      handleSelect(match.id, match.name);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0 && !selectedId) setIsOpen(true);
        }}
        disabled={disabled}
        placeholder="Type a course name… (optional)"
        className={`
          w-full rounded-lg border bg-card px-4 py-3 text-sm text-cream
          placeholder:text-cream/30 outline-none transition-colors
          ${selectedId
            ? "border-accent/40 bg-accent/5"
            : "border-cream/15 focus:border-accent/40"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      />

      {selectedId && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-accent text-sm">
          ✓
        </div>
      )}

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-cream/15 bg-card shadow-xl">
          {results.map((course, i) => (
            <li key={course.id}>
              <button
                type="button"
                onClick={() => handleSelect(course.id, course.name)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm transition-colors
                  ${i === highlightIndex
                    ? "bg-accent/15 text-accent"
                    : "text-cream/80 hover:bg-cream/5"
                  }
                `}
              >
                {course.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
