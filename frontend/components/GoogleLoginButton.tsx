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
      className="rounded-md border px-4 py-2 cursor-pointer hover:bg-gray-900"
    >
      Continue with Google
    </button>
  );
}
