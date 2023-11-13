import prisma from "@/lib/prisma";
import {
  ResponseSynonymTrialSearch,
  SynonymsCreation,
  toAddSynonymsBody,
} from "@/types/synonyms-types";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { request } = await req.json();
  const {
    synToInclude,
    synToExclude,
    projectId,
    userId,
    targetType,
  }: SynonymsCreation = toAddSynonymsBody(request);
  try {
    for (const synonym of synToInclude) {
      const res = await prisma.synonym.upsert({
        where: { name: `${synonym}` },
        update: {},
        create: {
          name: `${synonym}`,
        },
      });
      const existingSyn = await prisma.synonymToInclude.findFirst({
        where: {
          projectId: `${projectId}`,
          synonymId: `${res.id}`,
        },
      });
      if (!existingSyn) {
        const insert = await prisma.synonymToInclude.create({
          data: {
            synonymId: `${res.id}`,
            projectId: `${projectId}`,
          },
        });
        console.log(insert);
      }
      console.log("To Include finished");
    }
    for (const synonym of synToExclude) {
      const res = await prisma.synonym.upsert({
        where: { name: `${synonym}` },
        update: {},
        create: {
          name: `${synonym}`,
        },
      });
      const existingSyn = await prisma.synonymToExclude.findFirst({
        where: {
          projectId: `${projectId}`,
          synonymId: `${res.id}`,
        },
      });
      if (!existingSyn) {
        const insert = await prisma.synonymToExclude.create({
          data: {
            synonymId: `${res.id}`,
            projectId: `${projectId}`,
          },
        });
        console.log(insert);
      }
      console.log("To Exclude finished");
    }
    const res = await fetch(
      `${process.env.TEST_AI_API}/api/v1/riskanalysis/synonym_trial_search_explorer`,
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
          synonyms_include: synToInclude,
          synonyms_exclude: synToExclude,
          score_threshold: 0,
          target_type: `${targetType}`,
          start_date: "1985-01-01",
          phases: [],
          interventional_studies_only: false,
          observational_studies_only: false,
          fields_scope: "default",
        }),
      }
    );
    const response: ResponseSynonymTrialSearch = await res.json();
    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to save synonyms" },
      { status: 500 }
    );
  }
}
