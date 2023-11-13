import { DownloadRequest } from "@/types/AI-types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, projectId, productKey, dataType }: DownloadRequest =
    await req.json();
  const transformedDataType =
    dataType == "svg" ? "_svg" : dataType == "json" ? "_json" : "";
  try {
    const res = await fetch(
      `${process.env.TEST_AI_API}/api/v1/riskanalysis/download`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `${process.env.AI_AUTHORIZATION}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: `${userId}`,
          project_id: `${projectId}`,
          product_key: `${productKey}${transformedDataType}`,
        }),
      }
    );
    return res;
  } catch (e) {
    return NextResponse.json(
      { message: `Fetch graph ${productKey} failed` },
      { status: 500 }
    );
  }
}
