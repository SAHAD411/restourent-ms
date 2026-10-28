import "server-only";

const timeoutMs = 15_000;
// Server-only endpoint for the existing deployed Apps Script.
const appsScriptUrl = "https://script.google.com/macros/s/AKfycbzB-mDqWU5-GY-6J5fPsvf0elkY0MSzN80oGvmAnl2o4b2G1kR-T7Vgkz8V7pkHSf_Y/exec";

function endpoint(action: "items" | "orders") {
  const url = new URL(appsScriptUrl);
  url.searchParams.set("action", action);
  return url;
}

async function request(url: URL, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, { ...init, cache: "no-store", redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
  const text = await response.text();
  let payload: unknown;
  try { payload = JSON.parse(text); } catch { throw new Error(`Apps Script returned a non-JSON response (HTTP ${response.status}).`); }
  if (!response.ok) throw new Error(`Apps Script request failed (HTTP ${response.status}).`);
  if (typeof payload === "object" && payload !== null) {
    const result = payload as { success?: unknown; status?: unknown; error?: unknown; message?: unknown };
    const failed = result.success === false || (typeof result.status === "string" && ["error", "failed", "failure"].includes(result.status.toLowerCase())) || (typeof result.error === "string" && result.error.length > 0);
    if (failed) throw new Error(typeof result.error === "string" ? result.error : typeof result.message === "string" ? result.message : "Apps Script rejected the request.");
  }
  return payload;
}

export function getExternal(action: "items" | "orders") { return request(endpoint(action)); }
export function postExternal(action: "addItem" | "addOrder", data: unknown) {
  return request(new URL(appsScriptUrl), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ action, data }) });
}
