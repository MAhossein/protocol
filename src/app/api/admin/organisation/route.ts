import prisma from "@/lib/prisma";
import { OrganisationCreating } from "@/types/admin-types";
import { NextResponse } from "next/server";

export async function GET() {
  const organisations = await prisma.organisation.findMany({
    select: {
      id: true,
      organisationEmail: true,
      organisationName: true,
      createdAt: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
  return NextResponse.json(organisations);
}

export async function POST(req: Request) {
  const { organisationName, organisationEmail }: OrganisationCreating =
    await req.json();
  try {
    const organisation = await prisma.organisation.upsert({
      where: { organisationEmail: organisationEmail },
      update: {},
      create: {
        organisationEmail: organisationEmail,
        organisationName: organisationName,
      },
    });
    return NextResponse.json(organisation);
  } catch (e) {
    return NextResponse.json(
      { message: "Create organisation failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { organisationId } = await req.json();
  try {
    const deletedUser = await prisma.user.deleteMany({
      where: {
        organisationId: `${organisationId}`,
      },
    });
    console.log(deletedUser);
    const deletedOrga = await prisma.organisation.delete({
      where: {
        id: `${organisationId}`,
      },
    });
    return NextResponse.json(deletedOrga, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "failed to delete" }, { status: 500 });
  }
}
export async function getUsersByOrganisation(organisationId: any) {
  const users = await prisma.user.findMany({
    where: {
      organisationId: organisationId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      // Add other fields you need
    },
  });
  return users;
}
