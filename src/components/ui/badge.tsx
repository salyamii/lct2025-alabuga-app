import * as React from "react";

import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  asChild?: boolean;
}

const getBadgeClasses = (variant: string = "default") => {
  const baseClasses = "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden shadow-sm";
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
    secondary: "border-transparent bg-secondary text-white [a&]:hover:bg-secondary/90",
    destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
    outline: "text-foreground border-border bg-card/50 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  };
  
  return `${baseClasses} ${variants[variant as keyof typeof variants]}`;
};

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const classes = cn(getBadgeClasses(variant), className);
  
  if (asChild) {
    return React.cloneElement(props.children as React.ReactElement<any>, {
      className: classes,
      ...props
    });
  }

  return (
    <span
      data-slot="badge"
      className={classes}
      {...props}
    />
  );
}

export { Badge };