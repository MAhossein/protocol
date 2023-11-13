import {
  SynonymSuggestionRequest,
  SynonymSuggestionResponse,
  toQueryParams,
} from "@/types/synonyms-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchQueryParams = toQueryParams(req.nextUrl.searchParams);
  try {
    const suggestions = await fetch(
      `${process.env.TEST_AI_API}/api/v1/riskanalysis/get_synonym_suggestions`,
      {
        method: "POST",
        headers: {
          Authorization: `${process.env.AI_AUTHORIZATION}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: `${searchQueryParams.userId}`,
          project_id: `${searchQueryParams.projectId}`,
          search_query: `${searchQueryParams.search}`,
        }),
      }
    );
    const res: SynonymSuggestionResponse = await suggestions.json();
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json(
      { message: "Fetch synonym suggestion failed" },
      { status: 500 }
    );
  }
}
