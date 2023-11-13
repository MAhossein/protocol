import {
  ProjectCreation,
  ProjectUpdate,
  ProjectWithRelated,
} from "@/types/project-types";
import axios, { AxiosResponse } from "axios";
import {
  ApiQueryParams,
  ApiQueryParamsOrganisationProjects,
  ApiQueryParamsUserProjects,
  defaultApiQueryParams, IdName, PaginatedResponse,
} from "@/types/request-types";
import {
  ResponseSynonymTrialSearch,
  SynonymBlockRequest,
  SynonymBlockResponse,
  SynonymSuggestionRequest,
  SynonymSuggestionResponse,
  SynonymsCreation,
} from "@/types/synonyms-types";

export async function fetchProjects(
  queryParams?: ApiQueryParams
): Promise<PaginatedResponse<ProjectWithRelated>> {
  let queryParamsToUse = queryParams ?? { ...defaultApiQueryParams };
  const projects = await axios.get<any, AxiosResponse<PaginatedResponse<ProjectWithRelated>>>(
    "/api/project/",
    { params: queryParamsToUse }
  );
  return projects.data;
}

export async function fetchProject(id: string): Promise<ProjectWithRelated> {
  const projects = await axios.get<any, AxiosResponse<ProjectWithRelated>>(
    "/api/project/" + id,
    {}
  );
  return projects.data;
}

export async function fetchUserProjects(
  queryParams?: ApiQueryParamsUserProjects
): Promise<ProjectWithRelated[]> {
  let queryParamsToUse = queryParams;
  const projects = await axios.get<any, AxiosResponse<ProjectWithRelated[]>>(
    "/api/project/get-user-project",
    { params: queryParamsToUse }
  );
  return projects.data;
}
export async function fetchOrganisationProjects(
  queryParams?:ApiQueryParamsOrganisationProjects
  ):Promise<ProjectWithRelated[]>  {
    let queryParamsToUse = queryParams;
  const projects = await axios.get<any, AxiosResponse<ProjectWithRelated[]>>(
    "/api/project/get-organisation-project",
    { params: queryParamsToUse }
  );
  return projects.data;
  
}
export async function createProject(
  createBody: ProjectCreation
): Promise<ProjectWithRelated> {
  const project = await axios.post<any, AxiosResponse<ProjectWithRelated>>(
    "api/project",
    {
      createBody,
    }
  );
  return project.data;
}

export async function updateProject(
  updateBody: ProjectUpdate
): Promise<ProjectWithRelated> {
  const project = await axios.put<any, AxiosResponse<ProjectWithRelated>>(
    "/api/project",
    { updateBody }
  );
  return project.data;
}

export async function addSynonyms(
  synonymsBody: SynonymsCreation
): Promise<ResponseSynonymTrialSearch> {
  const service_key = await axios.post<
    any,
    AxiosResponse<ResponseSynonymTrialSearch>
  >("api/project/save-synonyms", { synonymsBody });
  return service_key.data;
}

export async function getSynonymsSuggestions(
  searchQueryParams: SynonymSuggestionRequest
): Promise<SynonymSuggestionResponse> {
  const suggestions = await axios.get("api/project/get-synonym-suggestion", {
    params: searchQueryParams,
  });
  return suggestions.data;
}

export async function getSynonymsBlock(
  searchQueryParams: SynonymBlockRequest
): Promise<SynonymBlockResponse> {
  const block = await axios.get("api/project/get-synonym-block", {
    params: searchQueryParams,
  });
  return block.data;
}

export async function fetchProjectServices(): Promise<IdName[]> {
  const services = await axios.get<any, AxiosResponse<IdName[]>>(
    "/api/project/services",
    {}
  );
  return services.data;
}

export async function fetchProjectUsers(): Promise<IdName[]> {
  const services = await axios.get<any, AxiosResponse<IdName[]>>(
      "/api/project/user",
      {}
  );
  return services.data;
}