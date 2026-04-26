import { Car } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const commuteData = [
  { day: "02 Jan", km: 78 },
  { day: "03 Jan", km: 46 },
  { day: "04 Jan", km: 24 },
  { day: "05 Jan", km: 68 },
  { day: "06 Jan", km: 41 },
];

export default function CommuteChartCard() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Avg Daily Commute
            </h2>
            <p className="text-sm text-slate-400">January 2025</p>
          </div>

          <Car className="h-5 w-5 text-cyan-300" />
        </div>

        <div className="h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commuteData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

              <XAxis
                dataKey="day"
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "rgba(9, 15, 29, 0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                }}
              />

              <Bar dataKey="km" radius={[14, 14, 0, 0]} fill="#4AA7FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}