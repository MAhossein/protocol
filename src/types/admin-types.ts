export type Role = "ADMIN" | "USER";
export const Roles = ["USER", "ADMIN"];

export interface OrganisationCreating {
  organisationName: string;
  organisationEmail: string;
}

export interface RequestUserById {
  userId: string;
}
export interface ResponseUserById {
  id: string;
  role: string;
  name: string;
  email: string;
  active: boolean;
}
export interface ResponseOrganisationById {
  id: string;
  role: string;
  name: string;
  email: string;
  active: boolean;
}

export interface UpdateUserByIdBody {
  id: string;
  role: string;
  name: string;
  email: string;
  active: boolean;
}
export interface RequestOrganisationById {
  organisationId: string;
}
export interface Organisation {
  id: string;
  organisationEmail: string;
  organisationName: string;
  createdAt: string;
  _count: {
    users: number;
  };
}
export type OrganisationResponse = Organisation[];