import { NextResponse } from "next/server";
import { getExternal, postExternal } from "@/lib/apps-script";
import { jsonError, readJson } from "@/lib/route-utils";
import { validateItem } from "@/lib/validation";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ success: true, data: await getExternal("items") }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return jsonError(error); }
}
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body || typeof body !== "object" || !("data" in body)) return jsonError(new Error("Malformed JSON or missing data."), 400);
  const item = validateItem(body.data);
  if (!item) return jsonError(new Error("Provide a valid item ID and name, and non-negative numeric price and stock quantity."), 400);
  try { return NextResponse.json({ success: true, data: await postExternal("addItem", item) }, { status: 201 }); }
  catch (error) { return jsonError(error); }
}
