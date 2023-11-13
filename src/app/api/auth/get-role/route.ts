import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return null;
  }
  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });
  return NextResponse.json(user?.role);
}
