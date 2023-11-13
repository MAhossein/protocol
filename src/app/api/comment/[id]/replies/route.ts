import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {gatherReplies} from "@/app/api/comment/[id]/route";
import {getUser} from "@/app/api/auth-util";

export async function GET(request: NextRequest,
                          {params}: { params: { id: string } }) {
    const id = params.id;
    const user = await getUser(request);
    if (!user) {
        return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }
    const userId = user.id;
    const comment = await gatherReplies(id);

    const upsertOperations = comment.replies.map((comment) => {
        return prisma.commentRead.upsert({
            where: {
                commentId_userId: {
                    userId: userId,
                    commentId: comment.id
                }
            },
            update: {},
            create: {
                    userId: userId,
                    commentId: comment.id
            }
        });
    });
    upsertOperations.push(prisma.commentRead.upsert({
        where: {
            commentId_userId: {
                userId: userId,
                commentId: id
            }
        },
        update: {},
        create: {
            userId: userId,
            commentId: id
        }
    }));

    await prisma.$transaction(upsertOperations);


    return NextResponse.json(comment.replies);
}