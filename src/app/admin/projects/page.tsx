"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProjects } from "@/services/project-service";
import { DataTable } from "@/components/ui/data-table/data-table";
import { projectColumns } from "@/types/project-types";
import { ApiQueryParams, defaultApiQueryParams } from "@/types/request-types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import Link from "next/link";

interface ProjectsContentProps {
  searchTerm?: string;
}

export default function ProjectsContent({ searchTerm }: ProjectsContentProps) {
  const queryParams: ApiQueryParams = defaultApiQueryParams;
  if (searchTerm != undefined) {
    queryParams.filter = searchTerm;
  }
  const { status, data, error } = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => fetchProjects(queryParams),
  });

  /*
        //when creating a new project
      const mutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
      })

     */

  if (status === "pending") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  const hasData = data?.length > 0;
  return (
    <div className="container mx-auto py-10">
      <div className="rounded-md border bg-white">
        <div className={"text-xl font-bold p-4"}>Projects</div>

        {hasData ? (
          <DataTable title={"Projects"} columns={projectColumns} data={data} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-gray-500">
              You don&apos;t have any project right now
            </div>
            <div className={"py-5 pr-5"}>
              <Link href="/servicepage">
                <Button variant={"primary"} className={"w-44"}>
                  <Plus className={"pr-2"} />
                  Create now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
