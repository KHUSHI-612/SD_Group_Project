export type VehicleItem = {
  name: string;
  model: string;
  battery: number;
  range: number;
  capacity: number;
};

export default function VehicleMiniCard({
  item,
  index,
}: {
  item: VehicleItem;
  index: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
      <div className="mb-3 flex h-20 items-center justify-center rounded-2xl border border-cyan-400/10 bg-[radial-gradient(circle_at_top,_rgba(34,199,255,0.18),_transparent_60%)]">
        <div
          className={`h-8 w-20 rounded-full border border-white/10 bg-gradient-to-r ${
            index % 2 === 0
              ? "from-cyan-300 via-slate-100 to-cyan-500"
              : "from-slate-400 via-slate-200 to-slate-600"
          }`}
        />
      </div>

      <p className="text-sm font-semibold text-white">{item.name}</p>
      <p className="text-xs text-slate-400">{item.model}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
        <div>
          <p>Battery</p>
          <p className="mt-1 text-sm font-semibold text-white">{item.battery}%</p>
        </div>

        <div>
          <p>Range</p>
          <p className="mt-1 text-sm font-semibold text-white">{item.range} km</p>
        </div>

        <div>
          <p>Capacity</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {item.capacity} kWh
          </p>
        </div>
      </div>
    </div>
  );
}