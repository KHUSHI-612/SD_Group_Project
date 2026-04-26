import type React from "react";

type MetricPillProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

export default function MetricPill({ icon: Icon, label, value }: MetricPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}