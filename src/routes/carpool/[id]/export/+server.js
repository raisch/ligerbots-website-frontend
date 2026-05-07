import { createCarpoolSheet, XLSX_MIME_TYPE } from '$lib/server/spreadsheet.js'
import User from '$lib/server/user';

export async function GET({ params, cookies }) {
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) return new Response('Unauthorized', { status: 401 })

  const id = params.id
  
  let result = await createCarpoolSheet(id);
  return result instanceof Response ? result : new Response(result, { status: 200, headers: {
    'Content-Type': XLSX_MIME_TYPE,
    'Content-Disposition': `attachment; filename="${result.name}"`
  } });
}