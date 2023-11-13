import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {Comment, CommentStatus} from "@prisma/client";
import {gatherReplies} from "@/app/api/comment/[id]/route";

export async function PUT(request: NextRequest,
                          { params }: { params: { id: string } }) {
    const id = params.id;

    let comment = await prisma.comment.findUnique({
        where: {
            id: id
        }
    });

    if (!comment) {
        return NextResponse.json("Comment not found", {status: 404});
    }
    const newStatus = await request.json() as {status: CommentStatus};
    comment = await prisma.comment.update({
        where: {
            id: id
        },
        data: {
            status: newStatus.status
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                }
            },
            project: true,
        }
    });


    return NextResponse.json(comment);
}