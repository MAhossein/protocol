import prisma from "@/lib/prisma";
import { UpdateUserByIdBody } from "@/types/admin-types";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";
import { json } from "stream/consumers";
import{toQueryParamsOrganisationUsers} from "@/types/request-types";

export async function GET(req: NextRequest) {
  const queryParams = toQueryParamsOrganisationUsers(req.nextUrl.searchParams);

  const organisationusers = await prisma.user.findMany({
    where: {
      organisationId: queryParams.organisationId,
    },
  
        select: {
          id: true,
          name: true,
          organisationId: true,
          email: true,
          createdAt: true,
        },
      
    
  });
  return NextResponse.json(organisationusers);

}

// export async function GET() {
//   const users = await prisma.user.findMany({
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       createdAt: true,
//       active: true,
//       organisation: {
//         select: {
//           organisationName: true,
//         },
//       },
//     },
//   });
  
//   return NextResponse.json(users);
// }

export async function POST(req: Request) {
  const { userName, userEmail, password, role, organisationName } =
    await req.json();
  try {
    const organisation = await prisma.organisation.findFirst({
      where: {
        organisationName: organisationName,
      },
      select: {
        id: true,
      },
    });
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: {
        name: userName,
        email: userEmail,
        password: await hash(`${password}`, 10),
        role: role,
        organisationId: organisation?.id,
      },
    });
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      { message: "Create organisation failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { userId } = await req.json();
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: `${userId}`,
      },
    });
    return NextResponse.json(deletedUser, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { updateBody } = await req.json();

  const user = await prisma.user.update({
    where: {
      id: updateBody.id,
    },
    data: {
      name: updateBody.name,
      email: updateBody.email,
      role: updateBody.role,
      active: updateBody.active,
    },
    select: {
      id: true,
      name: true,
    },
  });
  console.log(user);
  return NextResponse.json(user);
}
