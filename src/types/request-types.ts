import {FilterSelection} from "@/components/ui/filter-panel";

type SortOrder = "asc" | "desc";

export const defaultSortOrder: SortOrder = "desc";
export const defaultSortBy = "createdAt";
export const defaultPageSize = 10;
export const defaultPage = 0;

export interface ReducedUser {
    id: string;
    name: string;
    organisationId: string;
}

export interface ApiQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  filter?: string;
  fieldFilters?: FilterSelection[];
  filterObject?: Record<string, any>;
}

export const defaultApiQueryParams: ApiQueryParams = {
    page: defaultPage,
    pageSize: defaultPageSize,
    sortBy: defaultSortBy,
    sortOrder: defaultSortOrder,
    filter: '',
    fieldFilters: [],
};

export interface PaginatedResponse<T> {
  totalRecords: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: SortOrder;
  data?: T[];
}

export interface IdName {
    id: string;
    name: string
}

export function toQueryParamsString(queryParams: ApiQueryParams): String {
  return Object.entries(queryParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
}

export function toQueryParams(searchParams: URLSearchParams): ApiQueryParams {
    let filterObject : Record<string, any> = {};

    let currentKey;

    let lastKey = "";

    for (let [key, value] of searchParams) {
        if (key.endsWith('[name]')) {
            currentKey = value;   // Save the current key
            lastKey = currentKey;
        }

        if (key.endsWith('[value]')) {
            // Check if there is a currentKey
            if (currentKey) {
                // Add the key/value to the filter object
                filterObject[currentKey] = value;
                currentKey = null;
            } else {
                // If there is no currentKey, use the last saved key
                filterObject[lastKey] = value;
            }
        }
    }

    return {
        page: Number(searchParams.get("page")) || defaultPage,
        pageSize: Number(searchParams.get("pageSize")) || defaultPageSize,
        sortBy: searchParams.get("sortBy") ?? defaultSortBy,
        sortOrder: (searchParams.get("sortOrder") as SortOrder) || defaultSortOrder,
        filter: searchParams.get("filter") ?? "",
        filterObject: filterObject
  };
}
export interface ApiQueryParamsUserProjects {
  id: string;
}
export const defaultApiQueryParamsUserProjects: ApiQueryParamsUserProjects = {
  id: "",
};

export function toQueryParamsUserProjects(
  searchParams: URLSearchParams
): ApiQueryParamsUserProjects {
  return {
    id: String(searchParams.get("id")),
  };
}
export interface ApiQueryParamsOrganisationProjects {
  organisationId: string;
}
export const defaultApiQueryParamsOrganisationProjects: ApiQueryParamsOrganisationProjects = {
  organisationId: "",
};
export function toQueryParamsOrganisationProjects(
  searchParams: URLSearchParams
): ApiQueryParamsOrganisationProjects {
  return {
    organisationId: String(searchParams.get("organisationId")),
  };
}
export interface ApiQueryParamsOrganisationUsers {
  organisationId: string;
}
export const defaultApiQueryParamsOrganisationUsers: ApiQueryParamsOrganisationUsers = {
  organisationId: "",
};
export function toQueryParamsOrganisationUsers(
  searchParams: URLSearchParams
): ApiQueryParamsOrganisationUsers {
  return {
    organisationId: String(searchParams.get("organisationId")),
  };
}
