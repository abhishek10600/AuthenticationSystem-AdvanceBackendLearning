"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const tokenResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const accessToken = tokenResponse.data.data.accessToken;

        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setUser(userResponse.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex w-full flex-col justify-center items-center min-h-screen">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="text-xl">{`Welcome To The Dashboard ${user.email}`}</p>
    </div>
  );
}
