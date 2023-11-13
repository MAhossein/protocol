"use client";

import { Role, Roles } from "@/types/ admin-types";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export default function CreateOrganisation() {
  const [organisationName, setOrganisationName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<Role | string>("");
  const [role, setRole] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [organisations, setOrganisations] = useState<any[]>([]);
  useEffect(() => {
    const getOrganisations = async () => {
      const res = await fetch("/api/admin/organisation", { method: "GET" });
      const orga = await res.json();
      setOrganisations(orga);
    };
    getOrganisations();
  }, []);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/admin/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        userEmail,
        password,
        role,
        organisationName,
      }),
    });
    if (!res.ok) {
      alert("Couldn't create new user");
    } else {
      const userRes = await res.json();
      console.log(userRes);
      alert(`User ${userRes.name} created`);
      router.push("/admin/users");
    }
  };
  return (
    <div className="flex flex-col items-center pt-20">
      <div className="flex flex-col items-baseline gap-20  w-2/4">
        <h1 className="text-xl">Create new organisation</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row flex-wrap gap-10"
        >
          <div className="flex flex-col gap-4">
            <label className="text-black">User name</label>
            <Input type={"text"}
              onChange={(e) => setUserName(e.target.value)}
              className="rounded-xl border border-input"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-black">User email</label>
            <Input
              onChange={(e) => setUserEmail(e.target.value)}
              type="email"
              className="rounded-xl border border-input"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-black">Password</label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="rounded-xl border border-input"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-black">User Role</label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
              {Roles.length > 0 ? (
                Roles?.map((item, i) => {
                  return (
                    <SelectItem key={i} value={item}>
                      {item}
                    </SelectItem>
                  );
                })
              ) : (
                <></>
              )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-black">Organisation</label>
            <Select
              onValueChange={setOrganisationName}
              value={organisationName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>

              {organisations.length > 0 ? (
                organisations?.map((item) => {
                  return (
                    <SelectItem key={item?.id} value={item?.organisationName}>
                      {item?.organisationName}
                    </SelectItem>
                  );
                })
              ) : (
                <>No organisations found</>
              )}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="rounded-xl" color="green">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}
