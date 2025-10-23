import Trip from '$lib/server/trip'

export async function POST({ request, params }) {
    try {
        const data = await request.json()
        const trip = await Trip.updateTrip(data, params.triptype)
        
        return new Response(JSON.stringify(trip), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error updating trip:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}
