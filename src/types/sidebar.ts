import {LucideIcon} from "lucide-react";

export interface SubmenuItems {
    label: string;
    link: string;
    projectDepended: boolean;
}

export interface NavItems {
    label: string;
    icon?: LucideIcon;
    link: string;
    isParent: boolean;
    subMenu?: SubmenuItems[];
}
