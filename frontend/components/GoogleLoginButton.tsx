"use client";

import { getOAuthGoogleUrl } from "@/lib/api";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      const url = await getOAuthGoogleUrl();

      const googleUrl = url;

      window.location.href = googleUrl;
    } catch (error) {
      console.error(error);

      alert("Failed to start Google login");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium transition hover:bg-zinc-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.263 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      Continue with Google
    </button>
  );
}
