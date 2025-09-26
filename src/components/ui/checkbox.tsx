"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({ className, checked, onCheckedChange, onChange, ...props }: CheckboxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    onCheckedChange?.(newChecked);
    onChange?.(event);
  };

  return (
    <div className="relative inline-flex">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      <div
        className={cn(
          "peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          checked && "bg-primary border-primary text-primary-foreground",
          className,
        )}
        onClick={() => onCheckedChange?.(!checked)}
      >
        {checked && (
          <div className="flex items-center justify-center text-current transition-none">
            <CheckIcon className="size-3.5" />
          </div>
        )}
      </div>
    </div>
  );
}

export { Checkbox };