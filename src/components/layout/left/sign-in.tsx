"use client";
import {signIn} from "next-auth/react";

export default function SignIn() {
  return (
    <button
      className="text-stone-400 hover:text-stone-200 transition-all w-full text-left"
      onClick={() => signIn()}
    >
      Sign in!
    </button>
  );
}

