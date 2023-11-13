import prisma from "@/lib/prisma";
import { toQueryParamsUserProjects } from "@/types/request-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const queryParams = toQueryParamsUserProjects(req.nextUrl.searchParams);

  const projectsWithOwner = await prisma.project.findMany({
    where: {
      userId: queryParams.id,
    },
    
        select: {
          id: true,
          name: true,
        },
     
  });

  const projectsWithAccess = await prisma.project.findMany({
    where: {
      ProjectAccess: {
        some: {
          userId: queryParams.id,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return NextResponse.json(projectsWithAccess);
}
