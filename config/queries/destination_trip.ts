export const GET_DESTINATION_TRIPS = `
  query {
    destination_trip {
      id
      status
      destination
      departs_from
      departs_on
      departs_at
      arrives_at
      rides {
        id
        destination_trip_id
        item
        collection
        ride {
          id
          // add more ride fields as needed
        }
      }
    }
  }
`
