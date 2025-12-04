# Backend Server Module Examples (`src/lib/server`)

This document shows how the backend service classes under `src/lib/server` work
and gives concrete examples of calling **all static methods** on:

- `Event` – `src/lib/server/event.js`
- `Trip` – `src/lib/server/trip.js`
- `Ride` – `src/lib/server/ride.js`
- `Rider` – `src/lib/server/rider.js`
- `Vehicle` – `src/lib/server/vehicle.js`

All of these classes are thin service layers over Directus GraphQL:

- They obtain a Directus client via `getBackendClient()`.
- They send typed GraphQL queries/mutations defined in `src/lib/server/graphql/*`.
- They use Joi models in `src/lib/server/models/*` for best‑effort validation and logging.

> **Important**
>
> - These examples assume you are running inside the SvelteKit app (e.g. from
>   a `+server.js`/`+page.server.js` file) and can use `$lib/server/...` imports.
> - When running from standalone Node scripts in `bin/`, use **relative imports**
>   instead (e.g. `import Event from '../src/lib/server/event.js'`), as shown in
>   `bin/getEvents.js`.

---

## Event service – `src/lib/server/event.js`

```js
import Event from '$lib/server/event.js'
```

### `Event.isEvent(evt)`

Validate that an object looks like an event record according to `EventModelSchema`.

```js
const maybeEvent = { id: 1, name: 'Robocon', location: 'WPS' }

if (Event.isEvent(maybeEvent)) {
  console.log('Looks like a valid event')
}
```

### `Event.getEvents(status = 'published', query = EVENT_QUERY)`

Fetch a list of events filtered by status.

```js
// Get all published events
const events = await Event.getEvents()

// Get draft events
const drafts = await Event.getEvents('draft')

// events is an array of event records
events.forEach((event) => {
  console.log(event.id, event.name, event.status)
})
```

### `Event.getEventById(id, query = EVENT_BY_ID_QUERY)`

Fetch a single event by ID.

```js
const eventId = '1'
const event = await Event.getEventById(eventId)

if (!event || !event.id) {
  console.log('Event not found')
} else {
  console.log('Loaded event:', event.name, 'at', event.location)
}
```

### `Event.getCompleteEventById(id, query = EVENT_COMPLETE_BY_ID_QUERY)`

Fetch a complete event, including its **destination and return trips**, and each
trip’s **rides and riders**. Internally this uses the `Trip` service to hydrate
trips.

```js
const eventId = '1'
const complete = await Event.getCompleteEventById(eventId)

// complete.trips is an array of relations; each has a `collection` and `item`:
for (const rel of complete.trips ?? []) {
  const { collection, item } = rel
  if (!item) continue

  console.log('Trip type:', collection, 'destination:', item.destination)

  for (const rideRel of item.rides ?? []) {
    const rideItem = rideRel.item
    console.log('  Ride:', rideItem.ride.name, 'seats:', rideItem.ride.seats)

    for (const riderRel of rideItem.riders ?? []) {
      const rider = riderRel.item
      console.log('    Rider:', rider.firstname, rider.lastname)
    }
  }
}
```

### `Event.createEvent(eventData, mutation = CREATE_EVENT_MUTATION)`

Create a new event. `status` defaults to `'draft'`.

```js
const newEvent = await Event.createEvent({
  name: 'Off‑Season Scrimmage',
  description: 'Practice / scrimmage event',
  start_date: '2025-01-25',
  end_date: '2025-01-25',
  location: 'Shop',
  // status: 'draft' // optional – defaults to 'draft'
})

console.log('Created event with ID:', newEvent.id)
```

### `Event.updateEvent(id, eventData, mutation = UPDATE_EVENT_MUTATION)`

Update an existing event. If `trips` is provided, it normalizes any `item`
objects to IDs for the m2a relation.

```js
const updated = await Event.updateEvent('1', {
  name: 'Robocon (Updated Name)',
  location: 'New Venue'
})

console.log('Updated event:', updated.id, updated.name, updated.location)
```

With trips:

```js
const updatedWithTrips = await Event.updateEvent('1', {
  trips: [
    {
      id: 'rel1',
      collection: 'destination_trip',
      item: { id: 'trip1', destination: 'Venue', departs_from: 'Shop' }
    }
  ]
})
```

### `Event.archiveEvent(id, mutation = UPDATE_EVENT_MUTATION)`

Convenience method to set `status` to `'archived'`.

```js
await Event.archiveEvent('1')
```

