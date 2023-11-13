import {NextRequest, NextResponse} from "next/server";
import {IdName} from "@/types/request-types";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse<IdName[]>> {
    const distinctServices = await prisma.project.findMany({
        select: {
            service: true
        },
        distinct: ['service']
    });

    return NextResponse.json(distinctServices.map((projectService) => {
        return {id: projectService.service, name: projectService.service} as IdName
    }));
}