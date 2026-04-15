"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useShape } from "@/lib/shape-context";

export type ValuePosition = "left" | "right" | "top" | "bottom" | "tooltip";

interface ValueItemProps {
  index: number;
  isEditing: boolean;
  value: number;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (v: string) => void;
  onCommitEdit: (index: number) => void;
  onCancelEdit: () => void;
  onStartEdit: (index: number) => void;
  formatValue: (v: number) => string;
  min: number;
  max: number;
  step: number;
  isRange: boolean;
  shapeInput: string;
}

function ValueItem({
  index,
  isEditing,
  value,
  inputValue,
  inputRef,
  onInputChange,
  onCommitEdit,
  onCancelEdit,
  onStartEdit,
  formatValue,
  min,
  max,
  step,
  isRange,
  shapeInput,
}: ValueItemProps) {
  if (isEditing) {
    return (
      <span className="inline-grid text-[13px]">
        <span
          className="col-start-1 row-start-1 invisible"
          style={{ fontVariationSettings: "var(--font-weight-medium)" }}
          aria-hidden="true"
        >
          {formatValue(max)}
        </span>
        <span className="col-start-1 row-start-1 flex items-center gap-1">
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onInputChange(e.target.value)}
            onBlur={() => onCommitEdit(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommitEdit(index);
              if (e.key === "Escape") onCancelEdit();
            }}
            aria-label={`Edit slider value${isRange ? (index === 0 ? " (start)" : " (end)") : ""}`}
            className={cn(
              "w-[5ch] bg-transparent text-foreground outline-none border-b border-border text-center",
              shapeInput,
            )}
            style={{ fontVariationSettings: "var(--font-weight-medium)" }}
          />
        </span>
      </span>
    );
  }

  return (
    <span
      className="cursor-text select-none"
      role="button"
      tabIndex={0}
      onClick={() => onStartEdit(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onStartEdit(index);
        }
      }}
    >
      {formatValue(value)}
    </span>
  );
}

interface ValueDisplayProps {
  values: number[];
  editingIndex: number | null;
  onStartEdit: (index: number) => void;
  onCommitEdit: (index: number, v: number) => void;
  onCancelEdit: () => void;
  min: number;
  max: number;
  step: number;
  formatValue: (v: number) => string;
  label?: string;
  isRange: boolean;
  isInteracting: boolean;
  valuePosition: ValuePosition;
}

export function ValueDisplay({
  values,
  editingIndex,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  min,
  max,
  step,
  formatValue,
  label,
  isRange,
  isInteracting,
  valuePosition,
}: ValueDisplayProps) {
  const shape = useShape();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null) {
      setInputValue(String(values[editingIndex]));
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [editingIndex, values]);

  const commitEdit = useCallback(
    (index: number) => {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        const clamped = Math.max(min, Math.min(max, parsed));
        const snapped = Math.round((clamped - min) / step) * step + min;
        onCommitEdit(index, snapped);
      } else {
        onCancelEdit();
      }
    },
    [inputValue, min, max, step, onCommitEdit, onCancelEdit]
  );

  const valueItemProps = {
    inputValue,
    inputRef,
    onInputChange: setInputValue,
    onCommitEdit: commitEdit,
    onCancelEdit,
    onStartEdit,
    formatValue,
    min,
    max,
    step,
    isRange,
    shapeInput: shape.input,
  };

  const isRowLayout = valuePosition === "top" || valuePosition === "bottom";

  return (
    <div
      className={cn(
        "flex items-center text-[13px] tabular-nums transition-[font-variation-settings] duration-100",
        isRowLayout
          ? "justify-between w-full"
          : valuePosition === "left"
            ? "shrink-0 text-muted-foreground text-left mr-2"
            : "shrink-0 text-muted-foreground text-right ml-2",
      )}
      style={{
        fontVariationSettings: isInteracting
          ? "var(--font-weight-medium)"
          : "var(--font-weight-normal)",
      }}
    >
      {label && editingIndex === null && (
        <span className={cn(isRowLayout ? "text-sm font-medium text-foreground" : "text-muted-foreground")}>
          {label}{!isRowLayout && ": "}
        </span>
      )}
      <span className={cn(!isRowLayout && "text-muted-foreground", isRowLayout && "text-sm text-muted-foreground")}>
        {isRange ? (
          <>
            <ValueItem index={0} isEditing={editingIndex === 0} value={values[0]} {...valueItemProps} />
            <span className="mx-1 text-muted-foreground/50">—</span>
            <ValueItem index={1} isEditing={editingIndex === 1} value={values[1]} {...valueItemProps} />
          </>
        ) : (
          <ValueItem index={0} isEditing={editingIndex === 0} value={values[0]} {...valueItemProps} />
        )}
      </span>
    </div>
  );
}
