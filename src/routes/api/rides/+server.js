import Ride from '$lib/server/ride.js'
import User from '$lib/server/user'

export async function GET({ cookies }) {
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) return new Response('Unauthorized', { status: 401 })

    try {
        const rides = await Ride.getAllRides()
        
        return new Response(JSON.stringify(rides), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error getting all rides:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export async function POST({ request, cookies }) {
  const jwt = cookies.get('jwt')
  if (!jwt || !User.validate(jwt)) return new Response('Unauthorized', { status: 401 })

    try {
        const data = await request.json()
        const ride = await Ride.createRide(data)
        
        return new Response(JSON.stringify(ride), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Error creating ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}