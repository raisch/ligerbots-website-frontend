import TripRide from '$lib/server/tripride.js'

export async function POST({ params, request }) {
    try {
        const { userId } = await request.json()
        
        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        const result = await TripRide.addRider(params.id, userId)
        
        return new Response(JSON.stringify(result), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error adding rider to trip ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}