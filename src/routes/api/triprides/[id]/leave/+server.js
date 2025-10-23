import TripRide from '$lib/server/vehicle.js'

export async function POST({ params, request }) {
    try {
        const data = await request.json()
        const { relationshipId } = data
        
        if (!relationshipId) {
            return new Response(JSON.stringify({ error: 'Relationship ID is required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        
        const result = await TripRide.removeRider(params.id, relationshipId)
        
        return new Response(JSON.stringify(result), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error removing rider from trip ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}