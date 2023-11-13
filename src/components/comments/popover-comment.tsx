"use client"

import {
    ChevronLeft,
    ChevronRight, LucideArrowUpCircle, LucideCheckCircle, LucideXCircle,
    MoreHorizontal,
    User
} from "lucide-react";
import {PopoverClose} from "@/components/ui/popover";
import {defaultApiQueryParams} from "@/types/request-types";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createComment, fetchComments, fetchReplies, updateCommentStatus} from "@/services/comments-service";
import React, {useEffect, useState} from "react";
import {CommentsQueryParams, CommentWithRelated} from "@/types/comment-types";
import {formatDateTime} from "@/utils/utils";
import {Input} from "@/components/ui/input";
import Loading from "@/components/ui/shared/loading";
import Error from "@/components/ui/shared/error";
import {Separator} from "@/components/ui/separator";
import {CommentStatus} from "@prisma/client";


interface PopoverCommentProps {
    pagePath?: string | null;
    componentId?: string | null;
    projectId?: string | null;
    page?: string | null;
    commentId?: string | null;
}

function CommentReplies ({comment, depth}:{ comment: CommentWithRelated, depth: number }) {
    return (
        <div className={"text-right items-center justify-end space-x-4 mb-2 mt-2 " + (depth === 0 ? " ml-2" : depth === 1 ? " ml-3 " : " ml-4")}>
            <div className={"flex text-right justify-end items-center"}>
                <p className="text-gray-900 text-xs font-semibold pr-2">{comment.user?.name}</p>
                <p className="text-xs text-gray-600">{formatDateTime(comment.createdAt)}</p>
                <User className="h-5 w-5 text-gray-400"/>
            </div>
            <p className="text-s mb-4 text-gray-700">{comment.body}</p>
            {comment.replies ? (
            <div>
                {comment.replies?.map((comment) => {
                    return (
                        <CommentReplies key={comment.id} comment={comment} depth={depth + 1}/>
                    )
                })}
            </div>
            ): (<div/>)
            }
        </div>
    )
}

