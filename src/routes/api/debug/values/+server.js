import { getBackendClient } from "$lib/server/client"

const default_fields = ['user_created', 'user_updated', 'date_created', 'date_updated']

/**
 * @param {string} typename
 */
function makeTypeLink(typename, setId = false) {
  return `<a ${setId ? `id=${typename}` : ''} href="/api/debug/types?#${typename}">${typename}</a>`
}

/**
 * @param {string} fieldname
 * @param {string} typename
 * @param {{ name: string, fields: { name: string, type: { name: string, kind: string } }[] }[]} types
 * @param  {...string} s
 * @returns {string}
 */
function createQuery(fieldname, typename, types, ...s) {
  console.log(`${'  '.repeat(s.length)}${fieldname}: ${typename}`)
  const type = types.find(t => t.name === typename)
  if (!type) return '';
  if (s.includes(typename) || default_fields.includes(fieldname) || typename.startsWith('directus_') || typename.endsWith('_functions')) return ''; // prevent infinite recursion, and skip directus system tables
  return `${fieldname} { ${type?.fields
    ?.map(f => f.type.kind.includes('OBJECT') || f.type.kind.includes('LIST') || f.type.kind.includes('UNION') ? createQuery(f.name, f.type.name, types, typename, ...s) : f.name) ?? []
  } }`;
}

/**
 * @param {[string]} l
 * @param {string} fieldname
 * @param {string} typename
 * @param {{ name: string, fields: { name: string, type: { name: string, kind: string } }[] }[]} types
 * @param  {...string} s
 * @returns {string}
 */
function createTypeDisplay(l, fieldname, typename, types, ...s) {
  console.log(`${'  '.repeat(s.length)}${fieldname}: ${makeTypeLink(typename)}`)
  const type = types.find(t => t.name === typename)
  if (!type) return '';
  if (s.includes(typename) || default_fields.includes(fieldname) || typename.startsWith('directus_') || typename.endsWith('_functions')) return ''; // prevent infinite recursion, and skip directus system tables
  return `${fieldname} { ${type?.fields
    ?.map(f => f.type.kind.includes('OBJECT') || f.type.kind.includes('LIST') || f.type.kind.includes('UNION') ? createTypeDisplay(l, f.name, f.type.name, types, typename, ...s) : f.name) ?? []
  } }`;
}

export async function GET({ url: { searchParams } }) {
  const client = await getBackendClient();
  const results = new Map();

  const type = searchParams.get('type') || '';

  /** @type {{ name: string; kind: string, fields: {name: string, type: {name: string, kind: string}}[] }[]} */
  const types = (await client.query('query { __schema { types { name, kind, fields { name, type { name, kind } } } } }')).__schema?.types;

  // console.log('type', type, JSON.stringify(types.find(t => t.name === type), null, 2))
  /** @type {{ name: string; kind: string, fields: {name: string, type: {name: string, kind: string}}[] }[]} */
  const values = (await client.query(`query { ${createQuery(type, type, types)} }`))[type];
  console.log('values', values)
  results.set('VALUES', values
    .map(v => JSON.stringify(v))
    .join('<br>'));

  

  // results.set('destination trip', JSON.stringify(await client.query('query {destination_trip_rides {id}}'), null, 2));
  // results.set('return trip', JSON.stringify(await client.query('query {return_trip_rides {id}}'), null, 2));

  return new Response(Array.from(results.entries()).map(([k, v]) => `<h4>${k}</h4><pre>${v}</pre>`).join('<hr>'), {headers: {'Content-Type': 'text/html'}});
}