"use client";

import * as React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  description?: string;
}

interface ToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

let toastId = 0;
const toasts = new Map<number, ToastProps & { id: number }>();
const listeners = new Set<() => void>();

function addToast(toast: ToastProps) {
  const id = ++toastId;
  const toastWithId = { ...toast, id };
  toasts.set(id, toastWithId);
  
  // Auto remove after duration
  setTimeout(() => {
    toasts.delete(id);
    listeners.forEach(listener => listener());
  }, toast.duration || 4000);
  
  listeners.forEach(listener => listener());
  return id;
}

function removeToast(id: number) {
  toasts.delete(id);
  listeners.forEach(listener => listener());
}

// Simple toast API
export const toast = {
  success: (message: string, options?: { duration?: number; description?: string }) => 
    addToast({ message, type: "success", ...options }),
  error: (message: string, options?: { duration?: number; description?: string }) => 
    addToast({ message, type: "error", ...options }),
  info: (message: string, options?: { duration?: number; description?: string }) => 
    addToast({ message, type: "info", ...options }),
};

const Toast: React.FC<{ toast: ToastProps & { id: number } }> = ({ toast }) => {
  const getToastStyles = () => {
    const baseStyles = "flex flex-col gap-2 p-4 rounded-lg shadow-lg border max-w-sm";
    switch (toast.type) {
      case "success":
        return `${baseStyles} bg-card border-success text-success`;
      case "error":
        return `${baseStyles} bg-card border-danger text-danger`;
      case "info":
        return `${baseStyles} bg-card border-info text-info`;
      default:
        return `${baseStyles} bg-card border-border text-foreground`;
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-medium">{toast.message}</div>
          {toast.description && (
            <div className="text-xs text-muted-foreground mt-1">{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const Toaster = ({ position = "bottom-right" }: ToasterProps) => {
  const [currentToasts, setCurrentToasts] = React.useState<Array<ToastProps & { id: number }>>([]);

  React.useEffect(() => {
    const updateToasts = () => {
      setCurrentToasts(Array.from(toasts.values()));
    };
    
    listeners.add(updateToasts);
    updateToasts();
    
    return () => {
      listeners.delete(updateToasts);
    };
  }, []);

  const getPositionStyles = () => {
    const baseStyles = "fixed z-50 flex flex-col gap-2 pointer-events-none";
    switch (position) {
      case "top-right":
        return `${baseStyles} top-4 right-4`;
      case "top-left":
        return `${baseStyles} top-4 left-4`;
      case "bottom-right":
        return `${baseStyles} bottom-4 right-4`;
      case "bottom-left":
        return `${baseStyles} bottom-4 left-4`;
      default:
        return `${baseStyles} bottom-4 right-4`;
    }
  };

  if (currentToasts.length === 0) return null;

  return (
    <div className={getPositionStyles()}>
      {currentToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
};

export { Toaster };