### `Event.deleteEvent(id, mutation = DELETE_EVENT_MUTATION)`

Delete an event by ID.

```js
const deleted = await Event.deleteEvent('42')
console.log('Deleted event ID:', deleted.id)
```

### Trip helpers on `Event`

These methods create/update/delete trips *in the context of an event*.

#### `Event.createDestinationTrip(eventId, tripData, mutation = CREATE_DESTINATION_TRIP_MUTATION)`

```js
const destTrip = await Event.createDestinationTrip('1', {
  destination: 'WPS',
  departs_from: 'Starbucks Newtonville',
  departs_on: '2024-09-21',
  departs_at: '08:00',
  // status: 'published' // default if omitted
})
```

#### `Event.createReturnTrip(eventId, tripData, mutation = CREATE_RETURN_TRIP_MUTATION)`

```js
const returnTrip = await Event.createReturnTrip('1', {
  destination: 'Starbucks Newtonville',
  departs_from: 'WPS',
  departs_on: '2024-09-21',
  departs_at: '18:00'
})
```

#### `Event.updateDestinationTrip(tripId, tripData, mutation = UPDATE_DESTINATION_TRIP_MUTATION)`

```js
const updatedDest = await Event.updateDestinationTrip('trip1', {
  departs_at: '08:30'
})
```

#### `Event.updateReturnTrip(tripId, tripData, mutation = UPDATE_RETURN_TRIP_MUTATION)`

```js
const updatedReturn = await Event.updateReturnTrip('trip2', {
  status: 'archived'
})
```

#### `Event.deleteTrip(tripId, collection, mutation = DELETE_TRIP_MUTATION)`

```js
// Delete a destination trip
await Event.deleteTrip('trip1', 'destination_trip')

// Delete a return trip
await Event.deleteTrip('trip2', 'return_trip')
```

### Trip ride helpers on `Event`

These methods create/update/delete **trip_ride** records for a given trip.

#### `Event.createTripRide(tripId, tripCollection, rideData, mutation = CREATE_TRIP_RIDE_MUTATION)`

```js
const tripRide = await Event.createTripRide(
  'trip1',
  'destination_trip',
  {
    ride: {
      vehicle_type: 'Car',
      name: "Rob's Car",
      seats: 4,
      driver: { id: 'user1' }
    }
  }
)
```

#### `Event.updateTripRide(tripRideId, rideData, mutation = UPDATE_TRIP_RIDE_MUTATION)`

```js
const updatedTripRide = await Event.updateTripRide('tride1', {
  ride: { seats: 5 }
})
```

#### `Event.deleteTripRide(tripRideId, mutation = DELETE_TRIP_RIDE_MUTATION)`

```js
await Event.deleteTripRide('tride1')
```

#### `Event.addRiderToTripRide(tripRideId, userId, mutation = ADD_RIDER_MUTATION)`

```js
const updatedAfterAdd = await Event.addRiderToTripRide('tride1', 'user96')
```

#### `Event.removeRiderFromTripRide(tripRideId, relationshipId, mutation = REMOVE_RIDER_MUTATION)`

```js
const updatedAfterRemove = await Event.removeRiderFromTripRide('tride1', 'rel123')
```

#### `Event.getTripRideById(tripRideId, query = GET_TRIP_RIDE_BY_ID_QUERY)`

```js
const tripRide = await Event.getTripRideById('tride1')
console.log('Trip ride seats:', tripRide.ride?.seats)
```

---

## Trip service – `src/lib/server/trip.js`

```js
import Trip from '$lib/server/trip.js'
```

### `Trip.getTrips(eventId, tripType = 'destination_trip')`

Fetch trips (with rides and riders) for a given event.

```js
const destinationTrips = await Trip.getTrips('1', 'destination_trip')
const returnTrips = await Trip.getTrips('1', 'return_trip')

destinationTrips.forEach((rel) => {
  const trip = rel.item
  if (!trip) return

  console.log('Trip departs from', trip.departs_from, 'to', trip.destination)
  console.log('Rides count:', trip.rides?.length ?? 0)
})
```

### `Trip.updateTrip(tripData, tripType = 'destination_trip')`

Update a destination or return trip.

```js
const updatedTrip = await Trip.updateTrip(
  {
    id: 'trip1',
    departs_at: '08:30:00'
  },
  'destination_trip'
)

console.log('Updated trip departs at:', updatedTrip.departs_at)
```

---

## Ride service – `src/lib/server/ride.js`

