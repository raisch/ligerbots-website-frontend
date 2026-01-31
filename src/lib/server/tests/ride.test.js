import { beforeEach, describe, expect, it, vi } from 'vitest'

// Shared mock Directus client
const mockClient = {
  query: vi.fn()
}

// Auto-mock Directus client wrapper
vi.mock('$lib/server/client')

// Mock GraphQL queries/mutations for rides (Directus `ride` collection)
vi.mock('$lib/server/graphql/ride.js', () => ({
  __esModule: true,
  GET_ALL_RIDES_QUERY: 'GET_ALL_RIDES_QUERY',
  GET_RIDE_BY_ID_QUERY: 'GET_RIDE_BY_ID_QUERY',
  CREATE_RIDE_MUTATION: 'CREATE_RIDE_MUTATION',
  UPDATE_RIDE_MUTATION: 'UPDATE_RIDE_MUTATION',
  DELETE_RIDE_MUTATION: 'DELETE_RIDE_MUTATION'
}))

// Mock Joi model schema for rides
vi.mock('$lib/server/models/ride.model.js', () => ({
  __esModule: true,
  default: {
    validate: vi.fn()
  }
}))

import Ride from '$lib/server/ride.js'
import { getBackendClient } from '$lib/server/client'
import {
  GET_ALL_RIDES_QUERY,
  GET_RIDE_BY_ID_QUERY,
  CREATE_RIDE_MUTATION,
  UPDATE_RIDE_MUTATION,
  DELETE_RIDE_MUTATION
} from '$lib/server/graphql/ride.js'
import RideModelSchema from '$lib/server/models/ride.model.js'

const mockGetBackendClient = /** @type {import('vitest').Mock} */ (getBackendClient)
const mockRideValidate = /** @type {import('vitest').Mock} */ (RideModelSchema.validate)

beforeEach(() => {
  mockClient.query.mockReset()
  mockGetBackendClient.mockReset()
  mockGetBackendClient.mockResolvedValue(mockClient)
  mockRideValidate.mockReset()
})

describe('Ride.getAllRides', () => {
  it('returns rides and validates each ride', async () => {
    mockClient.query.mockResolvedValueOnce({
      ride: [
        { id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 },
        { id: 'r2', name: 'Ride 2', vehicle_type: 'Van', seats: 7 }
      ]
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const result = await Ride.getAllRides()

    expect(mockGetBackendClient).toHaveBeenCalled()
    expect(mockClient.query).toHaveBeenCalledWith(GET_ALL_RIDES_QUERY, {})

    expect(result).toEqual([
      { id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 },
      { id: 'r2', name: 'Ride 2', vehicle_type: 'Van', seats: 7 }
    ])

    expect(mockRideValidate).toHaveBeenCalledTimes(2)
    expect(mockRideValidate).toHaveBeenNthCalledWith(
      1,
      { id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 },
      { allowUnknown: true }
    )
    expect(mockRideValidate).toHaveBeenNthCalledWith(
      2,
      { id: 'r2', name: 'Ride 2', vehicle_type: 'Van', seats: 7 },
      { allowUnknown: true }
    )
  })

  it('returns empty array when backend returns no rides', async () => {
    mockClient.query.mockResolvedValueOnce({})

    const result = await Ride.getAllRides()

    expect(result).toEqual([])
    expect(mockRideValidate).not.toHaveBeenCalled()
  })
})

describe('Ride.getRideById', () => {
  it('throws when rideId is missing', async () => {
    // @ts-expect-error testing missing rideId
    await expect(Ride.getRideById()).rejects.toThrow('Ride ID is required')
  })

  it('fetches a ride by id and validates it', async () => {
    mockClient.query.mockResolvedValueOnce({
      ride_by_id: { id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 }
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const result = await Ride.getRideById('r1')

    expect(mockClient.query).toHaveBeenCalledWith(GET_RIDE_BY_ID_QUERY, { id: 'r1' })
    expect(result).toEqual({ id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 })
    expect(mockRideValidate).toHaveBeenCalledWith(
      { id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 },
      { allowUnknown: true }
    )
  })
})

describe('Ride.createRide', () => {
  it('throws when ride data is missing', async () => {
    // @ts-expect-error testing missing data
    await expect(Ride.createRide()).rejects.toThrow('Ride data is required')
  })

  it('creates a ride using the mutation and validates result', async () => {
    mockClient.query.mockResolvedValueOnce({
      create_ride_item: { id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 }
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const rideData = {
      name: 'Ride 1',
      vehicle_type: 'Car',
      seats: 4
    }

    const result = await Ride.createRide(rideData)

    expect(mockClient.query).toHaveBeenCalledWith(CREATE_RIDE_MUTATION, {
      ride: rideData
    })

    expect(result).toEqual({ id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 })
    expect(mockRideValidate).toHaveBeenCalledWith(
      { id: 'r1', name: 'Ride 1', vehicle_type: 'Car', seats: 4 },
      { allowUnknown: true }
    )
  })
})

describe('Ride.updateRide', () => {
  it('throws when ride data is missing', async () => {
    // @ts-expect-error testing missing data
    await expect(Ride.updateRide()).rejects.toThrow('Ride data with valid id is required')
  })

  it('throws when ride id is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Ride.updateRide({})).rejects.toThrow('Ride data with valid id is required')
  })

  it('updates a ride and validates result', async () => {
    mockClient.query.mockResolvedValueOnce({
      update_ride_item: { id: 'r1', name: 'Updated Ride', vehicle_type: 'Van', seats: 6 }
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const rideData = {
      id: 'r1',
      name: 'Updated Ride',
      vehicle_type: 'Van',
      seats: 6
    }

    const result = await Ride.updateRide(rideData)

    expect(mockClient.query).toHaveBeenCalledWith(UPDATE_RIDE_MUTATION, {
      id: 'r1',
      ride: {
        name: 'Updated Ride',
        vehicle_type: 'Van',
        seats: 6
      }
    })

    expect(result).toEqual({ id: 'r1', name: 'Updated Ride', vehicle_type: 'Van', seats: 6 })
    expect(mockRideValidate).toHaveBeenCalledWith(
      { id: 'r1', name: 'Updated Ride', vehicle_type: 'Van', seats: 6 },
      { allowUnknown: true }
    )
  })
})

describe('Ride.deleteRide', () => {
  it('throws when rideId is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Ride.deleteRide()).rejects.toThrow('Ride ID is required')
  })

  it('deletes a ride using the mutation', async () => {
    mockClient.query.mockResolvedValueOnce({
      delete_ride_item: { id: 'r1' }
    })

    const result = await Ride.deleteRide('r1')

    expect(mockClient.query).toHaveBeenCalledWith(DELETE_RIDE_MUTATION, { id: 'r1' })
    expect(result).toEqual({ id: 'r1' })
  })
})
