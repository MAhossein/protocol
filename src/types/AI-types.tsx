import { TargetType } from "./synonyms-types";

export interface StatusRequest {
  userId: string;
  projectId: string;
  serviceKey: string;
}

export interface StatusResponse {
  state: "IN_PROGRESS" | "SUCCESSFUL";
}

export interface SimilarTrialsRequest {
  userId: string;
  projectId: string;
  targetType: TargetType;
  cutOffYear: number;
  phases: string[] | [];
}

export interface SimilarTrialResponse {
  product_key: string[];
}

export interface DownloadRequest {
  userId: string;
  projectId: string;
  productKey:
    | "condition_similar_trials_time_stats"
    | "condition_similar_trials_phases_stats";
  dataType: "svg" | "json";
}