export default function PopoverComment({pagePath, componentId, projectId, page, commentId}: PopoverCommentProps) {


    const [currentIdx, setCurrentIdx] = useState<number>(0);

    const queryClient = useQueryClient();
    const queryParams: CommentsQueryParams = {...defaultApiQueryParams};
    if (commentId != undefined) {
        queryParams.fieldFilters = [{name: 'id', value: commentId}]
    } else {
        queryParams.pagePath = pagePath;
        queryParams.componentId = componentId;
        queryParams.projectId = projectId;
        queryParams.pageId = page;
    }
    const {status, data, error} = useQuery({
        queryKey: ['comments', queryParams],
        queryFn: () => fetchComments(queryParams),
    })


    const [hasComment, setHasComment] = useState<{ previous: boolean, next: boolean }>({
        previous: false,
        next: false,
    });

    const [currentComment, setCurrentComment] = useState<CommentWithRelated | null>(null);
    const [newComment, setNewComment] = useState('');

    const commentReplies = useQuery({
        queryKey: ['comment-replies', currentComment?.id],
        queryFn: () => currentComment ? fetchReplies(currentComment.id) : null,
    })


    useEffect(() => {
        if (data != undefined && (data?.data?.length ?? 0) > 0) {
            if (currentIdx >= 0 && (data.data?.length ?? 0) > 0) {
                setCurrentComment(data!.data![currentIdx]);
            } else {
                setCurrentComment(null);
            }
        }

        setHasComment({
            previous: (data?.data?.length ?? 0) > currentIdx + 1,
            next: currentIdx >= 0,
        })
    }, [data, pagePath, componentId, currentIdx, commentId]);


    function previousComment() {
        if (hasComment.previous) {
            setCurrentIdx((currentIdx) => currentIdx + 1);
        }
    }

    function nextComment() {
        if (hasComment.next) {
            setCurrentIdx((currentIdx) => currentIdx - 1);
        }
    }


    const mutation = useMutation({
        mutationFn: (newComment: string) => createComment({
            newComment: newComment,
            componentId: componentId,
            pagePath: pagePath,
            projectId: projectId,
            page: page,
            replyToId: currentComment?.id,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comments']});
            queryClient.invalidateQueries({queryKey: ['comment-replies', currentComment?.id]});
            setNewComment('');
        },
    });

    const mutationStatus = useMutation({
        mutationFn: (status: CommentStatus) => updateCommentStatus({
            commentId: currentComment!.id,
            status: status,
        }),
        onSuccess: () => {
                    queryClient.invalidateQueries({queryKey: ['comments']});
                    queryClient.invalidateQueries({queryKey: ['comment-replies', currentComment?.id]});
        }
    });

    const handleNewComment = (event: React.FormEvent) => {
        event.preventDefault();
        mutation.mutate(newComment);
    };


    if (status === 'pending') {
        return <Loading/>
    }

    if (status === 'error') {
        return <Error message={error.message ?? ""}/>
    }

    function acceptResponse(event: React.FormEvent) {
        event.preventDefault();
        if (currentComment && currentComment.status !== CommentStatus.closed_approved && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) {
            mutationStatus.mutate(CommentStatus.closed_approved);
        }
    }
    function rejectResponse(event: React.FormEvent) {
        event.preventDefault();
        if (currentComment && currentComment.status !== CommentStatus.closed_denied && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) {
            mutationStatus.mutate(CommentStatus.closed_denied);
        }
    }


    return (
        <div className="bg-white rounded-md max-w-sm max-h-fit">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <ChevronLeft
                        className={"h-5 w-5 " + (hasComment.previous ? "text-gray-400" : "text-gray-200")}
                        onClick={previousComment}/>
                    <ChevronRight
                        className={"h-5 w-5 " + (hasComment.next ? "text-gray-400" : "text-gray-200")}
                        onClick={nextComment}/>
                </div>
                <div className={"flex space-x-2"}>
                    <MoreHorizontal className={"text-gray-400 h-5 w-5 "}/>
                    <button onClick={acceptResponse}>
                    <LucideCheckCircle className={"text-gray-400 h-5 w-5" +
                        ((currentComment?.status === CommentStatus.open && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-400 " :
                            (currentComment?.status === CommentStatus.open && !(commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-200 " :
                                (currentComment?.status === CommentStatus.closed_approved) ? " text-green-400 " : " text-gray-400"
                        )} />
                    </button>
                    <button onClick={rejectResponse}>
                    <LucideXCircle className={"text-gray-400 h-5 w-5" +
                        ((currentComment?.status === CommentStatus.open && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-400 " :
                                (currentComment?.status === CommentStatus.open && !(commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-200 " :
                                    (currentComment?.status === CommentStatus.closed_denied) ? " text-red-400 " : " text-gray-400"
                        )} />
                    </button>
                    <PopoverClose/>
                </div>
            </div>
            <Separator/>
            {
                currentComment ? (
                    <div className="">
                        <div className="flex items-center space-x-4 mb-4 mt-4">
                            <User className="h-10 w-10 text-gray-400"/>
                            <div className={"flex"}>
                                <p className="text-gray-900 text-xs font-semibold pr-2">{currentComment.user?.name}</p>
                                <p className="text-xs text-gray-600">{formatDateTime(currentComment.createdAt)}</p>
                            </div>
                        </div>

                        <p className="mb-4 text-gray-700">{currentComment.body}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                        <p className="text-gray-400">Create a new comment {commentId && ("for '" + componentId + "'")}</p>
                    </div>
                )
            }

            {
                commentReplies ? (
                    <div className={"overflow-y-auto max-h-96"}>
                        {commentReplies.data?.map((comment) => {
                            return (
                                <CommentReplies key={comment.id} comment={comment} depth={0}/>
                            )
                        })}
                    </div>
                    ): (<div/>)
            }
            <Separator/>
            <div className="mt-4">
                <form onSubmit={handleNewComment} className={"flex space-x-2"}>
                    <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        type="text"
                        placeholder="Enter your comment..."
                    />
                    <button type="submit">
                        <LucideArrowUpCircle className="text-gray-400 h-5 w-5"/>
                    </button>
                </form>
            </div>
        </div>
    )
}