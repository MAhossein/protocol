"use client";
import { Trash2 } from "lucide-react";


import Link from "next/link";
import { useEffect, useState } from "react";
import Search from "@/components/layout/top/search";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";

import { FolderOpen } from "lucide-react";
import { FileEdit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrganisationResponse } from "@/types/admin-types";

export default function Organisations() {
  const [organisations, setOrganisations] = useState<OrganisationResponse>([]);
  const [searchOrganisation, setSearchOrganisation] = useState<string>("");
  useEffect(() => {
    const getOrganisations = async () => {
      const res = await fetch("/api/admin/organisation", { method: "GET" });
      const orga = await res.json();
      setOrganisations(orga);
    };


    getOrganisations();
  }, [organisations]);
  const deleteOrganisation = async (organisationId: string) => {
    const confirmed = window.confirm(
      "Are you sure to irreversibly delete this organisation and the users linked to it?"
    );
    if (confirmed) {
      try {
        const res = await fetch("/api/admin/organisation", {
          method: "DELETE",
          body: JSON.stringify({ organisationId }),
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
      <div></div>
      <div className="flex flex-row justify-evenly">
        <div className="flex flex-row items-center gap-5">
          Search for organisation
          <Search
            className={"border border-input"}
            setSearchTerm={setSearchOrganisation}
          />
        </div>
        <Link href={`/admin/organisations/create-organisation`}>
          <Button color="green" className="rounded-xl">
            Create new organisation
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Organisations</CardTitle>
        </CardHeader>
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organisations.length > 0 ? (
              organisations?.map((item) => {
                return (
                  <TableRow key={item?.id}>
                    <TableCell>{item?.organisationName}</TableCell>
                    <TableCell>{item.organisationEmail}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>{item._count.users}</TableCell>
                    <TableCell>
                      <Trash2
                        onClick={() => deleteOrganisation(item?.id)}
                        color="red"
                        className="hover:cursor-pointer"
                      />
                      <Link title="organisation User" href={`organisations/${item?.id}`}>
                          <FolderOpen />
                        </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No organisations found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
