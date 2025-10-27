# Carpool Plan

## Objectives

- Organize carpools for events using Directus as backend
- Provide simple carpool coordination without complex user management
- Leverage Directus GraphQL API for all data operations

## Features

- Carpool creation and management via Directus GraphQL
- Event-based ride coordination
- Simple contact information sharing

## Directus Collections

- event - describes events requiring carpools
- event_trips - describes trips associated with events
- destination_trip - describes trips to event destinations
- destination_trip_rides - describes rides associated with destination trips
- return_trip - describes trips returning from events
- return_trip_rides - describes rides associated with return trips
- ride_driver - describes driver information for each ride
- ride - describes individual rides with driver, vehicle, and passenger details
- trip_ride - describes the association between trips and rides
- trip_ride_riders - describes passengers/riders associated with specific trip rides

GraphQL will be used to interact with these collections for creating, reading, updating, and deleting carpool data.

## GraphQL Operations

### Queries

- Fetch carpools for a specific event
- Retrieve carpool details including driver and participants
- List available carpools with filtering options

### Mutations

- Create new carpool entries
- Update existing carpool information
- Delete carpools as needed

## Milestones

### Milestone 1: Directus Integration and Data Models

- [ ] Set up Directus GraphQL endpoint configuration
- [ ] Create carpool data models in Directus
- [ ] Implement GraphQL client for data access
- [ ] Set up basic authentication with Directus

### Milestone 2: Carpool Creation and Management

- [ ] Implement carpool creation form using Directus GraphQL mutations
- [ ] Add carpool listing page with GraphQL queries
- [ ] Enable carpool editing and deletion through GraphQL
- [ ] Implement real-time updates via GraphQL subscriptions

### Milestone 3: Event Integration and Coordination

- [ ] Connect carpools to Directus event system
- [ ] Add event-specific carpool filtering
- [ ] Implement basic contact sharing (no profiles needed)

### Milestone 4: Enhanced Features

- [ ] Add carpool capacity management
- [ ] Implement basic ride status tracking
- [ ] Create simple notification system integration

## Timeline

- Week 1-2: Directus Integration and Data Models
- Week 3-4: Carpool Creation and Management
- Week 5-6: Event Integration and Coordination
- Week 7-8: Enhanced Features and Testing

## Resources

- Development Team: 2 developers, 1 designer
- Tools: Svelte/Express, Directus GraphQL API, Apollo Client/GraphQL-Request

## Risks and Mitigations

- Risk: Directus API rate limiting
  - Mitigation: Implement proper caching and request optimization
- Risk: GraphQL query complexity
  - Mitigation: Use query depth limiting and implement efficient queries
- Risk: Data synchronization issues
  - Mitigation: Implement proper error handling and retry mechanisms
- Risk: Limited authentication without user management
  - Mitigation: Use simple token-based access or public read access with moderated writes

## Evaluation

- Directus API performance monitoring
- GraphQL query optimization analysis
- Usage analytics through Directus insights
- Regular code reviews and architecture assessments

## Technical Architecture

### Data Models in Directus

- **Carpools**: id, event_id, driver_name, driver_contact, departure_time, departure_location, available_seats, notes
- **Events**: id, name, date, location, description
- **Carpool_Participants**: id, carpool_id, participant_name, participant_contact, pickup_location

### GraphQL Integration

- Use Apollo Client or graphql-request for API calls
- Implement query caching for better performance
- Use GraphQL subscriptions for real-time updates
- Leverage Directus auto-generated GraphQL schema

## Future Enhancements

- Mobile-responsive design optimization
- Integration with calendar systems
- SMS/email notifications via Directus flows
- Export carpool data for event organizers
