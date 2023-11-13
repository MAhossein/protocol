import prisma from "@/lib/prisma";
import { toQueryParamsOrganisationProjects } from "@/types/request-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const queryParams = toQueryParamsOrganisationProjects(req.nextUrl.searchParams);
  const organisation = await prisma.organisation.findFirst({
    where: {
      users: {
        some: {
          id: queryParams.organisationId,
        },
      },
    },
  });
  const projects = await prisma.projectAccess.findMany({
    where: {
      user: {
        organisationId: organisation?.id,
      },
    },
    select: {
      project: {
        select: {
          createdAt: true,
          description: true,
          disabled: true,
          id: true,
          name: true,
          service: true,
          status: true,
          studyType: true,
          updatedAt: true,
          userId: true,
          
        },
      },
    },
  });
  
  const flattenedProjects = projects.map((e) => e.project);
  return NextResponse.json(flattenedProjects);
}
