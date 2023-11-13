"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import getQueryClient from "@/utils/getQueryClient";
import CommentProvider from "@/context/comment-context";
import ProjectProvider from "@/context/project-context";
import { NextAuthProvider } from "@/lib/nextAuthProvider";

function Providers({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <NextAuthProvider>
        <CommentProvider>
          <ProjectProvider>{children}</ProjectProvider>
        </CommentProvider>
      </NextAuthProvider>
    </QueryClientProvider>
  )
}

export default Providers;