"use client"
import React, {useContext} from "react";
import { defaultApiQueryParams} from "@/types/request-types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchComments} from "@/services/comments-service";
import SheetCommentEntry from "@/components/comments/sheet-comment-entry";
import {CommentsQueryParams} from "@/types/comment-types";
import {ProjectContext} from "@/context/project-context";
import { usePathname } from 'next/navigation';


interface SheetCommentContentListProps {
    searchTerm: string;
}

export default function SheetCommentContentList({ searchTerm }: SheetCommentContentListProps) {

    const {project} = useContext(ProjectContext);
    const queryParams : CommentsQueryParams =  {...defaultApiQueryParams};
    queryParams.pagePath = usePathname();
    queryParams.projectId = project?.id ?? '';

    if (searchTerm != undefined) {
        queryParams.filter = searchTerm;
    }
    const { status, data, error } = useQuery({
        queryKey: ['comments', queryParams],
        queryFn: () => fetchComments(queryParams),
    })

    if (status === 'pending') {
        return <span>Loading...</span>
    }

    if (status === 'error') {
        return <span>Error: {error.message}</span>
    }

    const hasData = (data?.data?.length ?? 0) > 0

    return (
        <div className={"flex flex-col gap-3 mt-2"}>
            <div className={"grow"}>
                {hasData ? data?.data?.map((comment) =>
                    <SheetCommentEntry key={comment.id} comment={comment} />
                ) : <div className={"text-gray-500"}>No comments</div>}
            </div>
        </div>
    )
}