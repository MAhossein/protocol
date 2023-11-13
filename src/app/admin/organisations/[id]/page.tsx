"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, fetchOrganisationProjects, updateProject } from "@/services/project-service";
import { DataTable } from "@/components/ui/data-table/data-table";
import { projectColumns } from "@/types/project-types";
import {
  ApiQueryParams,
  ApiQueryParamsOrganisationProjects,
  ApiQueryParamsOrganisationUsers,
  defaultApiQueryParams,
} from "@/types/request-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Dropdownmenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";
import { fetchOrganisationUsers, updateUser } from "@/services/users-service";
import { ResponseOrganisationById,Organisation } from "@/types/admin-types";
import { formatDateTime } from "@/utils/utils";
import { ProjectStatus, User } from "@prisma/client";
import { ProjectUpdate } from "@/types/project-types";


interface ProjectsContentProps {
  searchTerm?: string;
}

export default function ProjectsContent({ searchTerm }: ProjectsContentProps) {
  const pathname = usePathname();
  
  
  const pathnames = pathname.split("/");
  const id = pathnames.slice(-1)[0];
  const queryParams: ApiQueryParamsOrganisationProjects = {
    organisationId: id,
  };
  const { status, data, error } = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => fetchOrganisationProjects(queryParams),
  });
  

  
  
    const userPathname = usePathname();
   
    const userPathnames = userPathname.split("/");
    const organisationId = userPathnames.slice(-1)[0];
    const userQueryParams: ApiQueryParamsOrganisationUsers = {
      organisationId: organisationId,
    };
   
    const { status: usersStatus, data:userData, error: usersError } = useQuery({
      queryKey: ["organizationUsers", userQueryParams],
      queryFn: () => fetchOrganisationUsers(userQueryParams),
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
      <><div className="rounded-md border bg-white">
        <div className={"text-xl font-bold p-4"}>
                        Organisation User
                      </div>
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created Date</TableHead>
                {/* Add more header fields here if necessary */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData
                ?.sort((a, b) => {
                  const nameA = a.name.toLocaleLowerCase();
                  const nameB = b.name.toLocaleLowerCase();
                  return nameA.localeCompare(nameB);
                })
                .map((user: User) => {
                  return (
                    <TableRow key={user.organisationId}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                                  {formatDateTime(user.createdAt)}
                                </TableCell>
                      {/* Add more fields here if necessary */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <div className="rounded-md border bg-white">
            {hasData ? (
              <Accordion.Root className="AccordionRoot" type="single" collapsible>
                <Accordion.Item className="AccordionItem" value="item-1">
                  <Accordion.Trigger>
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className={"text-xl font-bold p-4"}>
                        Projects accessed
                      </div>
                      <ChevronDown />
                    </div>

                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Table className="mt-5">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Project Owner</TableHead>
                          <TableHead>Creation Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data
                          ?.sort((a, b) => {
                            const nameA = a.name.toLocaleLowerCase();
                            const nameB = b.name.toLocaleLowerCase();
                            return nameA.localeCompare(nameB);
                          })
                          
                          .map((project) => {
                            return (
                              <TableRow key={project.id}>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.user?.name}</TableCell>
                                <TableCell>
                                  {formatDateTime(project.createdAt)}
                                </TableCell>
                                
                                      {project.status}
                                     
                                      
                               
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
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
          </div></>
        
      );
    }

