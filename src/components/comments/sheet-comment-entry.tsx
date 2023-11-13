"use client"
import {LucideArrowUpCircle, LucideCheckCircle, LucideUser, LucideXCircle, User} from "lucide-react";
import {CommentWithRelated} from "@/types/comment-types";
import {formatDateTime} from "@/utils/utils";
import {Separator} from "@/components/ui/separator";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createComment, fetchReplies, updateCommentStatus} from "@/services/comments-service";
import React, {useEffect, useState} from "react";
import {CommentStatus} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";


interface SheetCommentEntryProps {
    comment: CommentWithRelated;
}

function CommentReplies ({comment, depth}:{ comment: CommentWithRelated, depth: number }) {
    return (
        <div className={"text-right items-center justify-end space-x-4 mb-2 mt-2 " + (depth === 0 ? " ml-2" : depth === 1 ? " ml-3 " : " ml-4")}>
            <div className={"flex text-right justify-end items-center"}>
                <div className={"flex flex-col justify-between text-xs"}>
                    <span>{comment.user?.name}</span>
                    <span className={"text-gray-400"}>{formatDateTime(comment.createdAt)}</span>
                </div>
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

export default function SheetCommentEntry({comment}: SheetCommentEntryProps) {
    const queryClient = useQueryClient();

    const commentReplies = useQuery({
        queryKey: ['comment-replies', comment.id],
        queryFn: () => fetchReplies(comment.id),
    })

    const [replyEnabled, setReplyEnabled] = useState<boolean>(false)
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ['comment-unread']})
    }, [commentReplies]);

    const mutationReply = useMutation({
        mutationFn: (newComment: string) => createComment({
            newComment: newComment,
            componentId: comment.component,
            pagePath: comment.pagePath,
            projectId: comment.projectId,
            page: comment.page,
            replyToId: comment?.id,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comments']});
            queryClient.invalidateQueries({queryKey: ['comment-replies', comment?.id]});
            setNewComment('');
        },
    });
    const mutationStatus = useMutation({
        mutationFn: (status: CommentStatus) => updateCommentStatus({
            commentId: comment.id,
            status: status,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comments']});
            queryClient.invalidateQueries({queryKey: ['comment-replies', comment.id]});
        }
    });
    function acceptResponse(event: React.FormEvent) {
        event.preventDefault();
        if (comment && comment.status !== CommentStatus.closed_approved && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) {
            mutationStatus.mutate(CommentStatus.closed_approved);
        }
    }
    function rejectResponse(event: React.FormEvent) {
        event.preventDefault();
        if (comment && comment.status !== CommentStatus.closed_denied && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) {
            mutationStatus.mutate(CommentStatus.closed_denied);
        }
    }

    function handleReplyLink() {
        setReplyEnabled(true)
    }

    const handleReplyComment = (event: React.FormEvent) => {
        event.preventDefault();
        mutationReply.mutate(newComment);
    };


    return (
        <div className={"flex flex-col grow space-y-2 mb-2"}>
            <div className={"flex justify-between"}>
                <LucideUser/>
                <div className={"flex"}>
                    <button onClick={acceptResponse}>
                        <LucideCheckCircle className={"text-gray-400 h-5 w-5" +
                            ((comment.status === CommentStatus.open && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-400 " :
                                    (comment.status === CommentStatus.open && !(commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-200 " :
                                        (comment.status === CommentStatus.closed_approved) ? " text-green-400 " : " text-gray-400"
                            )} />
                    </button>
                    <button onClick={rejectResponse}>
                        <LucideXCircle className={"text-gray-400 h-5 w-5" +
                            ((comment.status === CommentStatus.open && (commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-400 " :
                                    (comment.status === CommentStatus.open && !(commentReplies && commentReplies.data && commentReplies.data.length > 0)) ? " text-gray-200 " :
                                        (comment.status === CommentStatus.closed_denied) ? " text-red-400 " : " text-gray-400"
                            )} />
                    </button>

                </div>
            </div>
            <div className={"flex justify-between text-sm"}>
                <span>{comment.user?.name}</span>
                <span className={"text-gray-400"}>{formatDateTime(comment.createdAt)}</span>
            </div>
            <div className={"flex justify-between text-gray-400 text-xs"}>
                <span>#{comment.component}</span>
            </div>

            <div>
                {comment.body}
            </div>
            {
                commentReplies ? (
                    <div>
                        {commentReplies.data?.map((comment) => {
                            return (
                                <CommentReplies key={comment.id} comment={comment} depth={0}/>
                            )
                        })}
                    </div>
                ): (<div/>)
            }
            {!replyEnabled && <div className={"flex text-right items-center justify-end"}><Button variant={"link"} onClick={handleReplyLink}>Reply</Button></div>}
            {replyEnabled && (
                <div className="mt-4">
                    <form onSubmit={handleReplyComment} className={"flex space-x-2"}>
                        <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            type="text"
                            placeholder="Enter your reply..."
                        />
                        <button type="submit">
                            <LucideArrowUpCircle className="text-gray-400 h-5 w-5"/>
                        </button>
                    </form>
                </div>
            )}
            <Separator />
        </div>
    )
}