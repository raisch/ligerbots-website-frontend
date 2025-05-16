import Trip from '$lib/server/trip'

export async function POST({ request, params }) {
    const data = await request.json()
    const trip = await Trip.updateTrip(data, params.triptype)
    return new Response(JSON.stringify(trip))
}
