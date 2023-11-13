"use client";

import React from "react";
import Link from "next/link";

import MainHeader from "@/components/layout/top/main-header";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/components/store/project/zustand";
// TODO: already create project here to get project id (so that comments can be created)
const ServicePage = () => {
  // get project service default valude from zustand
  const projectService = useProjectStore((state) => state.projectService);
  // get function to update project service in zustand
  const updateProjectService = useProjectStore(
    (state) => state.updateProjectService
  );
  return (
    <div className="flex flex-col items-start text-left bg-main-area flex-1">
      <div className="flex justify-between w-full">
        <MainHeader
          title="New Project"
          description="Enter data to create a new search"
        />
      </div>

      <div className="flex flex-col w-full" style={{ height: "80vh" }}>
        <div className="flex flex-grow m-10 rounded-lg border-2 bg-white">
          <div className="text-xl text-black font-semibold p-4 w-2/6">
            Select one of the services:
          </div>
          <div className="flex justify-center items-center p-4 w-full h-full">
            <div className="flex flex-col items-center">
              <label
                className="flex items-center mb-10"
                style={{ width: "200px" }}
              >
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-primary w-6 h-6 mr-2"
                  checked={projectService == "Self Service"}
                  onChange={() => updateProjectService("Self Service")}
                />
                <span className="text-lg font-semibold">Self Service</span>
              </label>
              <label className="flex items-center" style={{ width: "200px" }}>
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-primary w-6 h-6 mr-2"
                  checked={projectService == "Assisted Service"}
                  onChange={() => updateProjectService("Assisted Service")}
                />
                <span className="text-lg font-semibold">Assisted Service</span>
              </label>
            </div>
          </div>
          <div className="w-80 space-x-2 flex justify-end items-end p-6 rounded-lg">
            <Link href="/">
              <Button
                variant={"outline"}
                className={"w-24 font-semibold text-md"}
                size={"lg"}
              >
                Cancel
              </Button>
            </Link>
            <Link
              href={projectService != "" ? "/createproject" : "/servicepage"}
            >
              <Button
                variant={"primary"}
                className={"w-24 font-semibold text-md"}
                size={"lg"}
                onClick={() =>
                  projectService == "" && alert("You have to choose one option")
                }
              >
                Next
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
