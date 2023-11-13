import { NextRequest, NextResponse } from "next/server";
import {PaginatedResponse, toQueryParams} from "@/types/request-types";
import prisma from "@/lib/prisma";
import {Project} from "@prisma/client";

export async function POST(req: NextRequest) {
  const { createBody } = await req.json();

  try {
    const project = await prisma.project.create({
      data: {
        service: createBody.service,
        name: createBody.projectName,
        description: createBody.projectDescription,
        studyType: createBody.studyType,
        userId: createBody.userId,
        disabled: false,
      },
    });
    console.log(project);
    const projectAccess = await prisma.projectAccess.create({
      data: {
        projectId: `${project.id}`,
        userId: `${createBody.userId}`,
      },
    });
    console.log(projectAccess);
    const res = await fetch(
      `${process.env.TEST_AI_API}/api/v1/riskanalysis/projectscaffold`,
      {
        method: "POST",
        headers: {
          Authorization: `${process.env.AI_AUTHORIZATION}`,
          //Accept: "*/ /**",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: `${createBody.userId}`,
          project_id: `${project.id}`,
        }),
      }
    );
    const response = await res.json();
    if (res.ok) {
      return NextResponse.json(project);
    } else {
      return NextResponse.json(response);
    }
  } catch (e) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  const { updateBody } = await req.json();
  const project = await prisma.project.update({
    where: {
      id: updateBody.projectId,
    },
    data: {
      service: updateBody.service,
      status: updateBody.projectStatus,
      description: updateBody.projectDescription,
      name: updateBody.projectName,
      disabled: updateBody.disabled,
    },
  });
  console.log(project);
  return NextResponse.json(project);
}
export async function GET(req: NextRequest): Promise<NextResponse<PaginatedResponse<Project>>> {
  const queryParams = toQueryParams(req.nextUrl.searchParams);

  const totalRecords = await prisma.project.count({
    where: {
      ...queryParams.filterObject,
      OR: [
        {
          name: {
            contains: queryParams.filter,
            mode: "insensitive",
          },
        },
        {
          user: {
            is: {
              name: {
                contains: queryParams.filter,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
  });

  const pageToUse = queryParams.page!;
  const pageSizeToUse = queryParams.pageSize!;
  const sortBy = queryParams.sortBy!;
  const sortOrder = queryParams.sortOrder!;

  const projects = await prisma.project.findMany({
    where: {
      ...queryParams.filterObject,
      OR: [
        {
          name: {
            contains: queryParams.filter,
            mode: "insensitive",
          },
        },
        {
          user: {
            is: {
              name: {
                contains: queryParams.filter,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { [sortBy]: sortOrder },
    skip: pageToUse * pageSizeToUse,
    take: pageSizeToUse,
  });

  return NextResponse.json({
    totalRecords,
    page: pageToUse,
    pageSize: pageSizeToUse,
    sortBy,
    sortOrder,
    data: projects
  });
}