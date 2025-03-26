const queries = {
  EVENT_QUERY: `{
    event(filter: { status: { _eq: "{{status}}" } }) {
        id
        name
        status
        description
        start_date
        end_date
        location
    }
  }`,
  EVENT_BY_ID_QUERY: `{
    event_by_id(id: "{{id}}") {
          id
          start_date
          end_date
          name
          description
          status
          location
          trips {
              item {
                  ... on destination_trip {
                      destination
                      departs_from
                      departs_on
                      departs_at
                      status
                      rides {
                          item {
                              ... on trip_ride {
                                  id
                                  ride {
                                      vehicle_type
                                      name
                                      seats
                                      driver {
                                          item {
                                              ... on users {
                                                  id
                                                  firstname
                                                  lastname
                                                  email_address
                                                  phone_number
                                                  photo {
                                                      id
                                                      filename_disk
                                                      filename_download
                                                  }
                                              }
                                          }
                                          id
                                          collection
                                      }
                                      id
                                  }
                                  riders {
                                      item {
                                          ... on users {
                                              id
                                              firstname
                                              lastname
                                              email_address
                                              phone_number
                                              photo {
                                                  id
                                                  filename_disk
                                                  filename_download
                                              }
                                          }
                                      }
                                      id
                                      collection
                                  }
                                  id
                                  riders_func {
                                      count
                                  }
                              }
                          }
                          collection
                      }
                      id
                      status
                      rides_func {
                          count
                      }
                  }
                  ... on return_trip {
                      id
                      status
                      destination
                      departs_from
                      departs_on
                      departs_at
                      rides {
                          item {
                              ... on trip_ride {
                                  id
                                  ride {
                                      vehicle_type
                                      name
                                      seats
                                      driver {
                                          item {
                                              ... on users {
                                                  id
                                                  firstname
                                                  lastname
                                                  email_address
                                                  phone_number
                                                  photo {
                                                      id
                                                      filename_disk
                                                      filename_download
                                                  }
                                              }
                                          }
                                          id
                                          collection
                                      }
                                      id
                                  }
                                  riders {
                                      item {
                                          ... on users {
                                              id
                                              firstname
                                              lastname
                                              email_address
                                              phone_number
                                              photo {
                                                  id
                                                  filename_disk
                                                  filename_download
                                              }
                                          }
                                      }
                                      id
                                      collection
                                  }
                                  id
                                  riders_func {
                                      count
                                  }
                              }
                          }
                          collection
                      }
                      id
                      status
                      rides_func {
                          count
                      }
                  }
              }
              id
              collection
          }
      }
  }`,
  // GraphQL mutation for creating a new event
  CREATE_EVENT_MUTATION: `mutation ($event: create_event_input!) {
    create_event_item(data: $event) {
      id
      name
      status
      description
      start_date
      end_date
      location
    }
}`,

  // GraphQL mutation for updating an existing event
  UPDATE_EVENT_MUTATION: `mutation ($id: ID!, $event: update_event_input!) {
    update_event_item(id: $id, data: $event) {
      id
      name
      status
      description
      start_date
      end_date
      location
    }
}`,

  // GraphQL mutation for deleting an event
  DELETE_EVENT_MUTATION: `mutation ($id: ID!) {
    delete_event_item(id: $id) {
      id
    }
}`,

  // GraphQL mutation for creating a destination trip
  CREATE_DESTINATION_TRIP_MUTATION: `mutation ($trip: create_destination_trip_input!) {
    create_destination_trip_item(data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
      event {
        id
      }
    }
}`,

  // GraphQL mutation for updating a destination trip
  UPDATE_DESTINATION_TRIP_MUTATION: `mutation ($id: ID!, $trip: update_destination_trip_input!) {
    update_destination_trip_item(id: $id, data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
    }
}`,

  // GraphQL mutation for creating a return trip
  CREATE_RETURN_TRIP_MUTATION: `mutation ($trip: create_return_trip_input!) {
    create_return_trip_item(data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
      event {
        id
      }
    }
}`,

  // GraphQL mutation for updating a return trip
  UPDATE_RETURN_TRIP_MUTATION: `mutation ($id: ID!, $trip: update_return_trip_input!) {
    update_return_trip_item(id: $id, data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
    }
}`,

  // GraphQL mutation for deleting a trip (works for both destination and return trips)
  DELETE_TRIP_MUTATION: `mutation ($collection: String!, $id: ID!) {
    delete_item(collection: $collection, id: $id) {
      id
    }
}`,

  // GraphQL mutation for creating a trip ride
  CREATE_TRIP_RIDE_MUTATION: `mutation ($tripRide: create_trip_ride_input!) {
    create_trip_ride_item(data: $tripRide) {
      id
      ride {
        id
        vehicle_type
        name
        seats
      }
      trip {
        id
        collection
      }
    }
}`,

  // GraphQL mutation for updating a trip ride
  UPDATE_TRIP_RIDE_MUTATION: `mutation ($id: ID!, $tripRide: update_trip_ride_input!) {
    update_trip_ride_item(id: $id, data: $tripRide) {
      id
      ride {
        id
        vehicle_type
        name
        seats
      }
    }
}`,

  // GraphQL mutation for deleting a trip ride
  DELETE_TRIP_RIDE_MUTATION: `mutation ($id: ID!) {
    delete_trip_ride_item(id: $id) {
      id
    }
}`,

  // GraphQL mutation for adding a rider to a trip ride
  ADD_RIDER_MUTATION: `mutation ($tripRideId: ID!, $userId: ID!) {
    update_trip_ride_item(
      id: $tripRideId,
      data: {
        riders: {
          create: [{
            item: {
              id: $userId,
              collection: "users"
            }
          }]
        }
      }
    ) {
      id
      riders_func {
        count
      }
    }
}`,

  // GraphQL mutation for removing a rider from a trip ride
  REMOVE_RIDER_MUTATION: `mutation ($tripRideId: ID!, $relationshipId: ID!) {
    update_trip_ride_item(
      id: $tripRideId,
      data: {
        riders: {
          delete: [$relationshipId]
        }
      }
    ) {
      id
      riders_func {
        count
      }
    }
  }`
}

export default queries
