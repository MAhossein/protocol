"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProjects, updateProject } from "@/services/project-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Dropdownmenu from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiQueryParamsUserProjects } from "@/types/request-types";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";
import { getUserById, updateUser } from "@/services/users-service";
import { ResponseUserById, Roles } from "@/types/admin-types";
import { formatDateTime } from "@/utils/utils";
import { ProjectStatus } from "@prisma/client";
import { ProjectUpdate } from "@/types/project-types";

interface ProjectsContentProps {
  searchTerm?: string;
}

export default function ProjectsContent({ searchTerm }: ProjectsContentProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [userInformations, setUserInformations] = useState<ResponseUserById>({
    name: "",
    id: "",
    role: "",
    email: "",
    active: false,
  });
  const [withOrga, setWithOrga] = useState<boolean>(false);
  const pathnames = pathname.split("/");
  const [password, setPassword] = useState<string>("");
  const id = pathnames.slice(-1)[0];
  const queryParams: ApiQueryParamsUserProjects = {
    id: id,
  };
  const { status, data, error } = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => fetchUserProjects(queryParams),
  });

  const mutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: () => updateUser(userInformations),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userById"] });
    },
  });
  const statusMutation = useMutation({
    mutationKey: ["updateStatus"],
    mutationFn: (updateBody: ProjectUpdate) => updateProject(updateBody),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
  const {
    status: userStatus,
    data: userData,
    error: userError,
  } = useQuery({
    queryKey: ["userById", id],
    queryFn: () => getUserById(id),
  });
  useEffect(() => {
    if (userData) {
      setUserInformations(userData);
    }
  }, [userData]);
  const handleUpdateUser = () => {
    const confirmed = window.confirm(
      "Are you sure you want to modify this user?"
    );
    confirmed && mutation.mutate();
  };
  const handleUpdateStatus = (updateBody: ProjectUpdate) => {
    statusMutation.mutate(updateBody);
  };
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
    <div className="container mx-auto py-10 flex flex-col gap-5">
      <div className="rounded-md border w-full">
        <h1 className="text-xl font-bold p-4">User informations</h1>
        {userStatus == "pending" && <span>Loading..</span>}
        {userStatus === "success" && userData ? (
          <div className="flex flex-row items-baseline pr-4 justify-evenly">
            <div className="flex flex-col p-4 gap-2">
              <label className="pl-1">User name</label>
              <input
                value={userInformations?.name}
                className="border rounded-md pl-1 h-12"
                placeholder="project name"
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    name: e.target.value,
                  } as ResponseUserById)
                }
              />
            </div>
            <div className="flex flex-col p-4 gap-2">
              <label className="pl-1">Email</label>
              <input
                value={userInformations?.email}
                type="email"
                className="border rounded-md pl-1 h-12"
                placeholder="email"
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    email: e.target.value,
                  } as ResponseUserById)
                }
              />
            </div>
            <div className="flex flex-col p-4 gap-2">
              <label className="pl-1">Reset Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="border rounded-md pl-1 h-12"
                placeholder="password"
              />
            </div>
            <div className="flex flex-col p-4 gap-2">
              <label className="pl-1">User role</label>
              <Select
                onValueChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    role: e,
                  } as ResponseUserById)
                }
                value={userInformations.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  {Roles?.map((item, i) => {
                    return (
                      <SelectItem key={i} value={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col p-4 gap-2">
              <label className="pl-1">User status</label>
              <Select
                onValueChange={(e) => {
                  if (e == "Activated") {
                    setUserInformations({
                      ...userInformations,
                      active: true,
                    } as ResponseUserById);
                  } else {
                    setUserInformations({
                      ...userInformations,
                      active: false,
                    } as ResponseUserById);
                  }
                }}
                value={userInformations.active ? "Activated" : "Deactivated"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activated">Activated</SelectItem>
                  <SelectItem value="Deactivated">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => handleUpdateUser()}
              variant={"primary"}
              className={"w-20 self-end mb-4"}
            >
              Apply
            </Button>
          </div>
        ) : (
          <span>No data available</span>
        )}
      </div>
      <Button className=" bg-primary-2 ml-10 w-64">Add project access</Button>

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
                            <TableCell>
                              <Dropdownmenu.Root>
                                <Dropdownmenu.Trigger
                                  className={`flex flex-row items-center rounded-full mr-3 py-1 px-2 ${
                                    project.status == ProjectStatus.commented
                                      ? "bg-red-200 text-red-800"
                                      : project.status ==
                                        ProjectStatus.in_progress
                                      ? "bg-blue-200 text-blue-800"
                                      : project.status ==
                                        ProjectStatus.reviewing
                                      ? "bg-yellow-200 text-yellow-800"
                                      : "bg-green-200 text-green-800"
                                  }`}
                                >
                                  {project.status}
                                  <ChevronDown />
                                </Dropdownmenu.Trigger>
                                <Dropdownmenu.Portal>
                                  <Dropdownmenu.Content className="bg-white z-10 border rounded-md p-2 flex flex-col">
                                    <Dropdownmenu.Item
                                      onClick={() =>
                                        handleUpdateStatus({
                                          projectId: project.id,
                                          service: project.service,
                                          projectStatus:
                                            ProjectStatus.commented,
                                          projectDescription:
                                            project.description,
                                          projectName: project.name,
                                          disabled: project.disabled,
                                        })
                                      }
                                      className="hover:cursor-pointer hover:bg-gray-200 p-2"
                                    >
                                      {ProjectStatus.commented}
                                    </Dropdownmenu.Item>
                                    <Dropdownmenu.Item
                                      onClick={() =>
                                        handleUpdateStatus({
                                          projectId: project.id,
                                          service: project.service,
                                          projectStatus:
                                            ProjectStatus.validated,
                                          projectDescription:
                                            project.description,
                                          projectName: project.name,
                                          disabled: project.disabled,
                                        })
                                      }
                                      className="hover:cursor-pointer hover:bg-gray-200 p-2"
                                    >
                                      {ProjectStatus.validated}
                                    </Dropdownmenu.Item>
                                    <Dropdownmenu.Item
                                      onClick={() =>
                                        handleUpdateStatus({
                                          projectId: project.id,
                                          service: project.service,
                                          projectStatus:
                                            ProjectStatus.in_progress,
                                          projectDescription:
                                            project.description,
                                          projectName: project.name,
                                          disabled: project.disabled,
                                        })
                                      }
                                      className="hover:cursor-pointer hover:bg-gray-200 p-2"
                                    >
                                      {ProjectStatus.in_progress}
                                    </Dropdownmenu.Item>
                                    <Dropdownmenu.Item
                                      onClick={() =>
                                        handleUpdateStatus({
                                          projectId: project.id,
                                          service: project.service,
                                          projectStatus:
                                            ProjectStatus.reviewing,
                                          projectDescription:
                                            project.description,
                                          projectName: project.name,
                                          disabled: project.disabled,
                                        })
                                      }
                                      className="hover:cursor-pointer hover:bg-gray-200 p-2"
                                    >
                                      {ProjectStatus.reviewing}
                                    </Dropdownmenu.Item>
                                  </Dropdownmenu.Content>
                                </Dropdownmenu.Portal>
                              </Dropdownmenu.Root>
                            </TableCell>
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
      </div>
    </div>
  );
}
