import { useState } from "react";
import { StationRequestService } from "../../application/services/StationRequestService";
import AppLayout from "../components/common/AppLayout";

const stationRequestService = new StationRequestService();

type WorkingDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export default function ApplyStationPage() {
  const [formData, setFormData] = useState({
    station_name: "",
    address: "",
    latitude: "",
    longitude: "",
    helpline_number: "",
    opensAt: "",
    closesAt: "",
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [workingDays, setWorkingDays] = useState<WorkingDays>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayToggle = (day: keyof WorkingDays) => {
    setWorkingDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setDocuments(Array.from(e.target.files));
  };

  const validateForm = () => {
    if (
      !formData.station_name.trim() ||
      !formData.address.trim() ||
      !formData.latitude.trim() ||
      !formData.longitude.trim() ||
      !formData.helpline_number.trim() ||
      !formData.opensAt.trim() ||
      !formData.closesAt.trim()
    ) {
      return "All fields are required.";
    }

    if (!/^\d{10}$/.test(formData.helpline_number)) {
      return "Helpline number must be exactly 10 digits.";
    }

    if (documents.length === 0) {
      return "Please upload at least one document.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await stationRequestService.createRequest({
        station_name: formData.station_name,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        helpline_number: formData.helpline_number,
        opensAt: formData.opensAt,
        closesAt: formData.closesAt,
        working_days: workingDays,
        documents,
      });

      setMessage("Station request submitted successfully.");

      setFormData({
        station_name: "",
        address: "",
        latitude: "",
        longitude: "",
        helpline_number: "",
        opensAt: "",
        closesAt: "",
      });

      setDocuments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-cyan-300">
              Electrify Station Owner
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
              Apply for Station Access
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Submit your charging station details for approval and become part
              of the Electrify network.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <GlassInput
              name="station_name"
              placeholder="Station Name"
              value={formData.station_name}
              onChange={handleChange}
            />

            <GlassInput
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <GlassInput
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
              />

              <GlassInput
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>

            <GlassInput
              name="helpline_number"
              placeholder="Helpline Number"
              value={formData.helpline_number}
              onChange={handleChange}
              maxLength={10}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Opens At
                </label>

                <GlassInput
                  type="time"
                  name="opensAt"
                  value={formData.opensAt}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Closes At
                </label>

                <GlassInput
                  type="time"
                  name="closesAt"
                  value={formData.closesAt}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-white">
                Working Days
              </p>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {Object.keys(workingDays).map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm capitalize text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={workingDays[day as keyof WorkingDays]}
                      onChange={() =>
                        handleDayToggle(day as keyof WorkingDays)
                      }
                      className="accent-cyan-400"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm text-slate-400">
                Upload Documents
              </label>

              <input
                type="file"
                multiple
                onChange={handleFiles}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-medium file:text-slate-950"
              />

              {documents.length > 0 && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-2 text-sm font-medium text-white">
                    Selected Files
                  </p>

                  <ul className="space-y-1 text-sm text-slate-400">
                    {documents.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-5 py-4 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
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