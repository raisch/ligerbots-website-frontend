import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockClient = {
  query: vi.fn()
}

// Use automatic mocking; configure implementation after import
vi.mock('$lib/server/client')

vi.mock('$lib/server/models/event.model.js', () => ({
  EventModelSchema: { validate: vi.fn() }
}))

vi.mock('$lib/server/trip.js', () => ({
  __esModule: true,
  default: {
    getTrips: vi.fn()
  }
}))

import { EventModelSchema } from '$lib/server/models/event.model.js'
import Event from '$lib/server/event.js'
import { getBackendClient } from '$lib/server/client'
import Trip from '$lib/server/trip.js'

// Cast mocked functions so TS knows they are mocks
const mockEventSchemaValidate = /** @type {import('vitest').Mock} */ (EventModelSchema.validate)
const mockGetBackendClient = /** @type {import('vitest').Mock} */ (getBackendClient)
const mockTripGetTrips = /** @type {import('vitest').Mock} */ (Trip.getTrips)

beforeEach(() => {
  mockClient.query.mockReset()
  mockGetBackendClient.mockReset()
  mockGetBackendClient.mockResolvedValue(mockClient)
  mockTripGetTrips.mockReset()
})

describe('Event.isEvent', () => {
  it('returns true when EventSchema validation has no error', () => {
    mockEventSchemaValidate.mockReturnValue({ error: undefined, value: {} })
    const result = Event.isEvent({ id: 1 })
    expect(mockEventSchemaValidate).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('returns false when EventSchema validation has an error', () => {
    mockEventSchemaValidate.mockReturnValue({ error: new Error('invalid'), value: {} })
    const result = Event.isEvent({ id: 1 })
    expect(result).toBe(false)
  })
})

describe('Event.getEvents', () => {
  it('replaces status placeholder and returns events array', async () => {
    mockClient.query.mockResolvedValueOnce({
      event: [{ id: '1', name: 'Test Event' }]
    })

    const result = await Event.getEvents('draft', 'query status {{status}}')

    expect(getBackendClient).toHaveBeenCalled()
    expect(mockClient.query).toHaveBeenCalledWith('query status draft')
    expect(result).toEqual([{ id: '1', name: 'Test Event' }])
  })

  it('returns empty array when no events found', async () => {
    mockClient.query.mockResolvedValueOnce({})

    const result = await Event.getEvents('published', 'query {{status}}')

    expect(result).toEqual([])
  })

  it('wraps errors from the backend client', async () => {
    mockClient.query.mockRejectedValueOnce(new Error('boom'))

    await expect(Event.getEvents()).rejects.toThrow(/failed to retrieve events/)
  })
})

describe('Event.getEventById', () => {
  it('throws when id is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Event.getEventById()).rejects.toThrow('Event ID is required')
  })

  it('returns event_by_id from backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      event_by_id: { id: '1', name: 'My Event' }
    })

    const result = await Event.getEventById('1', 'query {{id}}')

    expect(mockClient.query).toHaveBeenCalledWith('query 1')
    expect(result).toEqual({ id: '1', name: 'My Event' })
  })
})

describe('Event.getCompleteEventById', () => {
  it('throws when id is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Event.getCompleteEventById()).rejects.toThrow('Event ID is required')
  })

  it('hydrates base event with destination and return trips', async () => {
    // First call: used by getEventById inside getCompleteEventById
    mockClient.query.mockResolvedValueOnce({
      event_by_id: {
        id: '1',
        name: 'Base Event',
        status: 'published',
        location: 'Somewhere'
      }
    })

    mockTripGetTrips
      .mockResolvedValueOnce([
        { id: 'rel1', collection: 'destination_trip', item: { id: 'trip1' } }
      ])
      .mockResolvedValueOnce([
        { id: 'rel2', collection: 'return_trip', item: { id: 'trip2' } }
      ])

    const result = await Event.getCompleteEventById('1')

    // getEventById should have been called under the hood
    expect(mockClient.query).toHaveBeenCalledTimes(1)

    // Trip.getTrips should be called for both destination and return trips
    expect(mockTripGetTrips).toHaveBeenCalledWith('1', 'destination_trip')
    expect(mockTripGetTrips).toHaveBeenCalledWith('1', 'return_trip')

    expect(result).toEqual({
      id: '1',
      name: 'Base Event',
      status: 'published',
      location: 'Somewhere',
      trips: [
        { id: 'rel1', collection: 'destination_trip', item: { id: 'trip1' } },
        { id: 'rel2', collection: 'return_trip', item: { id: 'trip2' } }
      ]
    })
  })
})

describe('Event.createEvent', () => {
  it('throws when name is missing', async () => {
    // @ts-expect-error testing missing required fields
    await expect(Event.createEvent({})).rejects.toThrow('Event name is required')
  })

  it('sets default status and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      create_event_item: { id: '10', name: 'Created', status: 'draft' }
    })

    const eventData = {
      name: 'Created',
      description: 'desc',
      start_date: '2025-01-01',
      end_date: '2025-01-02',
      location: 'Somewhere'
    }

    const result = await Event.createEvent(eventData, 'createMutation')

    expect(mockClient.query).toHaveBeenCalledWith('createMutation', {
      event: expect.objectContaining({
        name: 'Created',
        status: 'draft'
      })
    })
    expect(result).toEqual({ id: '10', name: 'Created', status: 'draft' })
  })
})

