import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ResponseUserById } from "@/types/ admin-types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      active: true,
    },
  });
  return NextResponse.json(user);
}
