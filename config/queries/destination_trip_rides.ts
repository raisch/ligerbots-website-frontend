export const GET_DESTINATION_TRIP_RIDES = `
  query {
    destination_trip_rides {
      id
      destination_trip_id
      item
      collection
      // If collection is a reference, you can expand it here as needed
      // collection_obj { ... } // Uncomment and specify fields if supported by your schema
      ride {
        id
        // add more ride fields as needed
      }
    }
  }
`
