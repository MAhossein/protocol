import { create } from "zustand";

type projectService = "Self Service" | "Assisted Service" | "";
type studyType = "Interventional" | "Observational" | "";

interface ProjectStoreState {
  projectService: projectService;
  projectName: string;
  projectDescription: string;
  studyType: studyType;
}

interface ProjectStoreActions {
  updateProjectService: (projectService: projectService) => void;
  updateProjectName: (projectName: string) => void;
  updateProjectDescription: (projectDescription: string) => void;
  updateStudyType: (studyType: studyType) => void;
}

export const useProjectStore = create<ProjectStoreState & ProjectStoreActions>(
  (set) => ({
    projectService: "Self Service",
    projectName: "",
    projectDescription: "",
    studyType: "Interventional",
    updateProjectService: (projectService) => set(() => ({ projectService })),
    updateProjectName: (projectName) => set(() => ({ projectName })),
    updateProjectDescription: (projectDescription) =>
      set(() => ({ projectDescription })),
    updateStudyType: (studyType) => set(() => ({ studyType })),
  })
);
