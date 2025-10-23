import Ride from '$lib/server/ride.js'

export async function GET({ params }) {
    try {
        const ride = await Ride.getRideById(params.id)
        
        return new Response(JSON.stringify(ride), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error getting ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export async function PUT({ params, request }) {
    try {
        const data = await request.json()
        const rideData = {
            id: params.id,
            ...data
        }
        
        const ride = await Ride.updateRide(rideData)
        
        return new Response(JSON.stringify(ride), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error updating ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export async function DELETE({ params }) {
    try {
        const result = await Ride.deleteRide(params.id)
        
        return new Response(JSON.stringify(result), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error deleting ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}