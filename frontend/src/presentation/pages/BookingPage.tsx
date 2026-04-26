import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  StationService,
  type Station,
} from "../../application/services/StationService";
import AppLayout from "../components/common/AppLayout";

const stationService = new StationService();

type ChargerType = "STANDARD_AC" | "FAST_DC" | "ULTRA_FAST";

const chargerRates: Record<ChargerType, number> = {
  STANDARD_AC: 90,
  FAST_DC: 140,
  ULTRA_FAST: 220,
};

export default function BookingPage() {
  const { stationId } = useParams<{ stationId: string }>();

  const [station, setStation] = useState<Station | null>(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [chargerType, setChargerType] = useState<ChargerType>("FAST_DC");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pricing = useMemo(() => {
    const hours = Number(duration);
    const rate = chargerRates[chargerType];

    const energyFee = Number.isNaN(hours) ? 0 : hours * rate;
    const platformFee = 20;
    const tax = Math.round(energyFee * 0.18);
    const total = energyFee + platformFee + tax;

    return {
      rate,
      energyFee,
      platformFee,
      tax,
      total,
    };
  }, [duration, chargerType]);

  useEffect(() => {
    const fetchStation = async () => {
      if (!stationId) {
        setError("Station ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await stationService.getStationById(stationId);
        setStation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load station.");
      } finally {
        setLoading(false);
      }
    };

    void fetchStation();
  }, [stationId]);

  return (
    <AppLayout>
      {loading ? (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-slate-400 backdrop-blur-xl">
          Loading booking page...
        </div>
      ) : error || !station ? (
        <div className="rounded-[32px] border border-red-400/20 bg-red-400/10 p-6 text-red-300">
          {error || "Station not found."}
        </div>
      ) : (
        <BookingView
          station={station}
          stationId={stationId || ""}
          date={date}
          setDate={setDate}
          startTime={startTime}
          setStartTime={setStartTime}
          duration={duration}
          setDuration={setDuration}
          chargerType={chargerType}
          setChargerType={setChargerType}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          pricing={pricing}
        />
      )}
    </AppLayout>
  );
}

function BookingView({
  station,
  stationId,
  date,
  setDate,
  startTime,
  setStartTime,
  duration,
  setDuration,
  chargerType,
  setChargerType,
  paymentMode,
  setPaymentMode,
  pricing,
}: {
  station: Station;
  stationId: string;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  duration: string;
  setDuration: React.Dispatch<React.SetStateAction<string>>;
  chargerType: ChargerType;
  setChargerType: React.Dispatch<React.SetStateAction<ChargerType>>;
  paymentMode: string;
  setPaymentMode: React.Dispatch<React.SetStateAction<string>>;
  pricing: {
    rate: number;
    energyFee: number;
    platformFee: number;
    tax: number;
    total: number;
  };
}) {
  const stationName = station.name || station.stationName || "Unnamed Station";

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to={`/stations/${stationId}`}
        className="mb-6 inline-flex text-sm text-cyan-300 transition hover:text-cyan-200"
      >
        ← Back to station
      </Link>

      <div className="mb-8">
        <p className="text-sm font-medium text-cyan-300">Electrify Booking</p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Reserve Charging Slot
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Configure your charging session, review pricing, and prepare your
          booking.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">Station Details</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBox label="Station" value={stationName} />
              <InfoBox label="Status" value={station.status || "ACTIVE"} />
              <InfoBox label="Address" value={station.address || "N/A"} />
              <InfoBox
                label="Coordinates"
                value={`${station.latitude ?? "N/A"}, ${
                  station.longitude ?? "N/A"
                }`}
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">
              Charging Session
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <OptionCard
                title="Standard AC"
                subtitle="Best for overnight charging"
                active={chargerType === "STANDARD_AC"}
                onClick={() => setChargerType("STANDARD_AC")}
              />

              <OptionCard
                title="Fast DC"
                subtitle="Balanced speed and price"
                active={chargerType === "FAST_DC"}
                onClick={() => setChargerType("FAST_DC")}
              />

              <OptionCard
                title="Ultra Fast"
                subtitle="Maximum speed charging"
                active={chargerType === "ULTRA_FAST"}
                onClick={() => setChargerType("ULTRA_FAST")}
              />
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Booking Date
                </label>

                <GlassInput
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Start Time
                </label>

                <GlassInput
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Duration
                </label>

                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/40"
                >
                  <option value="0.5">30 minutes</option>
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white">Payment Mode</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {["UPI", "CARD", "CASH"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    paymentMode === mode
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <p className="font-semibold">{mode}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {mode === "UPI"
                      ? "Fast digital payment"
                      : mode === "CARD"
                        ? "Credit / debit card"
                        : "Pay at station"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">Price Summary</h2>

          <div className="mt-6 space-y-4">
            <SummaryRow label="Station" value={stationName} />
            <SummaryRow label="Charger" value={formatChargerType(chargerType)} />
            <SummaryRow label="Date" value={date || "Not selected"} />
            <SummaryRow label="Start Time" value={startTime || "Not selected"} />
            <SummaryRow label="Duration" value={`${duration} hour(s)`} />
            <SummaryRow label="Rate" value={`₹${pricing.rate}/hour`} />
            <SummaryRow label="Energy Fee" value={`₹${pricing.energyFee}`} />
            <SummaryRow label="Platform Fee" value={`₹${pricing.platformFee}`} />
            <SummaryRow label="Tax" value={`₹${pricing.tax}`} />
          </div>

          <div className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-6">
            <p className="text-sm text-emerald-300">Estimated Total</p>

            <p className="mt-2 text-4xl font-semibold text-white">
              ₹{pricing.total}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Final billing may change once machine and payment APIs are added.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-200">
            Booking backend API is not available yet. This flow is ready for
            integration.
          </div>

          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-2xl bg-gradient-to-r from-cyan-400/40 to-emerald-300/40 px-5 py-4 font-semibold text-slate-300"
          >
            Confirm Booking Coming Soon
          </button>
        </aside>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function OptionCard({
  title,
  subtitle,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        active
          ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
      }`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}

type GlassInputProps = React.InputHTMLAttributes<HTMLInputElement>;

function GlassInput(props: GlassInputProps) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
    />
  );
}

function formatChargerType(type: ChargerType) {
  if (type === "STANDARD_AC") return "Standard AC";
  if (type === "FAST_DC") return "Fast DC";
  return "Ultra Fast";
}