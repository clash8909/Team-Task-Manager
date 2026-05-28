import { ClipboardList } from "lucide-react";

export default function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <ClipboardList className="mb-3 h-10 w-10 text-slate-400" />
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
}
