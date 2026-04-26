import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../application/services/AuthService";
import { useAuth } from "../context/AuthContext";
import { signupSchema } from "../validation/authSchemas";
import logo from "../../assets/electrify-logo.png";
import authBg from "../../assets/auth-bg.png";

const authService = new AuthService();

type SignupErrors = Partial<
  Record<
    "firstName" | "email" | "phoneNumber" | "password" | "govt_id" | "form",
    string
  >
>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<SignupErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState("Upload Identity Proof");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const govtIdFile = formData.get("govt_id");

    const values = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      phoneNumber: String(formData.get("phoneNumber") || ""),
      address: String(formData.get("address") || ""),
      password: String(formData.get("password") || ""),
      govt_id:
        govtIdFile instanceof File && govtIdFile.size > 0
          ? govtIdFile
          : undefined,
    };

    const parsed = signupSchema.safeParse(values);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        firstName: errors.firstName?.[0],
        email: errors.email?.[0],
        phoneNumber: errors.phoneNumber?.[0],
        password: errors.password?.[0],
        govt_id: errors.govt_id?.[0],
      });
      setSubmitting(false);
      return;
    }

    try {
      const user = await authService.register(formData);
      setUser(user);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBg})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-slate-950/55" />

      <div className="relative z-10 flex h-full w-full flex-col lg:flex-row">
        <section className="flex min-h-[42vh] flex-1 flex-col justify-between px-5 py-5 sm:px-8 sm:py-7 lg:min-h-0 lg:px-10 lg:py-8">
          <div className="w-full">
            <img
              src={logo}
              alt="Electrify"
              className="w-60 object-contain sm:w-72 lg:w-80 xl:w-[340px]"
            />
          </div>
        </section>

        <section className="flex min-h-0 w-full items-center justify-center px-2 sm:px-6 lg:w-[42%] lg:min-w-[430px] lg:px-8">
          <div className="h-[85%] w-[80%] max-w-[520px] rounded-2xl border border-white/10 bg-white/2 px-4 py-4 shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <h2 className="mb-3 ml-8 text-3xl font-extrabold leading-tight tracking-tight text-white">
              Create an Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="relative">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="text-sm h-10 w-full rounded-xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-sm text-red-300">{fieldErrors.firstName}</p>
                )}
              </div>

              <div className="relative">
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="text-sm h-10 w-full rounded-xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="text-sm h-10 w-full rounded-xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-300">{fieldErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="text-sm h-10 w-full rounded-xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
                {fieldErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-300">{fieldErrors.phoneNumber}</p>
                )}
              </div>

              <div className="relative">
                <input
                  name="address"
                  placeholder="Address"
                  className="text-sm h-10 w-full rounded-xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="relative">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="text-sm h-10 w-full rounded-xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-300">{fieldErrors.password}</p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-500/40 bg-slate-950/70 px-4 text-sm text-slate-400 hover:border-blue-400/60 hover:text-slate-200">
                  {fileName}
                  <input
                    name="govt_id"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFileName(file ? file.name : "Upload Identity Proof");
                    }}
                  />
                </label>
                {fieldErrors.govt_id && (
                  <p className="mt-1 text-sm text-red-300">{fieldErrors.govt_id}</p>
                )}
              </div>

              {error ? (
                <div className="text-sm rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="text-sm h-10 w-full rounded-xl bg-slate-950 text-base font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}