import { beforeEach, describe, expect, it, vi } from 'vitest'

// Shared mock Directus client
const mockClient = {
  query: vi.fn()
}

// Auto-mock Directus client wrapper
vi.mock('$lib/server/client')

// Mock GraphQL operations for the `ride` (vehicle) collection
vi.mock('$lib/server/graphql/ride.js', () => ({
  __esModule: true,
  GET_ALL_RIDES_QUERY: 'GET_ALL_RIDES_QUERY',
  GET_RIDE_BY_ID_QUERY: 'GET_RIDE_BY_ID_QUERY',
  CREATE_RIDE_MUTATION: 'CREATE_RIDE_MUTATION',
  UPDATE_RIDE_MUTATION: 'UPDATE_RIDE_MUTATION',
  DELETE_RIDE_MUTATION: 'DELETE_RIDE_MUTATION'
}))

// Mock Joi model schema for vehicles
vi.mock('$lib/server/models/ride.model.js', () => ({
  __esModule: true,
  default: {
    validate: vi.fn()
  }
}))

import Vehicle from '$lib/server/vehicle.js'
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

describe('Vehicle.getAllVehicles', () => {
  it('returns vehicles and validates each vehicle', async () => {
    mockClient.query.mockResolvedValueOnce({
      ride: [
        { id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 },
        { id: 'v2', name: 'Vehicle 2', vehicle_type: 'Van', seats: 7 }
      ]
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const result = await Vehicle.getAllVehicles()

    expect(mockGetBackendClient).toHaveBeenCalled()
    expect(mockClient.query).toHaveBeenCalledWith(GET_ALL_RIDES_QUERY, {})

    expect(result).toEqual([
      { id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 },
      { id: 'v2', name: 'Vehicle 2', vehicle_type: 'Van', seats: 7 }
    ])

    expect(mockRideValidate).toHaveBeenCalledTimes(2)
    expect(mockRideValidate).toHaveBeenNthCalledWith(
      1,
      { id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 },
      { allowUnknown: true }
    )
    expect(mockRideValidate).toHaveBeenNthCalledWith(
      2,
      { id: 'v2', name: 'Vehicle 2', vehicle_type: 'Van', seats: 7 },
      { allowUnknown: true }
    )
  })

  it('returns empty array when backend returns no vehicles', async () => {
    mockClient.query.mockResolvedValueOnce({})

    const result = await Vehicle.getAllVehicles()

    expect(result).toEqual([])
    expect(mockRideValidate).not.toHaveBeenCalled()
  })
})

describe('Vehicle.getVehicleById', () => {
  it('throws when vehicleId is missing', async () => {
    // @ts-expect-error testing missing vehicleId
    await expect(Vehicle.getVehicleById()).rejects.toThrow('Vehicle ID is required')
  })

  it('fetches a vehicle by id and validates it', async () => {
    mockClient.query.mockResolvedValueOnce({
      ride_by_id: { id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 }
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const result = await Vehicle.getVehicleById('v1')

    expect(mockClient.query).toHaveBeenCalledWith(GET_RIDE_BY_ID_QUERY, { id: 'v1' })
    expect(result).toEqual({ id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 })
    expect(mockRideValidate).toHaveBeenCalledWith(
      { id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 },
      { allowUnknown: true }
    )
  })
})

describe('Vehicle.createVehicle', () => {
  it('throws when vehicle data is missing', async () => {
    // @ts-expect-error testing missing data
    await expect(Vehicle.createVehicle()).rejects.toThrow('Vehicle data is required')
  })

  it('throws when vehicle name is missing', async () => {
    // @ts-expect-error testing missing name
    await expect(
      Vehicle.createVehicle({
        seats: 4
      })
    ).rejects.toThrow('Vehicle name is required')
  })

  it('throws when vehicle seats are missing', async () => {
    // @ts-expect-error testing missing seats
    await expect(
      Vehicle.createVehicle({
        name: 'Vehicle 1'
      })
    ).rejects.toThrow('Vehicle seats are required')
  })

  it('creates a vehicle and validates result', async () => {
    mockClient.query.mockResolvedValueOnce({
      create_ride_item: { id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 }
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const vehicleData = {
      name: 'Vehicle 1',
      vehicle_type: 'Car',
      seats: 4
    }

    const result = await Vehicle.createVehicle(vehicleData)

    expect(mockClient.query).toHaveBeenCalledWith(CREATE_RIDE_MUTATION, {
      ride: vehicleData
    })

    expect(result).toEqual({ id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 })
    expect(mockRideValidate).toHaveBeenCalledWith(
      { id: 'v1', name: 'Vehicle 1', vehicle_type: 'Car', seats: 4 },
      { allowUnknown: true }
    )
  })
})

describe('Vehicle.updateVehicle', () => {
  it('throws when vehicle data is missing', async () => {
    // @ts-expect-error testing missing data
    await expect(Vehicle.updateVehicle()).rejects.toThrow(
      'Vehicle data with valid id is required'
    )
  })

  it('throws when vehicle id is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Vehicle.updateVehicle({})).rejects.toThrow(
      'Vehicle data with valid id is required'
    )
  })

  it('updates a vehicle and validates result', async () => {
    mockClient.query.mockResolvedValueOnce({
      update_ride_item: { id: 'v1', name: 'Updated Vehicle', vehicle_type: 'Van', seats: 6 }
    })
    mockRideValidate.mockReturnValue({ error: undefined, value: {} })

    const vehicleData = {
      id: 'v1',
      name: 'Updated Vehicle',
      vehicle_type: 'Van',
      seats: 6
    }

    const result = await Vehicle.updateVehicle(vehicleData)

    expect(mockClient.query).toHaveBeenCalledWith(UPDATE_RIDE_MUTATION, {
      id: 'v1',
      ride: {
        name: 'Updated Vehicle',
        vehicle_type: 'Van',
        seats: 6
      }
    })

    expect(result).toEqual({
      id: 'v1',
      name: 'Updated Vehicle',
      vehicle_type: 'Van',
      seats: 6
    })
    expect(mockRideValidate).toHaveBeenCalledWith(
      {
        id: 'v1',
        name: 'Updated Vehicle',
        vehicle_type: 'Van',
        seats: 6
      },
      { allowUnknown: true }
    )
  })
})

describe('Vehicle.deleteVehicle', () => {
  it('throws when vehicleId is missing', async () => {
    // @ts-expect-error testing missing id
    await expect(Vehicle.deleteVehicle()).rejects.toThrow('Vehicle ID is required')
  })

  it('deletes a vehicle using the mutation', async () => {
    mockClient.query.mockResolvedValueOnce({
      delete_ride_item: { id: 'v1' }
    })

    const result = await Vehicle.deleteVehicle('v1')

    expect(mockClient.query).toHaveBeenCalledWith(DELETE_RIDE_MUTATION, { id: 'v1' })
    expect(result).toEqual({ id: 'v1' })
  })
})

