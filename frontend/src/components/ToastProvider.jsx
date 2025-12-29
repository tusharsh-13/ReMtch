import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glass-panel px-4 py-3 flex items-start gap-3 text-sm border-l-4 ${
              toast.type === "error"
                ? "border-red-500/80"
                : "border-emerald-400/80"
            }`}
          >
            <div className="font-medium">
              {toast.title || (toast.type === "error" ? "Error" : "Success")}
            </div>
            {toast.description && (
              <div className="text-slate-300 text-xs">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}


