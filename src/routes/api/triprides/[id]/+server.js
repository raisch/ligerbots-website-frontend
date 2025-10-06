import TripRide from '$lib/server/vehicle.js'

export async function DELETE({ params }) {
    try {
        const result = await TripRide.deleteTripRide(params.id)
        
        return new Response(JSON.stringify(result), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error deleting trip ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export async function GET({ params }) {
    try {
        const tripRide = await TripRide.getTripRideById(params.id)
        
        return new Response(JSON.stringify(tripRide), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error getting trip ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export async function PUT({ params, request }) {
    try {
        const data = await request.json()
        data.id = params.id
        const tripRide = await TripRide.updateTripRide(data)
        
        return new Response(JSON.stringify(tripRide), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error updating trip ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}