import { NextResponse } from "next/server";

export function jsonError(error: unknown, status = 502) {
  const message = error instanceof Error ? error.message : "The upstream service could not be reached.";
  if (process.env.NODE_ENV !== "production") console.error("Apps Script API error:", message);
  return NextResponse.json({ success: false, error: status >= 500 ? "Google Sheets could not complete the request. Please try again." : message }, { status });
}

export async function readJson(request: Request): Promise<unknown | null> {
  try { return await request.json(); } catch { return null; }
}
