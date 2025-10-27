export const GET_EVENT_TRIPS = `
  query {
    event_trips {
      id
      event_id {
        id
        name
        // add more event fields as needed
      }
      item
      collection
      // If collection is a reference, you can expand it here as needed
      // collection_obj { ... } // Uncomment and specify fields if supported by your schema
    }
  }
`
