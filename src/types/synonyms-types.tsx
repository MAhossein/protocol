export type TargetType = "condition" | "intervention";

export interface SynonymsCreation {
  synToInclude: string[] | [];
  synToExclude: string[] | [];
  projectId: string;
  userId: string;
  targetType: TargetType;
}

export interface ResponseSynonymTrialSearch {
  service_key: string;
}

export interface SynonymSuggestionRequest {
  userId: string;
  projectId: string;
  search: string;
}

export interface SynonymSuggestionResponse {
  suggestions: string[];
}

export interface SynonymBlockRequest {
  userId: string;
  projectId: string;
  searchCondition: string;
}
export interface SynonymBlockResponse {
  [key: string]: string[];
}
export function toQueryParams(
  searchParams: URLSearchParams
): SynonymSuggestionRequest {
  return {
    userId: String(searchParams.get("userId")),
    projectId: String(searchParams.get("projectId")),
    search: String(searchParams.get("search")),
  };
}
export function toQueryParamsBlock(
  searchParams: URLSearchParams
): SynonymBlockRequest {
  return {
    userId: String(searchParams.get("userId")),
    projectId: String(searchParams.get("projectId")),
    searchCondition: String(searchParams.get("searchCondition")),
  };
}

export function toAddSynonymsBody(
  synonymsBody: SynonymsCreation
): SynonymsCreation {
  return {
    synToInclude: synonymsBody.synToInclude || [],
    synToExclude: synonymsBody.synToExclude || [],
    projectId: String(synonymsBody.projectId),
    userId: String(synonymsBody.userId),
    targetType: synonymsBody.targetType,
  };
}
