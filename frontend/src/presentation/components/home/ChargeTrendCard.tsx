import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const trendData = [
  { time: "12:00", charge: 18 },
  { time: "12:30", charge: 48 },
  { time: "01:00", charge: 61 },
  { time: "01:30", charge: 95 },
];

export default function ChargeTrendCard() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Charge Trend</h2>
            <p className="text-sm text-slate-400">
              Real-time battery growth during charging
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            Today
          </div>
        </div>

        <div className="h-[260px] 2xl:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="time"
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
                  color: "white",
                }}
              />

              <Line
                type="monotone"
                dataKey="charge"
                stroke="#22C7FF"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "#7FE5A0",
                  stroke: "#0B1220",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}