import { createCarpoolSheet, XLSX_MIME_TYPE } from '$lib/server/spreadsheet.js'

export async function GET({ params }) {
  const id = params.id
  
  let result = await createCarpoolSheet(id);
  return result instanceof Response ? result : new Response(result, { status: 200, headers: {
    'Content-Type': XLSX_MIME_TYPE,
    'Content-Disposition': `attachment; filename="${result.name}"`
  } });
}