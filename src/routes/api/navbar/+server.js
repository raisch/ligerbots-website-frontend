import { json } from "@sveltejs/kit";
import { getBackendClient } from "$lib/server/client";
import { readItems } from "@directus/sdk";

export async function GET(event) {
  const client = await getBackendClient();

  let res;
  try {
    res = await client.request(
      readItems("global", { fields: ["navbar_definition"] })
    );
    return json(res.navbar_definition);
  } catch (e) {
    console.error("GET /api/navbar", e);
    return json({ error: "Failed to fetch global configuration" });
  }
}
