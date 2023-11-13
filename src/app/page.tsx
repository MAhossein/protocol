"use client";

import React, { useState } from "react";
import MainHeader from "@/components/layout/top/main-header";
import ProjectsContent from "@/app/projects-content";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import Link from "next/link";
import Search from "@/components/layout/top/search";
import FilterPanel, {FilterSelection} from "@/components/ui/filter-panel";
import {projectFilterDefinitions} from "@/types/project-types";

function Home() {
  const [searchProjectTerm, setSearchProjectTerm] = useState<string>("");
    const [projectFilterSelection, setProjectFilterSelection] = useState<FilterSelection[]>([]);
    return (
    <div className="flex flex-col items-start text-left bg-main-area flex-1">
      <div className="flex justify-between w-full">
        <MainHeader
          title="Dashboard"
          description="View your completed and uncompleted projects."
        />
        <div className={"py-5 pr-5"}>
          <Link href="/servicepage">
            <Button variant={"primary"} className={"w-44"}>
              <Plus className={"pr-2"} />
              New project
            </Button>
          </Link>
        </div>
      </div>
      <div className={"p-4 flex justify-between w-full"}>
        <Search
          className={"border border-input"}
          setSearchTerm={setSearchProjectTerm}
        />
          <FilterPanel filters={projectFilterDefinitions} onFilterSelectionChange={setProjectFilterSelection} currentFilterSelection={projectFilterSelection}/>
      </div>
      <ProjectsContent searchTerm={searchProjectTerm} projectFilterSelection={projectFilterSelection}/>
    </div>
  );
}

export default Home;
