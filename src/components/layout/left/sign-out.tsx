"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button
      className="hover:text-stone-500 transition-all w-full text-left"
      onClick={() => signOut()}
    >
      Logout
    </button>
  );
}

