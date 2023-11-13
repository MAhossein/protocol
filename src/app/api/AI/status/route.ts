import { StatusRequest, StatusResponse } from "@/types/AI-types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, projectId, serviceKey }: StatusRequest = await req.json();
  try {
    const status = await fetch(
      `${process.env.TEST_AI_API}/api/v1/riskanalysis/status/${userId}/${projectId}/${serviceKey}`,
      {
        headers: {
          Authorization: `${process.env.AI_AUTHORIZATION}`,
          Accept: "*/*",
        },
        cache: "no-cache",
      }
    );
    const res: StatusResponse = await status.json();
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json(
      { message: "Fetch status failed" },
      { status: 500 }
    );
  }
}
