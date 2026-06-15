import AuthForm from "@/components/AuthForm";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Auth App</h1>
            <p className="mt-2 text-sm text-zinc-400">Sign in to continue</p>
          </div>

          <GoogleLoginButton />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <AuthForm />
        </div>
      </div>
    </main>
  );
}
