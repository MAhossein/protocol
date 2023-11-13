"use client";

import { ProjectStatus } from "@prisma/client";

interface StatusData {
  name: string;
  count: number;
  color: string;
}
interface status {
  validated: number;
  inProgress: number;
  commented: number;
  reviewing: number;
}
import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusCard from "@/components/ui/statusCard";
// TODO apis?? clean them through service
export default function AdminDashboard() {
  const [usersNumber, setUsersNumber] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [orgaNumber, setOrgaNumber] = useState<number>(0);
  const [projectNumber, setProjectNumber] = useState<number>(0);
  const [projectStatus, setProjectStatus] = useState<StatusData[]>([
    { name: "", color: "", count: 0 },
  ]);
  const [userStatus, setUserStatus] = useState<StatusData[]>([
    { name: "", color: "", count: 0 },
  ]);
  const [status, setStatus] = useState<status>({
    validated: 0,
    inProgress: 0,
    commented: 0,
    reviewing: 0,
  });
  useEffect(() => {
    const getNumbers = async () => {
      const resUsers = await fetch("/api/admin/user", { method: "GET" });
      const users = await resUsers.json();
      setActiveUsers(users.filter((e: { active: boolean }) => e.active).length);
      setUsersNumber(users.length);
      const resOrga = await fetch("/api/admin/organisation", { method: "GET" });
      const orga = await resOrga.json();
      setOrgaNumber(orga.length);
      const resProject = await fetch("/api/project/", { method: "GET" });
      const projects = await resProject.json();
      setProjectNumber(projects.length);
      const validated = projects.filter(
        (project: { status: ProjectStatus }) =>
          project.status == ProjectStatus.validated
      ).length;
      const inProgress = projects.filter(
        (project: { status: ProjectStatus }) =>
          project.status == ProjectStatus.in_progress
      ).length;
      const commented = projects.filter(
        (project: { status: ProjectStatus }) =>
          project.status == ProjectStatus.commented
      ).length;
      const reviewing = projects.filter(
        (project: { status: ProjectStatus }) =>
          project.status == ProjectStatus.reviewing
      ).length;
      setStatus({ validated, inProgress, commented, reviewing });
      setProjectStatus([
        { name: "Validated", count: validated, color: "#0F7E3E" },
        { name: "In Progress", count: inProgress, color: "#1570EF" },
        { name: "Commented", count: commented, color: "#EB0000" },
        { name: "Reviewing", count: reviewing, color: "#DC6803" },
      ]);
      setUserStatus([
        { name: "Active", count: activeUsers, color: "#0F7E3E" },
        {
          name: "Inactive",
          count: usersNumber - activeUsers,
          color: "#EB0000",
        },
      ]);
    };
    getNumbers();
  }, [usersNumber]);
  return (
    <div className="h-full flex flex-col justify-center pt-24 px-20">
      <div className="grid grid-cols-3 gap-4">
        <div className={"col-span-1"}>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="pl-4">
                Total number of organisations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold pl-4">{orgaNumber}</div>
            </CardContent>
          </Card>
        </div>
        <div className={"col-span-1"}>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="pl-4">Total number of users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold pl-4">{usersNumber}</div>
              <StatusCard
                totalProjects={usersNumber}
                statusData={userStatus}
                itemName="Users"
              />
              {/*<Legend*/}
              {/*  categories={["Active Users", "Inactive Users"]}*/}
              {/*  colors={["green", "red"]}*/}
              {/*  className="mt-3"*/}
              {/*></Legend>*/}
            </CardContent>
          </Card>
        </div>
        <div className={"col-span-1"}>
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="pl-4">Total number of projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold pl-4">{projectNumber}</div>
              <StatusCard
                totalProjects={projectNumber}
                statusData={projectStatus}
                itemName="Projects"
              />
              {/*<Legend*/}
              {/*  categories={[*/}
              {/*    "Validated",*/}
              {/*    "Reviewing",*/}
              {/*    "In Progress",*/}
              {/*    "Commented",*/}
              {/*  ]}*/}
              {/*  colors={["green", "yellow", "blue", "red"]}*/}
              {/*  className="mt-3"*/}
              {/*></Legend>*/}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
