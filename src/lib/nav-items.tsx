import { NavItems } from "@/types/sidebar";
import { LayoutDashboard } from "lucide-react";

const menus: NavItems[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/",
    isParent: false,
  },
  {
    label: "Explorer",
    isParent: true,
    link: "/explorer",
    subMenu: [
      {
        label: "Data scope",
        link: "/explorer/${projectId}/data-scope",
        projectDepended: true,
      },
      {
        label: "Tracking data",
        link: "/explorer/${projectId}/tracking-data",
        projectDepended: true,
      },
      {
        label: "Primary outcome",
        link: "/explorer/${projectId}/primary-outcome",
        projectDepended: true,
      },
    ],
  },
  {
    label: "Admin",
    isParent: true,
    link: "/admin",
    subMenu: [
      {
        label: "Organisations",
        link: "/admin/organisations",
        projectDepended: true,
      },
      {
        label: "Users",
        link: "/admin/users",
        projectDepended: true,
      },
      {
        label: "Projects",
        link: "/admin/projects",
        projectDepended: true,
      },
      {
        label: "Comments",
        link: "/admin/comments",
        projectDepended: true,
      }
    ],
  },
];

export default menus;
