import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest,
                            { params }: { params: { id: string } }) {
    const id = params.id;

    const project = await prisma.project.findUnique({
        where: {
            id: id
        }
    })
    return NextResponse.json(project);
}