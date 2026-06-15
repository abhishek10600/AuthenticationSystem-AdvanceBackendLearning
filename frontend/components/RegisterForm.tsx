"use client";

import { useState } from "react";
import axios from "axios";
import { registerUser } from "@/lib/api";
import { Turnstile } from "@marsidev/react-turnstile";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [captchaToken, setCaptchaToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Please complete the captcha");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await registerUser({
        email,
        password,
        confirmPassword,
        captchaToken,
      });

      alert("Registration successful");

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCaptchaToken("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Registration failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none transition focus:border-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none transition focus:border-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none transition focus:border-white"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSITE_KEY!}
          onSuccess={(token) => {
            setCaptchaToken(token);
          }}
          onExpire={() => {
            setCaptchaToken("");
          }}
          onError={() => {
            setCaptchaToken("");
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
