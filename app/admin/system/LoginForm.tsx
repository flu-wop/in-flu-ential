"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mx-auto mt-32 w-full max-w-sm space-y-4 px-6">
      <h1 className="text-2xl uppercase tracking-widest">Admin</h1>
      <input
        type="password"
        name="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Password"
        className="w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-3 text-cream outline-none focus:border-neutral-400"
      />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        disabled={pending}
        className="w-full rounded bg-neutral-100 text-neutral-900 px-4 py-3 text-sm font-semibold uppercase tracking-widest disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
