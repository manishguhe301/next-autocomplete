import { NextResponse } from "next/server";
import { COUNTRIES_LIST } from "@/utils/constants";

export function GET() {
  return NextResponse.json(COUNTRIES_LIST);
}
