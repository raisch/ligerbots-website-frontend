import TripRide from '$lib/server/vehicle.js'

export async function POST({ request }) {
    try {
        const data = await request.json()
        
        console.log('Received trip ride request data:', JSON.stringify(data, null, 2));
        
        // Try different format variations for the trip relationship
        let tripRideData;
        
        // First try: simple ID format (might work if schema is simpler)
        tripRideData = {
            ride: data.ride,
            trip: data.trip
        }
        
        console.log('Attempting trip ride creation with format 1:', JSON.stringify(tripRideData, null, 2));
        
        try {
            const tripRide = await TripRide.createTripRide(tripRideData)
            console.log('Success with format 1:', JSON.stringify(tripRide, null, 2));
            return new Response(JSON.stringify(tripRide), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (format1Error) {
            console.log('Format 1 failed:', format1Error instanceof Error ? format1Error.message : String(format1Error));
            
            // Try format 2: with collection info
            tripRideData = {
                ride: data.ride,
                trip: {
                    id: data.trip,
                    collection: data.tripType || 'destination_trip'
                }
            }
            
            console.log('Attempting trip ride creation with format 2:', JSON.stringify(tripRideData, null, 2));
            
            try {
                const tripRide = await TripRide.createTripRide(tripRideData)
                console.log('Success with format 2:', JSON.stringify(tripRide, null, 2));
                return new Response(JSON.stringify(tripRide), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } catch (format2Error) {
                console.log('Format 2 failed:', format2Error instanceof Error ? format2Error.message : String(format2Error));
                
                // Try format 3: direct collection reference
                const collectionField = data.tripType || 'destination_trip';
                tripRideData = {
                    ride: data.ride,
                    [collectionField]: data.trip
                }
                
                console.log('Attempting trip ride creation with format 3:', JSON.stringify(tripRideData, null, 2));
                
                const tripRide = await TripRide.createTripRide(tripRideData)
                console.log('Success with format 3:', JSON.stringify(tripRide, null, 2));
                return new Response(JSON.stringify(tripRide), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        }
        
    } catch (error) {
        console.error('Error creating trip ride:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({
            error: errorMessage,
            details: error instanceof Error ? error.toString() : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}