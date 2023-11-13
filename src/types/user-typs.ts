import { User } from "@prisma/client";
import {ReducedUser } from "./request-types";

// export interface user {
//     id: string;
//     name: string;
//     email: string;
//     // ... add more fields as necessary for your user objects
//   }
  export interface UserWithRelated extends User {
    orguser?: ReducedUser;
  }
  