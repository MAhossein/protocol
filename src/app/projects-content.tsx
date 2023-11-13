"use client"
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchProjects} from "@/services/project-service";
import {DataTable} from "@/components/ui/data-table/data-table";
import {projectColumns, ProjectWithRelated} from "@/types/project-types";
import {ApiQueryParams, defaultApiQueryParams} from "@/types/request-types";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {PaginationState, SortingState} from "@tanstack/react-table";
import {FilterSelection} from "@/components/ui/ filter-panel";

interface ProjectsContentProps {
    searchTerm?: string;
    projectFilterSelection?: FilterSelection[];
}

export default function ProjectsContent({searchTerm, projectFilterSelection}: ProjectsContentProps) {
    const queryClient = useQueryClient();

    const [queryParams, setQueryParams] = useState({
        ...defaultApiQueryParams,
        filter: searchTerm,
        fieldFilters: projectFilterSelection
    })
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [selectedRowsData, setSelectedRowsData] = useState<ProjectWithRelated[]>();

    const {status, data, error} = useQuery({
        queryKey: ['projects', queryParams],
        queryFn: () => fetchProjects(queryParams),
    })

    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ['projects']})
    }, [queryParams]);

    useEffect(() => {
        setQueryParams({
            ...queryParams,
            filter: searchTerm,
            fieldFilters: projectFilterSelection
        })
    }, [searchTerm, projectFilterSelection]);


    useEffect(() => {
        let seletedData: ProjectWithRelated[] = []
        for (const [key, value] of Object.entries(selectedRows)) {
            if (value) {
                const project = data?.data?.at(key as unknown as number)
                if (project) {
                    seletedData.push(project)
                }
            }
        }
        setSelectedRowsData(seletedData)
    }, [selectedRows]);


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

    function handleRowSelectionChange(newRowSelection: Record<string, boolean>) {

        setSelectedRows(newRowSelection)
    }

    return (
        <div className="container mx-auto py-10">
            <div className="rounded-md border bg-white">
                <div className={"text-xl font-bold p-4"}>Projects</div>

                {(hasData) ?
                    <DataTable title={"Projects"} columns={projectColumns} data={data.data!}
                               enablePagination={true} enableSorting={true} enableRowSelection={true}
                               defaultPagination={{pageSize: data.pageSize, pageIndex: data.page}}
                               pageCount={Math.ceil(data.totalRecords / data.pageSize)}
                               onPaginationChange={(newPagination) => handlePaginationChange(newPagination)}
                               onSortChange={(newSorting) => handleSortingChange(newSorting)}
                               defaultSorting={[{id: data.sortBy, desc: data.sortOrder === "desc"}]}
                               onRowSelectionChange={(newRowSelection) => handleRowSelectionChange(newRowSelection)}
                               defaultRowSelection={selectedRows}
                    />
                    :
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-500">You don&apos;t have any project right now</div>
                        <div className={"py-5 pr-5"}>
                            <Link href='/servicepage'>
                                <Button variant={"primary"} className={"w-44"}><Plus className={"pr-2"}/>Create
                                    now</Button>
                            </Link>
                        </div>
                    </div>}
            </div>
            <ul>
                {selectedRowsData?.map((project) => {
                    return <li key={project.id}>{project.name}</li>
                })}
            </ul>
        </div>
    )


}