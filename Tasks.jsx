import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "success") {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-soft"
          >
            {toast.type === "error" ? (
              <XCircle className="mt-0.5 h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="mt-0.5 h-5 w-5 text-mint" />
            )}
            <p className="text-sm font-medium text-slate-700">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
