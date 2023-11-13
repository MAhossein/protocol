import axios, {AxiosResponse} from "axios";
import {CommentsQueryParams, CommentWithRelated} from "@/types/comment-types";
import {Comment, CommentStatus} from "@prisma/client";
import {PaginatedResponse} from "@/types/request-types";


export async function fetchComments(queryParams?: CommentsQueryParams): Promise<PaginatedResponse<CommentWithRelated>> {
    const response = await axios.get<any, AxiosResponse<PaginatedResponse<CommentWithRelated>>>("/api/comment/", {params: queryParams});
    return response.data;
}

export async function fetchComment(id: string): Promise<CommentWithRelated> {
    const response = await axios.get<any, AxiosResponse<CommentWithRelated>>(`/api/comment/${id}`);
    return response.data;
}

export async function fetchReplies(id: string): Promise<CommentWithRelated[]> {
    const response = await axios.get<any, AxiosResponse<CommentWithRelated[]>>(`/api/comment/${id}/replies`);
    return response.data;
}

export async function fetchUnreadCount(queryParams?: CommentsQueryParams): Promise<{ count: number }> {
    const response = await axios.get<any, AxiosResponse<{ count: number }>>(`/api/comment/unread`, {params: queryParams});
    return response.data;
}

export async function createComment({newComment, componentId, page, pagePath, projectId, replyToId}: {
    newComment: string,
    componentId: string | null | undefined,
    page: string | null | undefined,
    pagePath: string | null | undefined,
    projectId: string | null | undefined,
    replyToId: string | null | undefined,
}): Promise<CommentWithRelated> {
    const {data} = await axios.post(`/api/comment`, {
        body: newComment,
        component: componentId,
        page: page,
        pagePath: pagePath,
        projectId: projectId,
        replyToId: replyToId,
    } as Comment);
    return data;
}

export async function updateCommentStatus({commentId, status }: {
    commentId: string,
    status: CommentStatus,
}): Promise<CommentWithRelated> {
    const {data} = await axios.put(`/api/comment/${commentId}/status`, {status: status});
    return data;
}

export async function deleteComment({commentId}: {
    commentId: string
}): Promise<CommentWithRelated> {
    const {data} = await axios.delete(`/api/comment/`, {
        params: {
            id: commentId
        }
    });
    return data;
}