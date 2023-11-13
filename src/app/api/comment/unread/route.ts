import {NextRequest, NextResponse} from "next/server";

import {toQueryParams} from "@/types/comment-types";
import {Prisma} from "@prisma/client";
import {getUser} from "@/app/api/auth-util";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const user = await getUser(req);
    if (!user) {
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    const queryParams = toQueryParams(req.nextUrl.searchParams);
    let filters: Prisma.CommentWhereInput = {

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


    let where = {...filters,
        AND: {
            CommentRead: {
                none: {
                    userId: user.id
                }
            }
        }};
    let unreadComments = await prisma?.comment.findMany({
        where: where,
    });


    return NextResponse.json({
        data: unreadComments,
        count: unreadComments.length,
    });
}
