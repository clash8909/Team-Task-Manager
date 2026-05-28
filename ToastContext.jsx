import { Loader2 } from "lucide-react";

export default function LoadingScreen({ label = "Loading workspace..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 shadow-soft">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
    </div>
  );
}
