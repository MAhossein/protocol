"use client";

import { Trash2 } from "lucide-react";
import { FolderOpen } from "lucide-react";
import { FileEdit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Users() {
  const [role, setRole] = useState();
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    const getRole = async () => {
      const res = await fetch("/api/admin/get-role");
      const role = await res.json();
      setRole(role);
    };
    const getUsers = async () => {
      const res = await fetch("/api/admin/user", { method: "GET" });
      const orga = await res.json();
      setUsers(orga);
    };
    getUsers();
    getRole();
  }, []);
  const deleteUser = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure to irreversibly delete this user?"
    );
    if (confirmed) {
      try {
        const res = await fetch("/api/admin/user", {
          method: "DELETE",
          body: JSON.stringify({ userId }),
        });
        const response = await res.json();
        console.log(response);
        if (res.ok) {
          alert("Successfully deleted");
        }
      } catch (e) {
        alert("Delete failed");
      }
    } else {
      return;
    }
  };
  return (
    <div className="flex flex-col gap-20 pt-20 px-10">
      <div className="flex flex-row justify-evenly">
        <Link href={`/admin/users/create-user`}>
          <Button color="green" className="rounded-xl">
            Create new user
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Organisation</TableHead>
              {role == "ADMIN" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users?.map((user) => {
                return (
                  <TableRow key={user?.id}>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>{user.organisation.organisationName}</TableCell>
                    {role == "ADMIN" && (
                      <TableCell className="flex flex-row gap-2">
                        <div title="Delete User">
                          <Trash2
                            onClick={() => deleteUser(user?.id)}
                            color="red"
                            className="hover:cursor-pointer"
                          />
                        </div>

                        <Link title="Open User" href={`users/${user?.id}`}>
                          <FolderOpen />
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
