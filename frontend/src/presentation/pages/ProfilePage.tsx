import { useState } from "react";
import {
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthService } from "../../application/services/AuthService";
import AppLayout from "../components/common/AppLayout";

const authService = new AuthService();

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
          <Icon className="h-4 w-4" />
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
      </div>

      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10"
    />
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const displayFirstName = user?.firstName || "User";
  const displayLastName = user?.lastName || "";
  const initials = (
    (user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")
  ).toUpperCase();

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");

    try {
      const updatedUser = await authService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      });

      setUser(updatedUser);
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Profile update failed",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPasswordLoading(true);
    setPasswordMessage("");
    setPasswordError("");

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("Please fill all password fields.");
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("New password and confirm password do not match.");
        return;
      }

      if (currentPassword === newPassword) {
        setPasswordError(
          "New password must be different from current password.",
        );
        return;
      }

      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password changed successfully.");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Password change failed",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-300">
            Electrify Account
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Profile & Settings
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Update your account details and secure your Electrify access.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex flex-col items-center rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,199,255,0.18),_transparent_60%)] px-6 py-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-400 to-emerald-300 text-2xl font-bold text-slate-950">
                  {initials}
                </div>

                <h3 className="mt-4 text-xl font-semibold text-white">
                  {displayFirstName} {displayLastName}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Electrify User
                </p>
              </div>

              <div className="grid gap-4">
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={user?.email || "Not available"}
                />

                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={user?.phoneNumber || "Not available"}
                />

                <InfoCard
                  icon={MapPin}
                  label="Address"
                  value={user?.address || "Not available"}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/90">
                    Edit Profile
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Update Account Details
                  </h2>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <User className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                  />

                  <InputField
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                  />
                </div>

                <InputField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                  />

                  <InputField
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                  />
                </div>

                {profileError && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {profileError}
                  </div>
                )}

                {profileMessage && (
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                    {profileMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex items-center justify-center">
                    <Save className="mr-2 h-4 w-4" />
                    {profileLoading ? "Saving..." : "Save Profile"}
                  </span>
                </button>
              </form>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/90">
                    Security
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Change Password
                  </h2>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <LockKeyhole className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <InputField
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                />

                <InputField
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                />

                <InputField
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                />

                {passwordError && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {passwordError}
                  </div>
                )}

                {passwordMessage && (
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                    {passwordMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="h-12 w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/10 font-semibold text-cyan-200 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex items-center justify-center">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {passwordLoading ? "Updating..." : "Change Password"}
                  </span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}