`Ride` manages the **`ride` collection** (vehicles assigned to trips), not the
`trip_ride` relationship.

```js
import Ride from '$lib/server/ride.js'
```

### `Ride.getAllRides(query = GET_ALL_RIDES_QUERY)`

```js
const rides = await Ride.getAllRides()
rides.forEach((ride) => {
  console.log(ride.id, ride.name, 'seats:', ride.seats)
})
```

### `Ride.getRideById(rideId, query = GET_RIDE_BY_ID_QUERY)`

```js
const ride = await Ride.getRideById('ride1')
console.log('Ride name:', ride.name)
```

### `Ride.createRide(rideData, mutation = CREATE_RIDE_MUTATION)`

```js
const newRide = await Ride.createRide({
  vehicle_type: 'Van',
  name: 'Team Van',
  seats: 8,
  driver: { id: 'user1' }
})

console.log('Created ride ID:', newRide.id)
```

### `Ride.updateRide(rideData, mutation = UPDATE_RIDE_MUTATION)`

```js
const updatedRide = await Ride.updateRide({
  id: 'ride1',
  seats: 5
})

console.log('Updated ride seats:', updatedRide.seats)
```

### `Ride.deleteRide(rideId, mutation = DELETE_RIDE_MUTATION)`

```js
await Ride.deleteRide('ride1')
```

---

## Rider service – `src/lib/server/rider.js`

`Rider` manages **riders for a specific trip_ride**, i.e. the
`trip_ride_riders` junction collection.

```js
import Rider from '$lib/server/rider.js'
```

### `Rider.addRiderToRide(tripRideId, userId, mutation = ADD_RIDER_MUTATION)`

```js
const relation = await Rider.addRiderToRide('tride1', 'user96')

console.log('Created rider relationship ID:', relation.id)
```

### `Rider.getRidersFromRide(tripRideId, query = GET_TRIP_RIDE_BY_ID_QUERY)`

```js
const riders = await Rider.getRidersFromRide('tride1')

for (const user of riders) {
  console.log('Rider:', user.firstname, user.lastname)
}
```

### `Rider.removeRiderFromRide(relationshipId, mutation = REMOVE_RIDER_MUTATION)`

```js
await Rider.removeRiderFromRide('rel123')
```

---

## Vehicle service – `src/lib/server/vehicle.js`

`Vehicle` represents reusable vehicles based on the same `ride` collection, but
treated as a pool of templates that can be copied into `trip_ride` records.

```js
import Vehicle from '$lib/server/vehicle.js'
```

### `Vehicle.getAllVehicles(query = GET_ALL_RIDES_QUERY)`

```js
const vehicles = await Vehicle.getAllVehicles()

vehicles.forEach((vehicle) => {
  console.log('Vehicle:', vehicle.name, 'seats:', vehicle.seats)
})
```

### `Vehicle.getVehicleById(vehicleId, query = GET_RIDE_BY_ID_QUERY)`

```js
const vehicle = await Vehicle.getVehicleById('rideTemplate1')
console.log('Template vehicle name:', vehicle.name)
```

### `Vehicle.createVehicle(vehicleData, mutation = CREATE_RIDE_MUTATION)`

```js
const createdVehicle = await Vehicle.createVehicle({
  name: 'Parent Van',
  vehicle_type: 'Van',
  seats: 7,
  driver: { id: 'userParent' }
})

console.log('Created vehicle template ID:', createdVehicle.id)
```

### `Vehicle.updateVehicle(vehicleData, mutation = UPDATE_RIDE_MUTATION)`

```js
const updatedVehicle = await Vehicle.updateVehicle({
  id: 'rideTemplate1',
  seats: 8
})

console.log('Updated template seats:', updatedVehicle.seats)
```

### `Vehicle.deleteVehicle(vehicleId, mutation = DELETE_RIDE_MUTATION)`

```js
await Vehicle.deleteVehicle('rideTemplate1')
```

---

## Notes and best practices

- All methods are `async` and may throw `Error` instances when:
  - Required parameters are missing, or
  - The backend client is not available, or
  - The Directus GraphQL call fails.
- Joi validation in these services is **best‑effort**: it logs validation
  errors via `debug` but does not throw.
- When using these services from SvelteKit endpoints, prefer `$lib/server/...`
  imports; when using from standalone Node scripts, use relative imports and
  ensure `dotenv/config` (or equivalent) is loaded so `API_URL` and
  `API_TOKEN` are available.
