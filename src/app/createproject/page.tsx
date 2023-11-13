"use client";

import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";

import MainHeader from "@/components/layout/top/main-header";
import { Button } from "@/components/ui/button";
import StepContent from "./StepContent";
import { useProjectStore } from "@/components/store/project/zustand";
import { ProjectCreation } from "@/types/project-types";
import { createProject } from "@/services/project-service";
import {ProjectContext} from "@/context/project-context";



const PopupValidate = (props: any) => {
  const { show, children } = props;

  if (!show) {
    return null;
  }

  return (
      <div className='w-6/12 p-10 bg-white shadow-lg rounded-md'>
        {children}
      </div>
  )
}


const CreateProject = () => {
  const [showPopup, setShowPopup] = useState(false)
  const handleShowDiv = () => {
    setShowPopup(true);
  };
  const handleHideDiv = () => {
    setShowPopup(false);
  };

  const [subStep, setSubStep] = useState(1);

  // Use effect saves current users id in state
  const [userId, setUserId] = useState<string>("");
  // get project context. Current project and set project.
  const { project, setProject } = useContext(ProjectContext);
  // to check if project created or not. So when going back on step 1, it doesn't recreates a project
  const [created, setCreated] = useState<boolean>(false);
  // project name from Zustand store
  const projectName = useProjectStore((state) => state.projectName);
  const service = useProjectStore((state) => state.projectService);
  const updateProjectName = useProjectStore((state) => state.updateProjectName);
  const projectDescription = useProjectStore(
      (state) => state.projectDescription
  );
  const updateProjectDescription = useProjectStore(
      (state) => state.updateProjectDescription
  );
  const studyType = useProjectStore((state) => state.studyType);
  const updateStudyType = useProjectStore((state) => state.updateStudyType);
  const steps = ["Project name", "Condition", "Intervention", "Summary"];
  const [currentStep, setCurrentStep] = useState(1);
    const [complete, setComplete] = useState(false);
  // projectid only to check if everything is working
  const [projectId, setProjectId] = useState<string>("");
  // State for step 1 form
  const [inputValues, setInputValues] = useState({});
  // Body to send to create project api
  const createBody: ProjectCreation = {
    userId: userId,
    service: service,
    projectName: projectName,
    projectDescription: projectDescription,
    studyType: studyType,
  };
  const { mutate, status, data, error } = useMutation({
    mutationKey: ["project", createBody],
    mutationFn: () => createProject(createBody),
  });
  const handleCreateProject = async () => {
    if (
        projectName == "" ||
        projectDescription == "" ||
        studyType == "" ||
        service == "" ||
        userId == "" ||
        created
    ) {
      return;
    } else {
      const res = mutate();
      setCreated(true);
      alert("project created");
    }
  };
  useEffect(() => {
    const getUserId = async () => {
      const res = await fetch("/api/admin/get-user", { method: "GET" });
      const user = await res.json();
      console.log(user.id);
      setUserId(user.id);
    };
    // if already in step 2 refill projectid with id from context --> can be deleted in future
    if (currentStep == 2 && project) {
      setProjectId(project?.id);
    }
    getUserId();
    // when created set project id to created id and context to created project
    if (data) {
      setProjectId(data.id);
      if (setProject) {
        setProject(data);
      }
    }
  }, [data]);
  const handleInputChange = (e: any) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
    switch (e.target.name) {
      case "projectName":
        updateProjectName(e.target.value);
        break;
      case "projectDescription":
        updateProjectDescription(e.target.value);
        break;
      case "radioGroupStudyType":
        updateStudyType(e.target.value);
        break;
    }
  };

  return (
      <div className='flex flex-col items-start text-left bg-main-area flex-1'>
        <div className="flex justify-between w-full">
          <MainHeader
              title="New Project"
              description={`Enter data to create a new search ${projectId} - ${project?.id}`}
          />
        </div>
        <div className='flex flex-col w-full'>
          <div className="flex flex-col flex-grow m-10 rounded-lg border-2 bg-white">
            <div className={`flex justify-evenly -mt-6 mb-16 ${showPopup ? 'overflow-hidden pointer-events-none opacity-10' : ''}`}>
              {steps?.map((step, i) => (
                  <div
                      key={i}
                      className={`step-item relative flex flex-col justify-center items-center w-96 ${currentStep === i + 1
                          ? "active"
                          : i + 1 < currentStep || complete
                              ? "complete"
                              : "inactive"
                      } `}
                  >
                    <div
                        className={`w-10 h-10 flex items-center justify-center z-10 relative rounded-full font-semibold text-white ${currentStep >= i + 1 ? "bg-primary-2" : "bg-gray-200"
                        }`}
                    >
                      {i + 1}
                    </div>
                    <p
                        className={`text-gray-500 ${complete && "text-gray-200"} ${currentStep === i + 1 ? "text-primary-2" : ""
                        }`}
                    >
                      {step}
                    </p>
                    {i !== 0 && (
                        <div
                            className={`${i + 1 <= currentStep || complete
                                ? "bg-primary-2"
                                : "bg-gray-200"
                            } absolute w-full h-[3px] right-2/4 top-1/3 -translate-y-2/4`}
                        ></div>
                    )}
                  </div>
              ))}
            </div>

            <div className={`${showPopup ? 'overflow-hidden pointer-events-none opacity-10' : ''}`}>
              <StepContent
                  subStep={subStep}
                  currentStep={currentStep}
                  handleInputChange={handleInputChange}
                  projectBody={createBody}
                  projectId={project?.id}
                  userId={userId}
              />
            </div>

            <div className={`absolute top-1/3 flex justify-center items-center`}>
              <PopupValidate show={showPopup}>
                <div className="mb-10">
                  <p className="whitespace-break-spaces text-md font-medium text-black">To finish the trail search process, please confirm your selected filters by clicking 'Validate'. Be aware that, once you validated, your selected synonyms and search scope can no longer be modified.</p>
                </div>
                <div className="flex space-x-2 justify-end items-center">
                  <Button className="p-5" variant={'outline'} size={'md'} onClick={handleHideDiv}>Cancel</Button>
                  <Link href={`${currentStep === 4 ? '/' : ''}`}>
                    <Button className="p-5" variant={'primary'} size={'md'}>Validate</Button>
                  </Link>
                </div>
              </PopupValidate>
            </div>


            <div className="space-x-2 flex justify-end items-end p-6 rounded-lg">
              <Link href={`${currentStep === 1 ? '/' : ''}`}>
                <Button
                    variant="outline"
                    size={"lg"}
                    className={`${currentStep === 1 ? "disabled:opacity-50" : ""
                    } w-24 font-semibold text-md`}
                    onClick={() => {
                      if (currentStep > 1 && subStep === 1) {
                        setCurrentStep((prev) => prev - 1);
                        setSubStep(3);
                      } else if (subStep > 1) {
                        setSubStep((prev) => prev - 1);
                      }
                    }}
                >
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>
              </Link>
              <Button
                  variant={"primary"}
                  className="w-24 font-semibold text-md"
                  size={"lg"}
                  disabled={
                      (projectName == "" ||
                          projectDescription == "" ||
                          studyType == "" ||
                          service == "" ||
                          userId == "") &&
                      currentStep == 1
                  }
                  onClick={() => {
                    if (currentStep === 4) {
                      handleShowDiv()
                    }
                    if ((currentStep === 2 || currentStep === 3) && subStep < 3) {
                      setSubStep(subStep + 1);
                    } else {
                      if (currentStep < steps.length) {
                        setCurrentStep((prev) => prev + 1);
                      } else {
                        setComplete(true);
                      }
                      if (currentStep === 1) {
                        handleCreateProject();
                      }
                      setSubStep(1);
                    }
                  }}
              >
                {currentStep === steps.length ? "Validate" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div >
  );
};

export default CreateProject;
