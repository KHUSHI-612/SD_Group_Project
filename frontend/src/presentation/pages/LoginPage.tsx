import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../application/services/AuthService";
import { useAuth } from "../context/AuthContext";
import logo from "../../assets/electrify-logo.png";
import authBg from "../../assets/auth-bg.png";

const authService = new AuthService();

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || !password.trim()) {
      setError("Please enter your email or phone number and password.");
      return;
    }

    setSubmitting(true);

    try {
      const isEmail = trimmedIdentifier.includes("@");

      const user = await authService.login({
        email: isEmail ? trimmedIdentifier : undefined,
        phoneNumber: isEmail ? undefined : trimmedIdentifier,
        password,
      });

      setUser(user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/35 to-slate-950/55" />

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
          <div className="h-auto w-[80%] max-w-[520px] rounded-2xl border border-white/10 bg-white/5 px-4 py-6 shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <h2 className="mb-2 text-lg font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Log In
            </h2>

            <p className="mb-5 text-sm text-slate-300">
              Enter your email or phone number to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="relative">
                <input
                  name="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Phone Number"
                  required
                  autoComplete="username"
                  className="h-11 w-full rounded-2xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="relative">
                <input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-2xl border border-slate-400/15 bg-slate-950/95 px-4 text-white outline-none placeholder:text-slate-400 focus:border-blue-400/70 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="h-11 w-full rounded-2xl bg-slate-950 text-base font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing In..." : "Log In"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-300">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Sign up
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}