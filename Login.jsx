const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700"
};

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-orange-100 text-orange-700",
  HIGH: "bg-red-100 text-red-700"
};

function label(value) {
  return value.replace("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[value]}`}>
      {label(value)}
    </span>
  );
}

export function PriorityBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[value]}`}>
      {label(value)}
    </span>
  );
}
