import { ColumnDef } from "@tanstack/table-core";
import { formatDateTime } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Copy, Folder, Share, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { useContext } from "react";
import { ProjectContext } from "@/context/project-context";
import { useRouter } from "next/navigation";
import { Project, ProjectStatus } from "@prisma/client";
import { ReducedUser } from "@/types/request-types";
import {Checkbox} from "@/components/ui/checkbox";
import {FilterDefinition} from "@/components/ui/filter-panel";
import { fetchProjectServices, fetchProjectUsers} from "@/services/project-service";

export interface ProjectCreation {
  userId: string;
  service: string;
  projectName: string;
  projectDescription: string;
  studyType: "Interventional" | "Observational" | "";
}

export interface ProjectUpdate {
  projectId: string;
  service: string;
  projectStatus: ProjectStatus;
  projectDescription: string;
  projectName: string;
  disabled: boolean;
}

export interface ProjectWithRelated extends Project {
  user?: ReducedUser;
  
}


export function projectStatusToString(projectStatus: ProjectStatus): string {
  switch (projectStatus) {
    case ProjectStatus.validated:
      return "Validated";
    case ProjectStatus.reviewing:
      return "Reviewing";
    case ProjectStatus.in_progress:
      return "In Progress";
    case ProjectStatus.commented:
      return "Commented";
    default:
      return "";
  }
}

function OpenProject({ rowProject }: { rowProject: Project }) {
  const { setProject } = useContext(ProjectContext);
  const router = useRouter();

  function handleOpenProject() {
    if (rowProject != undefined && setProject) {
      setProject(rowProject);
      router.push("/explorer/" + rowProject.id + "/data-scope/");
    }
  }

  return (
    <Button
      variant="ghost"
      size={"md"}
      className="h-8 w-8 m-2"
      onClick={handleOpenProject}
    >
      <Folder className="h-4 w-4" />
    </Button>
  );
}

export const projectFilterDefinitions = [
  {
    name: "Service",
    accessorKey: "service",
    type: "select",
    getFilterValues: () => fetchProjectServices()
  },
  {
    name: "Owner",
    accessorKey: "userId",
    type: "select",
    getFilterValues: () => fetchProjectUsers()
  }

] as FilterDefinition[];
export const projectColumns: ColumnDef<ProjectWithRelated>[] = [
  {
    id: "select",
    header: ({ table }) => (
        <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
        />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Project name"} />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Owner"} />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Creation date"} />
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <span>{formatDateTime(date)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Status"} />
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      let statusSyle = "rounded-full mr-3 pt-1 pb-1 pl-2 pr-2";
      switch (status) {
        case ProjectStatus.validated:
          statusSyle += " bg-green-200 text-green-800";
          break;
        case ProjectStatus.reviewing:
          statusSyle += " bg-yellow-200 text-yellow-800";
          break;
        case ProjectStatus.in_progress:
          statusSyle += " bg-blue-200 text-blue-800";
          break;
        case ProjectStatus.commented:
          statusSyle += " bg-red-200 text-red-800";
          break;
        default:
          statusSyle += " bg-gray-500 text-white";
      }
      return (
        <span className={statusSyle}>{projectStatusToString(status)}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className={"flex"}>
          <Button variant="ghost" size={"md"} className="h-8 w-8 m-2">
            <Share className="h-4 w-4" />
          </Button>
          <OpenProject rowProject={row.original} />
          <Button variant="ghost" size={"md"} className="h-8 w-8 m-2">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size={"md"} className="h-8 w-8 m-2">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];


export const projectColumnsRelevanceScore: ColumnDef<ProjectWithRelated>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Title"} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "condition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Condition"} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "intervention",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Intervention"} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"URL"} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Relevance Score"} />
    ),
    enableSorting: false,
    // let this here so maybe it can be used to change columns bg color when low and text too
    // cell: ({ row }) => {
    //   const status = row.original.status;
    //   let statusSyle = "rounded-full mr-3 p-1";
    //   switch (status) {
    //     case ProjectStatus.validated:
    //       statusSyle += " bg-green-200 text-green-800";
    //       break;
    //     case ProjectStatus.reviewing:
    //       statusSyle += " bg-yellow-200 text-yellow-800";
    //       break;
    //     case ProjectStatus.in_progress:
    //       statusSyle += " bg-blue-200 text-blue-800";
    //       break;
    //     case ProjectStatus.commented:
    //       statusSyle += " bg-red-200 text-red-800";
    //       break;
    //     default:
    //       statusSyle += " bg-gray-500 text-white";
    //   }
    //   return (
    //     <span className={statusSyle}>{projectStatusToString(status)}</span>
    //   );
    // },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <div className={"flex"}>
  //         <Button variant="ghost" size={"md"} className="h-8 w-8 m-2">
  //           <Share className="h-4 w-4" />
  //         </Button>
  //         <OpenProject rowProject={row.original} />
  //         <Button variant="ghost" size={"md"} className="h-8 w-8 m-2">
  //           <Copy className="h-4 w-4" />
  //         </Button>
  //         <Button variant="ghost" size={"md"} className="h-8 w-8 m-2">
  //           <Trash2 className="h-4 w-4" />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];