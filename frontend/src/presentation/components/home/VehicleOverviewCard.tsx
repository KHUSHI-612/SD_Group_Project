import { ArrowRight, BatteryCharging, Gauge, Thermometer, Zap } from "lucide-react";
import MetricPill from "./MetricPill";

export default function VehicleOverviewCard() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="relative h-[255px] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,199,255,0.22),_transparent_45%)]" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
              <Zap className="h-3.5 w-3.5" />
              Vehicle Overview
            </div>

            <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-[280px]">
            <div className="relative mx-auto h-24 rounded-full border border-white/10 bg-gradient-to-r from-slate-100 via-white to-slate-300">
              <div className="absolute left-8 right-8 top-6 h-6 rounded-full bg-slate-900/10" />
              <div className="absolute -bottom-2 left-8 h-9 w-9 rounded-full border-[6px] border-slate-900 bg-slate-700" />
              <div className="absolute -bottom-2 right-8 h-9 w-9 rounded-full border-[6px] border-slate-900 bg-slate-700" />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <MetricPill icon={BatteryCharging} label="Battery" value="75%" />
            <MetricPill icon={Thermometer} label="Temp" value="23°C" />
            <MetricPill icon={Gauge} label="Range" value="251 km" />
          </div>
        </div>
      </div>
    </div>
  );
}