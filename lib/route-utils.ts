import { NextResponse } from "next/server";

export function jsonError(error: unknown, status = 502) {
  const message = error instanceof Error ? error.message : "The upstream service could not be reached.";
  if (process.env.NODE_ENV !== "production") console.error("Apps Script API error:", message);
  let publicMessage = message;
  if (status >= 500) {
    if (message === "fetch failed") publicMessage = "This server cannot connect to Google Apps Script. Check the server's outbound network access and the deployed web app availability.";
    else if (message.toLowerCase().includes("timed out")) publicMessage = "Google Apps Script did not respond in time. Please try again.";
    else if (message.includes("not configured")) publicMessage = "GOOGLE_APPS_SCRIPT_URL is not configured on this server.";
    else if (message.includes("non-JSON")) publicMessage = "Google Apps Script returned an unexpected response. Confirm the web app returns JSON.";
    else publicMessage = "Google Apps Script could not complete the request. Please try again.";
  }
  return NextResponse.json({ success: false, error: publicMessage }, { status });
}

export async function readJson(request: Request): Promise<unknown | null> {
  try { return await request.json(); } catch { return null; }
}
