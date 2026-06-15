"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthForm = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6 flex rounded-lg bg-zinc-900 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            mode === "login"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            mode === "register"
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Register
        </button>
      </div>

      <div>{mode === "login" ? <LoginForm /> : <RegisterForm />}</div>
    </div>
  );
};

export default AuthForm;
