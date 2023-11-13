"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, FormEvent } from "react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
const agentsArray = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];

export default function CreateOrganisation() {
  const [organisationName, setOrganisationName] = useState<string>("");
  const [organisationEmail, setOrganisationEmail] = useState<string>("");
  const [subscription, setSubscription] = useState<string>("");
  const [numberAgents, setNumberAgents] = useState<string>("0");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/admin/organisation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organisationName,
        organisationEmail,
      }),
    });
    if (!res.ok) {
      alert("Couldn't create new organisation");
    } else {
      const organisationRes = await res.json();
      console.log(organisationRes);
      alert(`Organisation ${organisationRes.organisationName} created`);
      router.push("/admin/organisations");
    }
  };
  return (
    <div className="flex flex-col items-center pt-20">
      <div className="flex flex-col items-baseline gap-20  w-2/4">
        <h1 className="text-xl">Create new organisation</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <label className="text-black">Organisation name</label>
            <Input type={"text"}
              onChange={(e) => setOrganisationName(e.target.value)}
              className="rounded-xl border border-input"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-black">Organisation email</label>
            <Input type={"email"}
                   onChange={(e) => setOrganisationEmail(e.target.value)}
              className="rounded-xl border border-input"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-black">Subscription type</label>
            <Select onValueChange={setSubscription} value={subscription}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select subscription type" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="One year Subscription">
                One year Subscription
              </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-black">Number of agents</label>
            <Select onValueChange={setNumberAgents} value={numberAgents}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select number of agents" />
              </SelectTrigger>
              <SelectContent>
                  {agentsArray.map((e) => {
                    return (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    );
                  })}
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
