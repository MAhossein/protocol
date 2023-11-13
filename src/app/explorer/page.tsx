"use client"

import React, {useEffect, useState} from 'react';
import MainHeader from "@/components/layout/top/main-header";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import Search from "@/components/layout/top/search";
import ProjectsContent from "@/app/projects-content";
import ExplorerProjectsContent from "@/app/explorer/explorer-projects-content";

export default function Explorer() {
    const [searchProjectTerm, setSearchProjectTerm] = useState<string>("");
    return (
        <div className="flex flex-col items-start text-left bg-main-area flex-1">
            <div className="flex justify-between w-full">
                <MainHeader title="Explorer" description="View you validated projects."/>
                <div className={"py-5 pr-5"}>
                    <Link href='/servicepage'>
                        <Button variant={"primary"} className={"w-44"}><Plus className={"pr-2"}/>New project</Button>
                    </Link>
                </div>
            </div>
            <div className={"p-4"}>
                <Search className={"border border-input"} setSearchTerm={setSearchProjectTerm}/>
            </div>
            <ExplorerProjectsContent searchTerm={searchProjectTerm}/>
        </div>
    );

}