import {ApiQueryParams, ReducedUser, toQueryParams as toCommonQueryParams} from "@/types/request-types";
import {Comment, CommentStatus, Project} from "@prisma/client";
import {ColumnDef} from "@tanstack/table-core";
import {DataTableColumnHeader} from "@/components/ui/data-table/data-table-column-header";
import {formatDateTime} from "@/utils/utils";
import {Button} from "@/components/ui/button";
import {ArrowRight, LucideTrash, MessageSquarePlusIcon} from "lucide-react";
import {Popover,  PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import PopoverComment from "@/components/comments/popover-comment";
import React from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteComment} from "@/services/comments-service";
import Link from "next/link";

export interface CommentWithRelated extends Comment {
    user?: ReducedUser;
    project?: Project
    replies?: CommentWithRelated[];
    answeredByAdmin?: boolean;
    repliesCount?: number;
}

export interface CommentsQueryParams extends ApiQueryParams {
    projectId?: string | null;
    pageId?: string | null;
    componentId?: string | null;
    pagePath?: string | null;
}


export function toQueryParams(searchParams: URLSearchParams): CommentsQueryParams {
    return {
        projectId: searchParams.get('projectId') ?? '',
        pageId: searchParams.get('pageId') ?? '',
        pagePath: searchParams.get('pagePath') ?? '',
        componentId: searchParams.get('componentId') ?? '',
        ...toCommonQueryParams(searchParams)
    }
}


function AddComment({rowComment}: { rowComment: CommentWithRelated }) {


    return (
        <Popover>
            <PopoverTrigger>
                {/*<Button variant="ghost" size={"md"} className="h-8 w-8 m-2">*/}
                    <MessageSquarePlusIcon className="h-4 w-4 m-2"/>
                {/*</Button>*/}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverComment componentId={rowComment.component} pagePath={rowComment.pagePath}
                                projectId={rowComment.project?.id} commentId={rowComment.id}/>
            </PopoverContent>
        </Popover>
    );
}

function DeleteComment({rowComment}: { rowComment: CommentWithRelated }) {
    const queryClient = useQueryClient();
    const [error, setError] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState<boolean>(false);
    const mutation = useMutation({
        mutationFn: (commentId: string) => deleteComment({
            commentId: commentId,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comments']});
            queryClient.refetchQueries({queryKey: ['comments']});
            setOpen(false)
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleDelete = (event: React.FormEvent) => {
        event.preventDefault();
        mutation.mutate(rowComment.id);
    };

    const handleCancel = (event: React.FormEvent) => {
        event.preventDefault();
        setOpen(false)
    };


    function onOpenChange(open: boolean) {
        setOpen(open)
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger>
                {/*<Button variant="ghost" size={"md"} className="h-8 w-8 m-2">*/}
                    <LucideTrash className="h-4 w-4 m-2"/>
                {/*</Button>*/}
            </PopoverTrigger>
            <PopoverContent>
                <p>Are you sure you want to delete this comment?</p>
                <div className={"flex space-x-2"}>
                    <Button variant={"destructive"} onClick={handleDelete}>Yes, delete</Button>
                    <Button variant={"primary"} onClick={handleCancel}>Cancel</Button>
                </div>
                {error && <div className={"text-red-500"}>{error}</div>}
            </PopoverContent>
        </Popover>
    );
}

export function commentStatusToString(commentStatus: CommentStatus): string {
    switch (commentStatus) {
        case CommentStatus.open:
            return "Open";
        case CommentStatus.pending_user_reply:
            return "Pending user reply";
        case CommentStatus.closed_approved:
            return "Approved";
        case CommentStatus.closed_denied:
            return "Denied";
        default:
            return "";
    }
}

export const commentColumns: ColumnDef<CommentWithRelated>[] = [
    {
        accessorKey: "project.name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Project"}/>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "user.name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"User"}/>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Creation date"}/>
        ),
        enableSorting: true,
        cell: ({row}) => {
            const date = row.original.createdAt;
            return <span>{formatDateTime(date)}</span>;
        },
    },
    {
        accessorKey: "page",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Page"}/>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "component",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Component"}/>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Status"}/>
        ),
        enableSorting: true,
        cell: ({ row }) => {
            const status = row.original.status;
            let statusStyle = "rounded-full mr-3 pt-1 pb-1 pl-2 pr-2";
            switch (status) {
                case CommentStatus.open:
                    statusStyle += " bg-yellow-200 text-yellow-800";
                    break;
                case CommentStatus.closed_denied:
                    statusStyle += " bg-red-200 text-red-800";
                    break;
                case CommentStatus.closed_approved:
                    statusStyle += "  bg-green-200 text-green-800";
                    break;
                case CommentStatus.pending_user_reply:
                    statusStyle += " bg-blue-200 text-blue-800";
                    break;
                default:
                    statusStyle += " bg-gray-500 text-white";
            }
            return (
                <span className={statusStyle}>{commentStatusToString(status)}</span>
            );
        },
    },
    {
        accessorKey: "body",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Comment"}/>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "repliesCount",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Replies"}/>
        ),
        enableSorting: false,
    },
    {
        accessorKey: "answeredByAdmin",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title={"Answered by admin"}/>
        ),
        enableSorting: false,
    },
    {
        id: "actions",
        cell: ({row}) => {

            return (
                <div className={"flex"}>
                    <AddComment rowComment={row.original}/>
                    <DeleteComment rowComment={row.original}/>
                    {row.original.pagePath && <Link href={row.original.pagePath}>
                        <ArrowRight className={"h-4 w-4 m-2"}/>
                    </Link> }
                </div>
            );
        },
    },
];