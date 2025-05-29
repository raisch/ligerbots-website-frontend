import TripRide from '$lib/server/tripride.js'

export async function POST({ request }) {
    try {
        const data = await request.json()
        const tripRide = await TripRide.createTripRide(data)
        
        return new Response(JSON.stringify(tripRide), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error creating trip ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}