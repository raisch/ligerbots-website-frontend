import { beforeEach, describe, expect, it, vi } from 'vitest'

// Simple mock client used by all tests
const mockClient = {
  query: vi.fn()
}

// Auto-mock the Directus client wrapper; implementation configured in beforeEach
vi.mock('$lib/server/client')

// Mock GraphQL queries/mutations for trips
vi.mock('$lib/server/graphql/trip', () => ({
  __esModule: true,
  GET_DESTINATION_TRIPS_QUERY: 'DEST_TRIPS_QUERY',
  GET_RETURN_TRIPS_QUERY: 'RETURN_TRIPS_QUERY',
  UPDATE_DESTINATION_TRIP_MUTATION: 'UPDATE_DEST_TRIP_MUTATION',
  UPDATE_RETURN_TRIP_MUTATION: 'UPDATE_RETURN_TRIP_MUTATION'
}))

// Mock Joi model schemata for trips
vi.mock('$lib/server/models/destination_trip.model.js', () => ({
  __esModule: true,
  default: {
    validate: vi.fn()
  }
}))

vi.mock('$lib/server/models/return_trip.model.js', () => ({
  __esModule: true,
  default: {
    validate: vi.fn()
  }
}))

import Trip from '$lib/server/trip.js'
import { getBackendClient } from '$lib/server/client'
import {
  GET_DESTINATION_TRIPS_QUERY,
  GET_RETURN_TRIPS_QUERY,
  UPDATE_DESTINATION_TRIP_MUTATION,
  UPDATE_RETURN_TRIP_MUTATION
} from '$lib/server/graphql/trip'
import DestinationTripModelSchema from '$lib/server/models/destination_trip.model.js'
import ReturnTripModelSchema from '$lib/server/models/return_trip.model.js'

const mockGetBackendClient = /** @type {import('vitest').Mock} */ (getBackendClient)
const mockDestTripValidate = /** @type {import('vitest').Mock} */ (DestinationTripModelSchema.validate)
const mockReturnTripValidate = /** @type {import('vitest').Mock} */ (ReturnTripModelSchema.validate)

beforeEach(() => {
  mockClient.query.mockReset()
  mockGetBackendClient.mockReset()
  mockGetBackendClient.mockResolvedValue(mockClient)
  mockDestTripValidate.mockReset()
  mockReturnTripValidate.mockReset()
})

describe('Trip.getTrips', () => {
  it('throws when eventId is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Trip.getTrips()).rejects.toThrow('Event ID is required')
  })

  it('throws when tripType is invalid', async () => {
    // @ts-expect-error testing invalid trip type
    await expect(Trip.getTrips('e1', 'invalid')).rejects.toThrow(
      'Invalid trip type. Choose "destination_trip" or "return_trip"'
    )
  })

  it('uses destination trips query and validates destination trip items', async () => {
    mockClient.query.mockResolvedValueOnce({
      event_by_id: {
        trips: [
          { item: { id: 't1', destination: 'X' }, collection: 'destination_trip' },
          { item: { id: 't2', destination: 'Y' }, collection: 'destination_trip' }
        ]
      }
    })
    mockDestTripValidate.mockReturnValue({ error: undefined, value: {} })

    const result = await Trip.getTrips('e1', 'destination_trip')

    expect(mockGetBackendClient).toHaveBeenCalled()
    expect(mockClient.query).toHaveBeenCalledWith(GET_DESTINATION_TRIPS_QUERY, {
      event_id: 'e1'
    })

    expect(result).toEqual([
      { item: { id: 't1', destination: 'X' }, collection: 'destination_trip' },
      { item: { id: 't2', destination: 'Y' }, collection: 'destination_trip' }
    ])

    expect(mockDestTripValidate).toHaveBeenCalledTimes(2)
    expect(mockDestTripValidate).toHaveBeenNthCalledWith(
      1,
      { id: 't1', destination: 'X' },
      { allowUnknown: true }
    )
    expect(mockDestTripValidate).toHaveBeenNthCalledWith(
      2,
      { id: 't2', destination: 'Y' },
      { allowUnknown: true }
    )
  })

  it('uses return trips query and validates return trip items', async () => {
    mockClient.query.mockResolvedValueOnce({
      event_by_id: {
        trips: [
          { item: { id: 't3', destination: 'Z' }, collection: 'return_trip' }
        ]
      }
    })
    mockReturnTripValidate.mockReturnValue({ error: undefined, value: {} })

    const result = await Trip.getTrips('e1', 'return_trip')

    expect(mockClient.query).toHaveBeenCalledWith(GET_RETURN_TRIPS_QUERY, {
      event_id: 'e1'
    })

    expect(result).toEqual([
      { item: { id: 't3', destination: 'Z' }, collection: 'return_trip' }
    ])

    expect(mockReturnTripValidate).toHaveBeenCalledTimes(1)
    expect(mockReturnTripValidate).toHaveBeenCalledWith(
      { id: 't3', destination: 'Z' },
      { allowUnknown: true }
    )
  })

  it('returns empty array when no trips are found', async () => {
    mockClient.query.mockResolvedValueOnce({})

    const result = await Trip.getTrips('e1', 'destination_trip')

    expect(result).toEqual([])
  })
})

describe('Trip.updateTrip', () => {
  it('throws when tripData is missing', async () => {
    // @ts-expect-error testing missing trip data
    await expect(Trip.updateTrip()).rejects.toThrow('Trip data with valid id is required')
  })

  it('throws when tripData.id is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Trip.updateTrip({})).rejects.toThrow('Trip data with valid id is required')
  })

  it('throws when tripType is invalid', async () => {
    // @ts-expect-error testing invalid trip type
    await expect(Trip.updateTrip({ id: 't1' }, 'invalid')).rejects.toThrow(
      'Invalid trip type. Choose "destination_trip" or "return_trip"'
    )
  })

  it('updates destination trip with correct mutation and validates result', async () => {
    mockClient.query.mockResolvedValueOnce({
      update_destination_trip_item: { id: 't1', destination: 'X' }
    })
    mockDestTripValidate.mockReturnValue({ error: undefined, value: {} })

    const tripData = {
      id: 't1',
      destination: 'X'
    }

    const result = await Trip.updateTrip(tripData, 'destination_trip')

    expect(mockClient.query).toHaveBeenCalledWith(UPDATE_DESTINATION_TRIP_MUTATION, {
      id: 't1',
      trip: { destination: 'X' }
    })

    expect(result).toEqual({ id: 't1', destination: 'X' })
    expect(mockDestTripValidate).toHaveBeenCalledWith(
      { id: 't1', destination: 'X' },
      { allowUnknown: true }
    )
  })

  it('updates return trip with correct mutation and validates result', async () => {
    mockClient.query.mockResolvedValueOnce({
      update_return_trip_item: { id: 't2', destination: 'Y' }
    })
    mockReturnTripValidate.mockReturnValue({ error: undefined, value: {} })

    const tripData = {
      id: 't2',
      destination: 'Y'
    }

    const result = await Trip.updateTrip(tripData, 'return_trip')

    expect(mockClient.query).toHaveBeenCalledWith(UPDATE_RETURN_TRIP_MUTATION, {
      id: 't2',
      trip: { destination: 'Y' }
    })

    expect(result).toEqual({ id: 't2', destination: 'Y' })
    expect(mockReturnTripValidate).toHaveBeenCalledWith(
      { id: 't2', destination: 'Y' },
      { allowUnknown: true }
    )
  })
})

