"use client";

import {cn} from "@/utils/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {Tally1} from "lucide-react";
import Image from "next/image";
import menus from "@/lib/nav-items";
import {usePathname} from "next/navigation";
import {ProjectContext} from "@/context/project-context";
import {useContext, useEffect, useState} from "react";

export function NavSidebar() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>();
    const {project} = useContext(ProjectContext);

    const [accordionExpandedItem, setAccordionExpandedItem] = useState<
        string | null
    >(null);

    useEffect(() => {
        const getRole = async () => {
            const res = await fetch("/api/auth/get-role", {method: "GET"});
            const roleJs = await res.json();
            setRole(roleJs);
        };
        getRole();
        menus.forEach((menu, menuIndex) => {
            if (menu.isParent && menu.subMenu) {
                menu.subMenu.forEach((subItem) => {
                    let link = subItem.link;
                    if (subItem.projectDepended && project != undefined && project.id != undefined) {
                        link = subItem.link.replace("${projectId}", project.id);
                    }
                    if (pathname === link) {
                        setAccordionExpandedItem(menu.link);
                    }
                });
            }
        });
    }, [pathname]);
    return (
        <div className={cn("hidden lg:block")}>
            <div className="h-full">
                <div className="">
                    <Image
                        src={"/logo.png"}
                        alt={"logo"}
                        width={194}
                        height={40}
                        priority={true}
                        placeholder={"empty"}
                    />
                    <ScrollArea className="mt-2 h-full flex flex-col justify-between">
                        <div className="space-y-1">
                            {menus?.map((menu, i) => {
                                if (menu.label == "Admin" && role != "ADMIN") {
                                    return;
                                }
                                const Icon = menu.icon;
                                if (menu.isParent) {
                                    return (
                                        <Accordion
                                            key={`${menu}-${i}`}
                                            defaultValue={accordionExpandedItem ?? ""}
                                            type="single"
                                            collapsible
                                            className="w-full"
                                        >
                                            <AccordionItem value={menu.link} className="border-b-0">
                                                <Link href={menu.link} passHref={true}>
                                                    <AccordionTrigger
                                                        className={buttonVariants({
                                                            size: "sm",
                                                            variant: "ghost",
                                                            align: "flexBetween",
                                                            className: "hover:no-underline" +
                                                                (pathname === menu.link
                                                                    ? " text-text-primary bg-selected font-extrabold"
                                                                    : ""),
                                                        })}
                                                    >
                                                        {menu.label}
                                                    </AccordionTrigger>
                                                </Link>
                                                <AccordionContent>
                                                    <div className={"flex flex-col"}>
                                                        {menu.subMenu?.map((subItem, subIndex) => {
                                                            let link = menu.link;
                                                            let disabled = false;
                                                            if (
                                                                subItem.projectDepended &&
                                                                (project == undefined || project.id == undefined)
                                                            ) {
                                                                disabled = true;
                                                            } else if (subItem.projectDepended) {
                                                                link = subItem.link.replace(
                                                                    "${projectId}",
                                                                    project!.id
                                                                );
                                                            }

                                                            return (
                                                                <Link
                                                                    href={link}
                                                                    key={link}
                                                                    passHref={true}
                                                                    legacyBehavior={true}
                                                                >
                                                                    <a
                                                                        className={
                                                                            "flex w-full p-2 justify-start font-normal hover:bg-accent hover:text-accent-foreground" +
                                                                            (pathname === link
                                                                                ? " text-text-primary bg-selected font-extrabold"
                                                                                : "") +
                                                                            (disabled ? " disabled-link" : "")
                                                                        }
                                                                    >
                                                                        <Tally1/>
                                                                        {subItem.label}
                                                                    </a>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    );
                                } else {
                                    return (
                                        <Link
                                            key={`${menu}-${i}`}
                                            className={
                                                buttonVariants({
                                                    size: "sm",
                                                    variant: "ghost",
                                                    align: "flexLeft",
                                                }) +
                                                " w-full flex items-center justify-start" +
                                                (pathname === menu.link
                                                    ? " text-text-primary bg-selected font-extrabold"
                                                    : "")
                                            }
                                            href={menu.link}
                                        >
                                            {Icon && (
                                                <span className={"mr-4"}>
                          <Icon/>
                        </span>
                                            )}
                                            {menu.label}
                                        </Link>
                                    );
                                }
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
