import type { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
}

export default function FormField({ label, children, hint, error }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
