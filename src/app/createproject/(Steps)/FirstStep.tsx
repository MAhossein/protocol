"use client";

import { ProjectCreation } from "@/types/project-types";
import React, { ChangeEvent } from "react";
interface FirstStepProps {
  projectBody: ProjectCreation;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}
const FirstStep: React.FC<FirstStepProps> = ({
  handleInputChange,
  projectBody,
}) => {
  return (
    <div className="flex flex-col pl-28 justify-center w-full space-y-12">
      <div className="flex mb-10">
        <p className="mr-20 font-semibold text-md text-lg">Project name</p>
        <div className="w-8/12">
          <input
            className="bg-white p-2 w-9/12 rounded-md border border-black"
            placeholder="Project name"
            type="text"
            value={projectBody.projectName}
            name="projectName"
            id="projectName"
            onChange={(e) => handleInputChange(e)}
          />
          <p className="text-gray-400">This is a hint text to help user.</p>
        </div>
      </div>
      <div className="flex mb-10">
        <p className="mr-8 font-semibold text-md text-lg">
          Project description
        </p>
        <textarea
          className="w-8/12 resize-none bg-white border border-black rounded-lg p-2"
          name="projectDescription"
          id="projectDescription"
          value={projectBody.projectDescription}
          cols={10}
          rows={6}
          placeholder="Enter a description"
          onChange={(e) => handleInputChange(e)}
        ></textarea>
      </div>
      <div className="flex mb-10">
        <p className="mr-24 font-semibold text-md text-lg">Upload File</p>
        <div className="w-8/12">
          <label className="border border-black rounded px-4 py-2 cursor-pointer">
            <input type="file" className="bg-white w-10/12 rounded-md border" />{" "}
            {/* Hidden file input */}
            Browse File
          </label>
          <p className=" text-gray-400">This is a hint text to help user.</p>
        </div>
      </div>

      <div className="flex">
        <p className="mr-24 font-semibold text-md text-lg">Study Type</p>
        <div className="flex space-x-10">
          <label className="flex items-center" style={{ width: "200px" }}>
            <input
              type="radio"
              className="form-radio w-4 h-4 mr-2"
              name="radioGroupStudyType"
              checked={projectBody.studyType == "Interventional"}
              value="Interventional"
              onChange={(e) => handleInputChange(e)}
            />
            <span className="text-md">Innervational</span>
          </label>
          <label className="flex items-center" style={{ width: "200px" }}>
            <input
              type="radio"
              className="form-radio w-4 h-4 mr-2"
              name="radioGroupStudyType"
              checked={projectBody.studyType == "Observational"}
              value="Observational"
              onChange={(e) => handleInputChange(e)}
            />
            <span className="text-md">Observational</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
