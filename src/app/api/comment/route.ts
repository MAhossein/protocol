import {NextRequest, NextResponse} from "next/server";

import {CommentWithRelated, toQueryParams} from "@/types/comment-types";
import {Comment, CommentStatus, Prisma, Role} from "@prisma/client";
import {getUser} from "@/app/api/auth-util";
import prisma from "@/lib/prisma";
import {PaginatedResponse} from "@/types/request-types";

export async function GET(req: NextRequest) {

    const queryParams = toQueryParams(req.nextUrl.searchParams);

    let filters: Prisma.CommentWhereInput = {
        replyToId: null,
    };

    if (queryParams.projectId) {
        filters.projectId = queryParams.projectId;
    }
    if (queryParams.pageId) {
        filters.page = queryParams.pageId;
    }
    if (queryParams.pagePath) {
        filters.pagePath = queryParams.pagePath;
    }
    if (queryParams.componentId) {
        filters.component = queryParams.componentId;
    }
    if (queryParams.filter) {
        filters.body = {
            contains: queryParams.filter,
            mode: 'insensitive',
        }
    }
    if (queryParams.filterObject) {
        filters = {...queryParams.filterObject, ...filters}
    }


    const totalRecords = await prisma.comment.count({
        where: filters,
    });

    const pageToUse = queryParams.page!;
    const pageSizeToUse = queryParams.pageSize!;
    const sortBy = queryParams.sortBy!;
    const sortOrder = queryParams.sortOrder!;

    let comments = await prisma?.comment.findMany({
        where: filters,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                }
            },
            project: true,
            replies: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                        }
                    },
                }
            }
        },
        orderBy: {[sortBy]: sortOrder},
        skip: pageToUse * pageSizeToUse,
        take: pageSizeToUse,
    });

    const commentsWithRelated = comments.map((comment) => {
        let commentWithRelated = comment as CommentWithRelated;
        commentWithRelated.repliesCount = comment.replies.length;
        commentWithRelated.answeredByAdmin = false;
        if (comment.replies && comment.replies.length > 0) {
            let lastReply = comment.replies[comment.replies.length - 1];
            if (lastReply) {
                commentWithRelated.answeredByAdmin = (lastReply.user?.role ?? null) === Role.ADMIN
            } else {
                commentWithRelated.answeredByAdmin = false;
            }
            commentWithRelated.repliesCount = comment.replies.length;
        } else {
            commentWithRelated.repliesCount = 0;
            commentWithRelated.answeredByAdmin = false;
        }
        delete commentWithRelated.replies;
        return commentWithRelated;
    });

    return NextResponse.json({
        totalRecords,
        page: pageToUse,
        pageSize: pageSizeToUse,
        sortBy,
        sortOrder,
        data: commentsWithRelated
    } as PaginatedResponse<CommentWithRelated>);
}

export async function POST(req: NextRequest) {
    const user = await getUser(req);
    if (!user) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }
    let newComment = await req.json() as Comment;

    newComment.userId = user.id;
    newComment.createdAt = new Date();

    const comment = await prisma?.comment.create({
        data: newComment,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                }
            },
            project: true,
        },
    });

    if (comment.replyToId) {
        await prisma?.comment.update({
            where: {
                id: comment.replyToId
            },
            data: {
                status: user.role === Role.ADMIN ? CommentStatus.pending_user_reply : CommentStatus.open
            }
        })
    }


    return NextResponse.json(comment, {status: 201});
}

export async function DELETE(req: NextRequest) {
    const user = await getUser(req);
    if (!user) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }
    const commentId = req.nextUrl.searchParams.get('id');

    if (!commentId) {
        return NextResponse.json({error: "Missing comment id"}, {status: 400});
    }
    const comment = await prisma?.comment.delete({
        where: {
            id: commentId
        }
    });

    return NextResponse.json(comment, {status: 200});
}