import {
  SynonymBlockRequest,
  SynonymBlockResponse,
  toQueryParamsBlock,
} from "@/types/synonyms-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchQueryParamsBlock = toQueryParamsBlock(req.nextUrl.searchParams);
  try {
    const block = await fetch(
      `${process.env.TEST_AI_API}/api/v1/riskanalysis/get_synonym_block`,
      {
        method: "POST",
        headers: {
          Authorization: `${process.env.AI_AUTHORIZATION}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: `${searchQueryParamsBlock.userId}`,
          project_id: `${searchQueryParamsBlock.projectId}`,
          element: `${searchQueryParamsBlock.searchCondition}`,
        }),
      }
    );

    const res: SynonymBlockResponse = await block.json();
    console.log(res);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json(
      { message: "Fetch synonym block failed" },
      { status: 500 }
    );
  }
}
