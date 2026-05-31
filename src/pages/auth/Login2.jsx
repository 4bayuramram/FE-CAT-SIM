import { useState } from "react";
import {
ShieldCheck,
Mail,
Lock,
Eye,
EyeOff,
Check,
} from "lucide-react";

export default function Login2() {
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [remember, setRemember] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();

```
setLoading(true);

setTimeout(() => {
  alert("Login successful! Redirecting to dashboard...");
  setLoading(false);
}, 2000);
```

};

return ( <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#12345B] to-slate-900 text-slate-100 overflow-hidden relative">
{/* Ambient Glow */} <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#12345B]/30 blur-[120px]" />

```
  <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#FCD401]/10 blur-[100px]" />

  {/* Header */}
  <header className="fixed top-0 left-0 z-50 w-full px-6 py-5">
    <div className="flex items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCD401]/10 border border-[#FCD401]/20 backdrop-blur-xl">
        <ShieldCheck className="h-7 w-7 text-[#FCD401]" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
        CAT Exam Engine
      </h1>
    </div>
  </header>

  {/* Main */}
  <main className="relative flex min-h-screen items-center justify-center px-6 py-24">
    <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_40px_100px_rgba(30,27,75,0.5)] p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white">
          <span className="text-[#FCD401]">CAT</span> Exam Engine
        </h2>

        <p className="text-sm text-slate-300">
          Masuk untuk melanjutkan sesi ujian
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="block px-1 text-sm font-medium text-slate-300">
            Email Address
          </label>

          <div className="group relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#FCD401]" />

            <input
              type="email"
              required
              placeholder="name@institution.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all focus:border-[#FCD401] focus:ring-2 focus:ring-[#FCD401]/20"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block px-1 text-sm font-medium text-slate-300">
            Password
          </label>

          <div className="group relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#FCD401]" />

            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none transition-all focus:border-[#FCD401] focus:ring-2 focus:ring-[#FCD401]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center justify-between py-1">
          <label className="group flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setRemember(!remember)}
              className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                remember
                  ? "border-[#FCD401] bg-[#FCD401]"
                  : "border-slate-600 bg-slate-800"
              }`}
            >
              {remember && (
                <Check className="h-3.5 w-3.5 text-slate-950" />
              )}
            </div>

            <span className="text-sm text-slate-300 transition-colors group-hover:text-white">
              Remember me
            </span>
          </label>

          <button
            type="button"
            className="text-sm text-[#FCD401] transition-colors hover:text-yellow-300"
          >
            Lupa Password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#FCD401] to-yellow-500 py-4 font-bold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(252,212,1,0.3)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-80"
        >
          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-slate-950"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>

              <span>Loading...</span>
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Support */}
      <div className="mt-8 border-t border-white/10 pt-6 text-center">
        <p className="text-sm text-slate-400">
          Kendala teknis?{" "}
          <button className="font-semibold text-white transition-colors hover:text-[#FCD401]">
            Bantuan
          </button>
        </p>
      </div>
    </div>
  </main>

  {/* Footer */}
  <footer className="fixed bottom-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-3 px-6 py-5 md:flex-row">
    <p className="text-sm text-slate-500">
      © 2024 CAT Exam Engine. Precision in Assessment.
    </p>

    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
      <button className="transition-colors hover:text-[#FCD401]">
        Privacy Policy
      </button>

      <button className="transition-colors hover:text-[#FCD401]">
        Terms of Service
      </button>

      <button className="transition-colors hover:text-[#FCD401]">
        Technical Support
      </button>
    </div>
  </footer>
</div>

);
}
