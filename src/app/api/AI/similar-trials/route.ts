import { SimilarTrialResponse, SimilarTrialsRequest } from "@/types/AI-types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    userId,
    projectId,
    targetType,
    cutOffYear,
    phases,
  }: SimilarTrialsRequest = await req.json();
  try {
    const res = await fetch(
      `${process.env.TEST_AI_API}/api/v1/riskanalysisvisio/similar_trials`,
      {
        method: "POST",
        headers: {
          Authorization: `${process.env.AI_AUTHORIZATION}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: `${userId}`,
          project_id: `${projectId}`,
          target_type: `${targetType}`,
          start_date: `${cutOffYear}-01-01`,
          phases: phases,
          states: [],
          number: 0,
        }),
      }
    );
    const productKey: SimilarTrialResponse = await res.json();
    return NextResponse.json(productKey);
  } catch (e) {
    return NextResponse.json(
      { message: "Fetch similar trials failed" },
      { status: 500 }
    );
  }
}
