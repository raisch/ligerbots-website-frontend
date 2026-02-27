import { getBackendClient } from "$lib/server/client"

/**
 * @param {string} typename
 */
function makeTypeLink(typename, setId = false) {
  return `<a ${setId ? `id=${typename}` : ''} href="?#${typename}">${typename}</a>`
}

/**
 * @param {{ name: string, kind: string, fields: {name: string, type: {name: string, kind: string}}[] }} type
 */
function getTypeInfo(type) {
  return `${makeTypeLink(type.name, true)} (${type.kind})\n${type.fields?.map((/** @type {{ name: string; type: { name: string; kind: string; }; }} */ f) => `  ${f.name}: ${makeTypeLink(f.type.name)}`).join('\n') ?? '  [no fields]'}\n`;
}

export async function GET({ url: { searchParams } }) {
  const client = await getBackendClient();
  const results = new Map();

  const filter = searchParams.get('filter') || '';

  /** @type {{ name: string; kind: string, fields: {name: string, type: {name: string, kind: string}}[] }[]} */
  const types = (await client.query('query { __schema { types { name, kind, fields { name, type { name, kind } } } } }')).__schema?.types;
  results.set('TYPES', types
    .filter(t => !filter || t.name.includes(filter) || filter[0] === ':' && filter.substring(1).split(',').includes(t.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(t => getTypeInfo(t))
    .join('<br>'));

  

  // results.set('destination trip', JSON.stringify(await client.query('query {destination_trip_rides {id}}'), null, 2));
  // results.set('return trip', JSON.stringify(await client.query('query {return_trip_rides {id}}'), null, 2));

  return new Response(Array.from(results.entries()).map(([k, v]) => `<h4>${k}</h4><pre>${v}</pre>`).join('<hr>'), {headers: {'Content-Type': 'text/html'}});
}