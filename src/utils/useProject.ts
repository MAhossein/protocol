"use client"

import { useContext, useEffect } from 'react';
import {ProjectContext} from "@/context/project-context";
import {useQuery} from "@tanstack/react-query";
import {fetchProject} from "@/services/project-service";

export const useProject = (id?: string) => {
    const {project, setProject} = useContext(ProjectContext);

    if (id == undefined && (project == undefined || project.id == undefined))  {
        return {status: 'success', data: undefined, error: undefined};
    }
    const { status, data, error } = useQuery({
        queryKey: ['projects', id],
        queryFn: () => fetchProject(id || project?.id!),
    });

    useEffect(() => {
        if (setProject && data != undefined && data != project) {
            setProject(data);
        }
    },[data]);

    return {status, data, error};
};