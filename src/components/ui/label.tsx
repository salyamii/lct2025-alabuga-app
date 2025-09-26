"use client";

import * as React from "react";
import { cn } from "./utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };