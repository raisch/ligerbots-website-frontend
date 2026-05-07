import { beforeEach, describe, expect, it, vi } from 'vitest'

// Shared mock Directus client
const mockClient = {
  query: vi.fn()
}

// Auto-mock Directus client wrapper
vi.mock('$lib/server/client')

// Mock GraphQL operations for trip_ride riders
vi.mock('$lib/server/graphql/rider.js', () => ({
  __esModule: true,
  ADD_RIDER_MUTATION: 'ADD_RIDER_MUTATION',
  REMOVE_RIDER_MUTATION: 'REMOVE_RIDER_MUTATION'
}))

vi.mock('$lib/server/graphql/trip_ride.js', () => ({
  __esModule: true,
  GET_TRIP_RIDE_BY_ID_QUERY: 'GET_TRIP_RIDE_BY_ID_QUERY'
}))

// Mock Joi schema for trip_ride_riders collection
vi.mock('$lib/server/models/trip_ride_riders.model.js', () => ({
  __esModule: true,
  default: {
    validate: vi.fn()
  }
}))

import Rider from '$lib/server/rider.js'
import { getBackendClient } from '$lib/server/client'
import { ADD_RIDER_MUTATION, REMOVE_RIDER_MUTATION } from '$lib/server/graphql/rider.js'
import { GET_TRIP_RIDE_BY_ID_QUERY } from '$lib/server/graphql/trip_ride.js'
import TripRideRidersModelSchema from '$lib/server/models/trip_ride_riders.model.js'

const mockGetBackendClient = /** @type {import('vitest').Mock} */ (getBackendClient)
const mockRelationValidate = /** @type {import('vitest').Mock} */ (
  TripRideRidersModelSchema.validate
)

beforeEach(() => {
  mockClient.query.mockReset()
  mockGetBackendClient.mockReset()
  mockGetBackendClient.mockResolvedValue(mockClient)
  mockRelationValidate.mockReset()
})

describe('Rider.addRiderToRide', () => {
  it('throws when tripRideId is missing', async () => {
    // @ts-expect-error testing missing tripRideId
    await expect(Rider.addRiderToRide(undefined, 'user1')).rejects.toThrow(
      'Trip ride ID is required'
    )
  })

  it('throws when userId is missing', async () => {
    // @ts-expect-error testing missing userId
    await expect(Rider.addRiderToRide('tr1')).rejects.toThrow('User ID is required')
  })

  it('adds rider to ride, unwraps response, and validates relationship', async () => {
    mockClient.query.mockResolvedValueOnce({
      create_trip_ride_riders_item: {
        id: 'rel1',
        trip_ride_id: { id: 'tr1' },
        item: { id: 'user1' },
        collection: 'users'
      }
    })
    mockRelationValidate.mockReturnValue({ error: undefined, value: {} })

    const result = await Rider.addRiderToRide('tr1', 'user1')

    expect(mockGetBackendClient).toHaveBeenCalled()
    expect(mockClient.query).toHaveBeenCalledWith(ADD_RIDER_MUTATION, {
      tripRideId: 'tr1',
      userId: 'user1'
    })

    expect(result).toEqual({
      id: 'rel1',
      trip_ride_id: { id: 'tr1' },
      item: { id: 'user1' },
      collection: 'users'
    })

    expect(mockRelationValidate).toHaveBeenCalledWith(
      {
        id: 'rel1',
        trip_ride_id: 'tr1',
        item: 'user1',
        collection: 'users'
      },
      { allowUnknown: true }
    )
  })
})

describe('Rider.getRidersFromRide', () => {
  it('throws when tripRideId is missing', async () => {
    // @ts-expect-error testing missing tripRideId
    await expect(Rider.getRidersFromRide()).rejects.toThrow('Trip ride ID is required')
  })

  it('returns an array of user records from trip ride response', async () => {
    mockClient.query.mockResolvedValueOnce({
      trip_ride_by_id: {
        id: 'tr1',
        riders: [
          {
            item: {
              id: 'user1',
              firstname: 'Alice'
            }
          },
          {
            item: {
              id: 'user2',
              firstname: 'Bob'
            }
          }
        ]
      }
    })

    const result = await Rider.getRidersFromRide('tr1')

    expect(mockClient.query).toHaveBeenCalledWith(GET_TRIP_RIDE_BY_ID_QUERY, { id: 'tr1' })
    expect(result).toEqual([
      { id: 'user1', firstname: 'Alice' },
      { id: 'user2', firstname: 'Bob' }
    ])
  })

  it('returns empty array when no riders are present', async () => {
    mockClient.query.mockResolvedValueOnce({
      trip_ride_by_id: {
        id: 'tr1',
        riders: []
      }
    })

    const result = await Rider.getRidersFromRide('tr1')

    expect(result).toEqual([])
  })
})

describe('Rider.removeRiderFromRide', () => {
  it('throws when relationshipId is missing', async () => {
    // @ts-expect-error testing missing relationshipId
    await expect(Rider.removeRiderFromRideById()).rejects.toThrow('Relationship ID is required')
  })

  it('removes rider relationship using mutation', async () => {
    mockClient.query.mockResolvedValueOnce({
      delete_trip_ride_riders_item: { id: 'rel1' }
    })

    const result = await Rider.removeRiderFromRideById('rel1')

    expect(mockClient.query).toHaveBeenCalledWith(REMOVE_RIDER_MUTATION, {
      relationshipId: 'rel1'
    })
    expect(result).toEqual({ id: 'rel1' })
  })
})
