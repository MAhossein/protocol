import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {Comment} from "@prisma/client";

export async function GET(request: NextRequest,
                          { params }: { params: { id: string } }) {
    const id = params.id;

    const comment = await gatherReplies(id);
    return NextResponse.json(comment);
}


export async function gatherReplies(commentId: string) {
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }, include: {
            replies: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                }
            },
            project: true,
        },
    }) as Comment & { replies: Comment[] };

    if (!comment.replies) {
        return comment;
    }

    const repliesWithNestedReplies =  [];
    for (let reply of comment.replies) {
        const fullReply = await gatherReplies(reply.id);
        repliesWithNestedReplies.push(fullReply);
    }
    comment.replies = repliesWithNestedReplies;
    return comment;
}