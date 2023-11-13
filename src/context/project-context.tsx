"use strict"
import React, {useState, useEffect} from 'react';
import {ProjectWithRelated} from "@/types/project-types";

interface ProjectContextProps {
    project?: ProjectWithRelated
    setProject?: (project: ProjectWithRelated) => void;
}

interface ProjectProviderProps {
    children: React.ReactNode;
}

export const ProjectContext = React.createContext<ProjectContextProps>({
    project: undefined,
});

export default function ProjectProvider({children}: ProjectProviderProps) {
    const [currentProject, setCurrentProject] = useState<ProjectWithRelated | undefined>(() => {
        const localData = localStorage.getItem('project');
        try {
            let parsedData = JSON.parse(localData as string);
            return parsedData;
        } catch (e) {
            return undefined;
        }
    });

    const setProject = (project: ProjectWithRelated) => {
        localStorage.setItem('project', JSON.stringify(project));
        setCurrentProject(project);
    }

    // This effect is used to update the local storage whenever the currentProject's state changes
    useEffect(() => {
        localStorage.setItem('project', JSON.stringify(currentProject));
    }, [currentProject]);

    return (
        <ProjectContext.Provider value={{project: currentProject, setProject}}>
            {children}
        </ProjectContext.Provider>
    );
}