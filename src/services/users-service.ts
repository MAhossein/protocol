import {
  RequestUserById,
  ResponseUserById,
  UpdateUserByIdBody,
} from "@/types/admin-types";
import { ProjectWithRelated } from "@/types/project-types";
import { ApiQueryParamsOrganisationUsers, ReducedUser } from "@/types/request-types";
import { UserWithRelated } from "@/types/user-typs";
import { Project } from "@prisma/client";
import axios, { AxiosResponse } from "axios";


export async function getUserById(id: string): Promise<ResponseUserById> {
  const user = await axios.get<any, AxiosResponse<ResponseUserById>>(
    "/api/admin/user/" + id,
    {}
  );
  return user.data;
}

export async function updateUser(
  updateBody: UpdateUserByIdBody
): Promise<ReducedUser> {
  const user = await axios.put<any, AxiosResponse<ReducedUser>>(
    "/api/admin/user",
    { updateBody }
  );
  return user.data;
}
export async function fetchOrganisationUsers(queryParams?: ApiQueryParamsOrganisationUsers
  ): Promise<UserWithRelated[]> {
    let queryParamsToUse = queryParams;
    const orgUsers = await axios.get<any, AxiosResponse<UserWithRelated[]>>(
      "/api/admin/user",
      { params: queryParamsToUse }
    );
    return orgUsers.data;
}