describe('Event.updateEvent', () => {
  it('throws when id is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Event.updateEvent(undefined, {})).rejects.toThrow('Event ID is required')
  })

  it('throws when event data is empty', async () => {
    await expect(Event.updateEvent('1', {})).rejects.toThrow('No event data provided for update')
  })

  it('normalizes trips item objects to IDs and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      update_event_item: { id: '1', name: 'Updated' }
    })

    /** @type {any} */
    const eventData = {
      name: 'Updated',
      trips: [
        { id: 'rel1', item: { id: 'trip1', extra: 'x' }, collection: 'destination_trip' },
        { id: 'rel2', item: 'trip2', collection: 'return_trip' }
      ]
    }

    const result = await Event.updateEvent('1', eventData, 'updateMutation')

    expect(mockClient.query).toHaveBeenCalledWith('updateMutation', {
      id: '1',
      event: {
        name: 'Updated',
        trips: [
          { id: 'rel1', item: 'trip1', collection: 'destination_trip' },
          { id: 'rel2', item: 'trip2', collection: 'return_trip' }
        ]
      }
    })

    expect(result).toEqual({ id: '1', name: 'Updated' })
  })
})

describe('Event.archiveEvent', () => {
  it('delegates to updateEvent with archived status', async () => {
    const archivedEvent = /** @type {any} */ ({ id: '1', status: 'archived' })
    const spy = vi.spyOn(Event, 'updateEvent').mockResolvedValue(archivedEvent)

    const result = await Event.archiveEvent('1')

    expect(spy).toHaveBeenCalledWith('1', { status: 'archived' }, expect.anything())
    expect(result).toEqual(archivedEvent)

    spy.mockRestore()
  })
})

describe('Event.deleteEvent', () => {
  it('throws when id is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Event.deleteEvent()).rejects.toThrow('Event ID is required')
  })

  it('calls backend and returns deletion result', async () => {
    mockClient.query.mockResolvedValueOnce({
      delete_event_item: { id: '42' }
    })

    const result = await Event.deleteEvent('42', 'deleteMutation')

    expect(mockClient.query).toHaveBeenCalledWith('deleteMutation', { id: '42' })
    expect(result).toEqual({ id: '42' })
  })
})

describe('Event trips helpers', () => {
  it('createDestinationTrip validates required fields and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      create_destination_trip_item: { id: 't1' }
    })

    const tripData = {
      destination: 'Place',
      departs_from: 'Here',
      departs_on: '2025-01-01',
      departs_at: '09:00'
    }

    const result = await Event.createDestinationTrip('e1', tripData, 'createDestTrip')

    expect(mockClient.query).toHaveBeenCalledWith('createDestTrip', {
      trip: {
        ...tripData,
        status: 'published',
        event: { id: 'e1' }
      }
    })
    expect(result).toEqual({ id: 't1' })
  })

  it('createReturnTrip validates required fields and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      create_return_trip_item: { id: 't2' }
    })

    const tripData = {
      destination: 'Back',
      departs_from: 'There',
      departs_on: '2025-01-02',
      departs_at: '18:00'
    }

    const result = await Event.createReturnTrip('e1', tripData, 'createReturnTrip')

    expect(mockClient.query).toHaveBeenCalledWith('createReturnTrip', {
      trip: {
        ...tripData,
        status: 'published',
        event: { id: 'e1' }
      }
    })
    expect(result).toEqual({ id: 't2' })
  })

  it('deleteTrip validates collection and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      delete_item: { id: 'trip1' }
    })

    const result = await Event.deleteTrip('trip1', 'destination_trip', 'deleteTripMutation')

    expect(mockClient.query).toHaveBeenCalledWith('deleteTripMutation', {
      id: 'trip1',
      collection: 'destination_trip'
    })
    expect(result).toEqual({ id: 'trip1' })
  })
})

describe('Event trip ride helpers', () => {
  it('createTripRide validates inputs and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      create_trip_ride_item: { id: 'tr1' }
    })

    const rideData = {
      ride: {
        vehicle_type: 'car',
        name: 'Car 1',
        seats: 4
      }
    }

    const result = await Event.createTripRide('trip1', 'destination_trip', rideData, 'createTripRideMutation')

    expect(mockClient.query).toHaveBeenCalledWith('createTripRideMutation', {
      tripRide: {
        ride: rideData.ride,
        trip: { id: 'trip1', collection: 'destination_trip' }
      }
    })
    expect(result).toEqual({ id: 'tr1' })
  })

  it('addRiderToTripRide validates inputs and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      update_trip_ride_item: { id: 'tr1' }
    })

    const result = await Event.addRiderToTripRide('tr1', 'user1', 'addRiderMutation')

    expect(mockClient.query).toHaveBeenCalledWith('addRiderMutation', {
      tripRideId: 'tr1',
      userId: 'user1'
    })
    expect(result).toEqual({ id: 'tr1' })
  })

  it('removeRiderFromTripRide validates inputs and calls backend', async () => {
    mockClient.query.mockResolvedValueOnce({
      update_trip_ride_item: { id: 'tr1' }
    })

    const result = await Event.removeRiderFromTripRide('tr1', 'rel1', 'removeRiderMutation')

    expect(mockClient.query).toHaveBeenCalledWith('removeRiderMutation', {
      tripRideId: 'tr1',
      relationshipId: 'rel1'
    })
    expect(result).toEqual({ id: 'tr1' })
  })

  it('getTripRideById fetches trip ride and unwraps response', async () => {
    mockClient.query.mockResolvedValueOnce({
      trip_ride_by_id: { id: 'tr1' }
    })

    const result = await Event.getTripRideById('tr1', 'tripRideQuery')

    expect(mockClient.query).toHaveBeenCalledWith('tripRideQuery', { id: 'tr1' })
    expect(result).toEqual({ id: 'tr1' })
  })
})
