"use client"
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {DataTable} from "@/components/ui/data-table/data-table";
import {defaultApiQueryParams} from "@/types/request-types";
import React, {useEffect, useState} from "react";
import {fetchComments} from "@/services/comments-service";
import {commentColumns, CommentsQueryParams} from "@/types/comment-types";
import {PaginationState, SortingState} from "@tanstack/react-table";

interface CommentsContentProps {
    searchTerm?: string;
}

export default function CommentsContent({searchTerm}: CommentsContentProps) {
    const queryClient = useQueryClient();


    const [queryParams, setQueryParams] = useState({
        ...defaultApiQueryParams,
        filter: searchTerm,
    })

    const {status, data, error} = useQuery({
        queryKey: ['comments', queryParams],
        queryFn: () => fetchComments(queryParams),
        staleTime: 0,
    })

    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ['comments']})
    }, [queryParams]);

    useEffect(() => {
        setQueryParams({
            ...queryParams,
            filter: searchTerm,
        })
    }, [searchTerm]);



    if (status === 'pending') {
        return <span>Loading...</span>
    }

    if (status === 'error') {
        return <span>Error: {error.message}</span>
    }

    const hasData = (data?.data?.length ?? 0) > 0

    function handlePaginationChange(newPagination: PaginationState) {
        setQueryParams({...queryParams, page: newPagination.pageIndex, pageSize: newPagination.pageSize})
    }

    function handleSortingChange(newSorting: SortingState) {
        if (newSorting.length === 0) {
            setQueryParams({...queryParams, sortBy: undefined, sortOrder: undefined})
        } else {
            setQueryParams({...queryParams, sortBy: newSorting[0].id, sortOrder: newSorting[0].desc ? "desc" : "asc"})
        }
    }

    return (
        <div className="w-full mx-auto py-10 px-10">
            <div className="rounded-md bg-white">
                {(hasData) ?
                    <DataTable title={"Comments"} columns={commentColumns} data={data?.data ?? []} enableSorting={true} enablePagination={true}
                               defaultPagination={{pageSize: data.pageSize, pageIndex: data.page}}
                               pageCount={Math.ceil(data.totalRecords / data.pageSize)}
                               onPaginationChange={(newPagination) => handlePaginationChange(newPagination)}
                               onSortChange={(newSorting) => handleSortingChange(newSorting)}
                               defaultSorting={[{id: data.sortBy, desc: data.sortOrder === "desc"}]}
                    />
                    :
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-500">You don&apos;t have any comments right now</div>
                    </div>}
            </div>
        </div>
    )


}