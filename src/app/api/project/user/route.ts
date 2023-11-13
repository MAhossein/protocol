import {NextRequest, NextResponse} from "next/server";
import {IdName} from "@/types/request-types";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse<IdName[]>> {
    const distinctUserIds = await prisma.project.findMany({
        select: {
            userId: true,
        },
        distinct: ['userId']
    });
    const userIds = distinctUserIds.map(project => project.userId).filter((userId) => userId !== null) as string[];

    const users = await prisma.user.findMany({
        where: { id: { in: userIds }}
    });

    return NextResponse.json(users.map((user) => {
        return {id: user.id, name: user.name} as IdName
    }));
}