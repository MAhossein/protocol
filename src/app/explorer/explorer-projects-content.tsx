"use client"
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchProjects} from "@/services/project-service";
import {DataTable} from "@/components/ui/data-table/data-table";
import {projectColumns} from "@/types/project-types";
import {ApiQueryParams, defaultApiQueryParams} from "@/types/request-types";
import {Button} from "@/components/ui/button";
import {ArrowRight, Copy, Plus, Share, Trash2} from "lucide-react";
import React, {useState} from "react";
import {ProjectStatus} from "@prisma/client";
import Link from "next/link";

interface ProjectsContentProps {
    searchTerm?: string;
}

export default function ExplorerProjectsContent({searchTerm}: ProjectsContentProps) {


    const [queryParams, setQueryParams] = useState({
        ...defaultApiQueryParams,
        filter: searchTerm,
        fieldFilters: [{name: "status", value: ProjectStatus.validated}]
    })

    const {status, data, error} = useQuery({
        queryKey: ['projects', queryParams],
        queryFn: () => fetchProjects(queryParams),
    })


    if (status === 'pending') {
        return <span>Loading...</span>
    }

    if (status === 'error') {
        return <span>Error: {error.message}</span>
    }

    const hasData = (data?.data?.length ?? 0) > 0

    function getColumns() {
        let filter = projectColumns.filter((column) => column.id !== "actions");

        filter.push(
            {
                id: "actions",
                cell: ({row}) => {
                    return (
                        <div className={"flex"}>
                            <Link href={"/explorer/" + row.original.id + "/data-scope/"}>
                                <Button variant="ghost" size={"md"} className="h-8 w-8 m-2">
                                    <ArrowRight className="h-4 w-4"/>
                                </Button>
                            </Link>
                        </div>
                    );
                },
            },
        );
        return filter;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="rounded-md border bg-white">
                <div className={"text-xl font-bold p-4"}>Validated Projects</div>

                {(hasData) ?
                    <DataTable title={"Projects"} columns={getColumns()} data={data.data!}/>
                    :
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-500">You don&apos;t have any Validated projects right now</div>
                        <div className={"py-5 pr-5"}>
                            <Button variant={"primary"} className={"w-44"}><Plus className={"pr-2"}/>Create now</Button>
                        </div>
                    </div>}
            </div>
        </div>
    )


}