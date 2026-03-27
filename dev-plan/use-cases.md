# Carpool System Use Cases

## Overview
The Ligerbots website carpool system enables team members to organize transportation<br/>
to and from robotics events. The system is built with SvelteKit and follows a hierarchical<br/>
structure: Events → Trips → Rides → Riders.

## System Architecture
- **Frontend**: SvelteKit pages and components
- **Backend**: Directus CMS with GraphQL API
- **Route Structure**: 
  - `/carpool` - List all active carpool events
  - `/carpool/create` - Create new event (admin only)
  - `/carpool/admin` - Admin dashboard for vehicle management
  - `/carpool/[id]` - Event details with associated trips
  - `/carpool/[id]/edit` - Edit event details (admin only)
  - `/carpool/ride/[id]/[triptype]` - Trip details with rides
  - `/carpool/ride/[id]/[triptype]/edit` - Edit trip details (admin only)
  - `/carpool/ride/[id]/[triptype]/vehicle` - Vehicle/ride management
  - `/carpool/vehicle/[id]` - Individual vehicle details

## Data Model Hierarchy
```
Event
├── Basic Info (name, description, dates, location)
└── Trips[]
    ├── destination_trip (to event)
    └── return_trip (from event)
        └── Rides[]
            ├── Vehicle info (type, name, seats)
            ├── Driver details
            └── Riders[]
```

## Global Business Rules

### GBR-001: One Seat Per Trip Type Limitation
**Rule**: No user can reserve more than one seat per trip type within the same event.

**Details**:
- A user may reserve at most **one seat** in all `destination_trip` rides for an event
- A user may reserve at most **one seat** in all `return_trip` rides for an event
- Users cannot join multiple rides of the same trip type (e.g., cannot join two different "to event" rides)
- System must validate and prevent multiple reservations during the join process
- If a user attempts to join a second ride of the same type, system should display error message

**Enforcement Points**:
- `POST /api/triprides/[id]/join` - Validate no existing reservation for trip type
- Frontend ride selection interface - Disable "Join" buttons for same trip type
- Admin interface - Display warnings for duplicate reservations

---

### GBR-002: Mandatory Opt-Out Requirement
**Rule**: If a user doesn't wish to ride in one direction, they MUST explicitly opt-out from all trips in that direction.

**Details**:
- Users who don't need transportation in a specific direction must actively opt-out
- Opt-out prevents the user from accidentally being assigned or considered for rides
- Opt-out must be recorded per trip type (destination_trip vs return_trip) per event
- System should track opt-out status and display it clearly in user interfaces
- Users can change their opt-out status, but it requires deliberate action

**Implementation Requirements**:
- Add opt-out status field to user-event-trip relationships
- Create opt-out API endpoints: `POST /api/events/[id]/trips/[triptype]/opt-out`
- Create opt-in API endpoints: `POST /api/events/[id]/trips/[triptype]/opt-in`
- Display opt-out status prominently in trip listings
- Require opt-out confirmation dialog to prevent accidental selection

**Enforcement Points**:
- Event detail pages must show opt-out options for each trip type
- Ride management interfaces must respect opt-out status
- Admin dashboards should display opt-out statistics
- Notification systems should exclude opted-out users from ride announcements

---

### GBR-003: Business Rule Validation Matrix

| Scenario | Destination Trip | Return Trip | Action Required |
|----------|-----------------|-------------|-----------------|
| User wants both directions | Join 1 ride max | Join 1 ride max | Normal operation |
| User wants destination only | Join 1 ride max | **MUST opt-out** | Explicit opt-out required |
| User wants return only | **MUST opt-out** | Join 1 ride max | Explicit opt-out required |
| User wants neither direction | **MUST opt-out** | **MUST opt-out** | Explicit opt-out required |
| User joined destination ride | ✅ Joined | Available to join 1 OR opt-out | System tracks status |
| User opted out of destination | ❌ Opted out | Available to join 1 OR opt-out | System prevents join attempts |

---

## Use Cases

### UC-001: View Active Carpool Events
**Actor**: Team Member  
**Goal**: Browse available carpool events  
**Endpoint**: `GET /carpool`

**Primary Flow**:
1. User navigates to `/carpool`
2. System loads all published events via `Event.getEvents()`
3. System displays events in a card layout showing:
   - Event name and description
   - Start and end dates
   - Event location
   - "View Trips" button
4. User can click on event name or button to view details

**Business Rules**:
- Only events with status "published" are displayed
- Events are displayed in card format for easy browsing

**Implementation Status**: ✅ Completed

---

### UC-002: View Event Details and Trips
**Actor**: Team Member  
**Goal**: View specific event details and associated carpool trips  
**Endpoint**: `GET /carpool/[id]`

**Primary Flow**:
1. User clicks on an event from the events list
2. System loads event details via `Event.getEventById(id)`
3. System displays comprehensive event information:
   - Event metadata (name, description, dates, location)
   - List of associated trips categorized by:
     - **To Event** (destination_trip) - Green badge
     - **From Event** (return_trip) - Red badge
   - Each trip shows departure details (from, date, time, destination)
4. User can view trip details (currently shows alert placeholder)

**Business Rules**:
- Trips are categorized and color-coded by type
- Each trip displays complete departure information
- Unknown trip types show gray "Unknown" badge

**Implementation Status**: ✅ Mostly Complete (trip detail links pending)

---

### UC-003: View Trip Details and Available Rides
**Actor**: Team Member  
**Goal**: View specific trip details and available rides  
**Endpoint**: `GET /carpool/trip/[id]`

**Primary Flow**:
1. User navigates to trip details from event page
2. System loads trip information including:
   - Trip type (destination/return)
   - Departure location, date, and time
   - Destination
   - List of available rides with rider counts
3. System displays rides with "View Details" option
4. User can select a specific ride to view more details

**Business Rules**:
- Trip details show complete departure and destination info
- Rides show current rider count vs. capacity
- Each ride can be expanded for full details

**Implementation Status**: 🚧 In Development (using placeholder data)

---

### UC-004: View Ride Details and Manage Participation
**Actor**: Team Member  
**Goal**: View specific ride details and join/leave ride  
**Endpoint**: `GET /carpool/trip/ride/[id]`

**Primary Flow**:
1. User clicks on a specific ride from trip listing
2. System displays detailed ride information:
   - Vehicle details (type, name, seat capacity)
   - Driver information (name, contact, photo)
   - Current riders list with contact details
   - Available seats remaining
3. User can perform actions:
   - Join ride (if seats available)
   - Leave ride (if currently enrolled)
   - Contact driver or riders

**Business Rules**:
- Users can only join if seats are available
- Driver information is always visible
- Contact information shown for coordination

**Implementation Status**: ❌ Placeholder Only

---

### UC-005: Create New Carpool Event (Admin)
**Actor**: Administrator  
**Goal**: Create a new carpool event for upcoming robotics activities  
**Endpoint**: `POST /api/events`

**Primary Flow**:
1. Admin navigates to `/carpool/create`
2. System verifies admin authentication via sessionStorage
3. Admin enters event details:
   - Event name and description
   - Start and end dates
   - Event location
   - Event status (draft/published)
4. System validates input data
5. System creates event via `Event.createEvent()` API call
6. System redirects to event edit page for further setup

**Business Rules**:
- Only administrators can create events
- All required fields must be completed
- Events default to "draft" status
- Start date must be before end date
- Non-admin users are redirected to main carpool page

**Implementation Status**: ✅ Completed

---

### UC-006: Create Trip for Event (Driver/Admin)
**Actor**: Driver or Administrator  
**Goal**: Create a carpool trip associated with an event  
**Endpoint**: `POST /api/carpool/trips` (Not Yet Implemented)

**Primary Flow**:
1. User accesses trip creation for a specific event
2. User selects trip type (to event/from event)
3. User enters trip details:
   - Departure location and time
   - Destination (auto-populated for event trips)
   - Vehicle information
   - Available seats
4. System creates trip and associates with event
5. System creates initial ride with user as driver

**Business Rules**:
- Trip must be associated with a valid event
- Departure time must be reasonable for event timing
- Driver automatically becomes first rider
- Seat count must be realistic (1-8 typical range)

**Implementation Status**: ❌ Not Implemented

---

### UC-007: Join Carpool Ride
**Actor**: Team Member  
**Goal**: Join an existing carpool ride  
**Endpoint**: `POST /api/triprides/[id]/join`

**Primary Flow**:
1. User views ride details with available seats
2. User clicks "Join Ride" button
3. System verifies user authentication
4. **System validates Global Business Rules (GBR-001, GBR-002)**:
   - Check if user already has a reservation for this trip type
   - Verify user hasn't opted out of this trip type
5. System checks seat availability via TripRide.addRider()
6. System adds user to ride participants
7. System sends confirmation to user and driver
8. System updates available seat count

**Alternate Flows**:
- **No Seats Available**: System shows "Ride Full" message
- **Already Joined Same Trip Type**: System shows "You already have a reservation for this trip direction" (GBR-001)
- **User Opted Out**: System shows "You have opted out of this trip direction. Please opt-in first." (GBR-002)
- **Missing User ID**: System returns 400 error

**Business Rules**:
- Users must be authenticated to join rides
- Cannot exceed vehicle seat capacity
- **Cannot join multiple rides of the same trip type per event (GBR-001)**
- **Cannot join if user has opted out of this trip type (GBR-002)**
- Driver and participants receive notifications
- User ID is required in request payload
- System must validate business rules before processing join request

**Implementation Status**: ✅ Completed

---

### UC-008: Leave Carpool Ride
**Actor**: Team Member  
**Goal**: Remove themselves from a carpool ride  
**Endpoint**: `POST /api/triprides/[id]/leave`

**Primary Flow**:
1. User views their current ride enrollment
2. User clicks "Leave Ride" button
3. System requests confirmation
4. System removes user from ride participants via TripRide.removeRider()
5. System notifies driver of change
6. System updates available seat count

**Business Rules**:
- Users can only leave rides they've joined
- Driver cannot leave their own ride (must cancel instead)
- Participants and driver receive notifications
- Reasonable time limits for leaving (e.g., not last minute)
- User ID is required in request payload

**Implementation Status**: ✅ Completed

---

### UC-009: Cancel Carpool Ride (Driver)
**Actor**: Driver  
**Goal**: Cancel a carpool ride they're offering  
**Endpoint**: `DELETE /api/carpool/rides/[id]` (Not Yet Implemented)

**Primary Flow**:
1. Driver accesses their ride management
2. Driver selects ride to cancel
3. System shows current participants
4. Driver confirms cancellation
5. System notifies all participants
6. System removes ride from trip listings
7. System suggests alternative rides if available

**Business Rules**:
- Only ride driver can cancel rides
- All participants must be notified
- Cancellation should provide reasonable notice
- System suggests alternatives when possible

**Implementation Status**: ❌ Not Implemented

---

### UC-010: Search and Filter Carpool Options
**Actor**: Team Member  
**Goal**: Find relevant carpool options based on criteria  
**Endpoint**: `GET /api/carpool/search` (Not Yet Implemented)

**Primary Flow**:
1. User accesses carpool search interface
2. User sets filter criteria:
   - Event date range
   - Departure location proximity
   - Trip direction (to/from event)
   - Available seats only
3. System filters available trips and rides
4. System displays matching results
5. User can refine filters or select rides

**Business Rules**:
- Search includes only future events/trips
- Location filtering uses proximity algorithms
- Results prioritize upcoming trips
- Filters remember user preferences

**Implementation Status**: ❌ Not Implemented

---

### UC-011: Edit Carpool Event (Admin)
**Actor**: Administrator  
**Goal**: Modify existing carpool event details  
**Endpoint**: `POST /api/events/[id]`

**Primary Flow**:
1. Admin navigates to `/carpool/[id]/edit`
2. System verifies admin authentication
3. System loads current event data
4. Admin modifies event fields:
   - Name, description, dates, location
   - Event status (draft/published/archived)
5. System validates changes and updates event
6. System provides success confirmation
7. Admin can also archive the event via separate action

**Business Rules**:
- Only administrators can edit events
- All required fields must remain completed
- Status changes affect visibility to users
- Archiving removes event from active listings

**Implementation Status**: ✅ Completed

---

### UC-012: Admin Vehicle Management
**Actor**: Administrator  
**Goal**: Manage fleet of available vehicles/rides  
**Endpoint**: `GET /carpool/admin`, `POST /api/rides`, `PUT /api/rides/[id]`

**Primary Flow**:
1. Admin navigates to `/carpool/admin`
2. System displays existing vehicles/rides with details:
   - Vehicle name, type, seat count
   - Assigned driver information
3. Admin can create new vehicles or edit existing ones
4. System validates vehicle data (seats, driver assignment)
5. Changes are saved to backend via Ride.createRide() or updateRide()

**Business Rules**:
- Only administrators can manage vehicles
- Vehicle seat count must be realistic (1-8 range)
- Driver must be valid user from system
- Vehicle names should be unique for clarity

**Implementation Status**: ✅ Completed

---

### UC-013: Enhanced Trip Details with Admin Controls
**Actor**: Team Member / Administrator  
**Goal**: View comprehensive trip details with administrative options  
**Endpoint**: `GET /carpool/ride/[id]/[triptype]`

**Primary Flow**:
1. User navigates to trip details via improved routing
2. System loads trip data with type parameter (destination_trip/return_trip)
3. System displays enhanced trip information:
   - Trip type badge (To Event/From Event)
   - Departure details with formatted dates/times
   - Current trip status
   - List of associated rides
4. Admin users see additional "Edit Trip" button
5. Users can navigate to ride management interface

**Business Rules**:
- Trip type determines display styling and labels
- Admin controls only visible to authenticated administrators
- Date/time formatting provides user-friendly display
- Ride count shows current capacity status

**Implementation Status**: ✅ Completed

---

### UC-014: Trip Ride Management
**Actor**: Administrator / Driver  
**Goal**: Manage individual rides within trips  
**Endpoint**: `GET /api/triprides/[id]`, `POST /api/triprides`, `PUT /api/triprides/[id]`

**Primary Flow**:
1. User accesses trip ride management interface
2. System loads trip ride details via TripRide.getTripRideById()
3. System displays:
   - Vehicle information and capacity
   - Current rider list with details
   - Driver assignment
   - Available seat count
4. Authorized users can modify ride settings
5. System updates backend via TripRide API methods

**Business Rules**:
- Only ride drivers and admins can modify rides
- Rider capacity cannot exceed vehicle seats
- Driver information must be valid user
- Ride status affects availability to other users

**Implementation Status**: ✅ Backend Complete, Frontend Partial

---

### UC-015: Vehicle Details and Assignment
**Actor**: Administrator  
**Goal**: View and manage individual vehicle details  
**Endpoint**: `GET /carpool/vehicle/[id]`

**Primary Flow**:
1. Admin navigates to specific vehicle details
2. System displays comprehensive vehicle information:
   - Vehicle specifications (type, name, seats)
   - Current driver assignment
   - Usage history and availability
3. Admin can modify vehicle settings
4. System tracks vehicle utilization across events

**Business Rules**:
- Vehicle details are read-only for non-admins
- Driver assignments should be unique per vehicle
- Vehicle availability affects ride creation options
- Usage tracking helps with fleet management

**Implementation Status**: 🚧 In Development

---

### UC-016: Opt-Out from Trip Direction
**Actor**: Team Member  
**Goal**: Explicitly opt-out from transportation in a specific direction  
**Endpoint**: `POST /api/events/[id]/trips/[triptype]/opt-out`

**Primary Flow**:
1. User views event details showing both trip directions
2. User identifies they don't need transportation in one direction (to event OR from event)
3. User clicks "Opt-Out" button for the unwanted trip type
4. System displays confirmation dialog explaining opt-out implications
5. User confirms opt-out decision
6. System records opt-out status for user-event-triptype combination
7. System updates UI to reflect opt-out status
8. System prevents user from joining any rides in opted-out direction

**Business Rules (enforces GBR-002)**:
- Users MUST opt-out if they don't want transportation in a direction
- Opt-out is per trip type (destination_trip vs return_trip) per event
- Opt-out status is persistent until explicitly changed
- Opted-out users cannot join rides in that direction
- System must clearly display opt-out status in all relevant interfaces

**Implementation Status**: ❌ Not Yet Implemented

---

### UC-017: Opt-In to Previously Opted-Out Trip Direction  
**Actor**: Team Member  
**Goal**: Re-enable ability to join rides after previously opting out  
**Endpoint**: `POST /api/events/[id]/trips/[triptype]/opt-in`

**Primary Flow**:
1. User views event details where they previously opted out of a trip direction
2. User realizes they now need transportation in that direction
3. User clicks "Opt-In" button for the previously opted-out trip type
4. System displays confirmation dialog about rejoining transportation options
5. User confirms opt-in decision
6. System removes opt-out status for user-event-triptype combination
7. System updates UI to show available rides for that direction
8. User can now join rides in that direction (subject to GBR-001)

**Business Rules**:
- Users can change opt-out status at any time before event
- Opt-in immediately restores ability to join rides
- User still subject to one-seat-per-trip-type limit (GBR-001)
- System should log opt-out/opt-in changes for audit purposes

**Implementation Status**: ❌ Not Yet Implemented

---

### UC-018: View User Transportation Status
**Actor**: Team Member / Administrator  
**Goal**: View comprehensive transportation status across all trip directions  
**Endpoint**: `GET /carpool/[id]` (Enhanced), `GET /api/events/[id]/user-status`

**Primary Flow**:
1. User/Admin accesses event details
2. System displays user's current transportation status:
   - **Destination Trip**: Joined ride X | Opted out | Available to join
   - **Return Trip**: Joined ride Y | Opted out | Available to join  
3. System shows available actions based on status:
   - Join ride (if available and not opted out)
   - Leave current ride (if joined)
   - Opt-out (if not already opted out)
   - Opt-in (if previously opted out)
4. Admin view shows status for all users

**Business Rules**:
- Status display enforces visibility of GBR-001 and GBR-002 compliance
- Clear visual indicators for each possible state
- Admin view aggregates status for planning purposes
- Status updates in real-time as users make changes

**Implementation Status**: 🚧 Partial (needs opt-out status integration)

---

### UC-019: Fast Reservation (Quick Seat Assignment)
**Actor**: Team Member  
**Goal**: Quickly reserve the next available seat in a trip direction without choosing specific vehicle  
**Endpoint**: `POST /api/events/[id]/trips/[triptype]/fast-reserve`

**Primary Flow**:
1. User views event details showing available trip directions
2. User identifies they need transportation in a specific direction (to event OR from event)
3. User clicks "Quick Reserve" or "Reserve Next Available" button for desired trip type
4. System validates Global Business Rules:
   - Check user hasn't already reserved a seat for this trip type (GBR-001)
   - Verify user hasn't opted out of this trip type (GBR-002)
5. System searches for next available seat using algorithm:
   - Query all rides for the specified trip type and event
   - Filter rides with available seats (current riders < vehicle capacity)
   - Sort by priority criteria (departure time, ride creation date, etc.)
   - Select first available seat from prioritized list
6. System automatically assigns user to the selected ride
7. System sends confirmation with ride details (vehicle, driver, departure info)
8. System updates available seat count for assigned ride

**Alternate Flows**:
- **No Seats Available**: System displays "No available seats for [trip direction]. Please check back later or contact admin."
- **Already Reserved**: System shows "You already have a reservation for this trip direction" (GBR-001)
- **User Opted Out**: System shows "You have opted out of this trip direction. Please opt-in first." (GBR-002)
- **Multiple Equal Priority**: System selects based on secondary criteria (alphabetical vehicle name, etc.)

**Algorithm Details**:
```
FastReservationAlgorithm(eventId, tripType, userId):
1. availableRides = getRidesWithAvailableSeats(eventId, tripType)
2. if (availableRides.isEmpty()) return "NO_SEATS_AVAILABLE"
3. prioritizedRides = sortByPriority(availableRides, criteria=[
     earliestDepartureTime,     // Prefer rides leaving sooner
     mostSeatsRemaining,        // Prefer rides with more availability  
     creationDate,              // Prefer established rides
     vehicleName                // Tie-breaker: alphabetical
   ])
4. selectedRide = prioritizedRides[0]
5. addUserToRide(selectedRide.id, userId)
6. return rideDetails(selectedRide)
```

**Business Rules**:
- Must comply with GBR-001 (one seat per trip type per event)
- Must comply with GBR-002 (cannot reserve if opted out)
- Algorithm prioritizes optimal seat distribution across available rides
- Users receive detailed confirmation of their assigned ride
- System maintains audit trail of fast reservation assignments
- Fast reservations are treated identically to manual ride selections

**UI/UX Considerations**:
- "Quick Reserve" buttons prominently displayed next to each trip direction
- Loading state while system finds and assigns seat
- Clear confirmation modal showing assigned ride details
- Option to view/modify reservation after fast assignment
- Fallback to manual selection if user prefers specific ride

**Implementation Status**: ❌ Not Yet Implemented

---

## Technical Notes

### Current GraphQL Schema Usage
The system uses complex GraphQL queries to retrieve nested data:
- Events contain trips (destination_trip, return_trip)
- Trips contain rides with vehicle and driver information  
- Rides contain participant details with user information
- User data includes contact info and profile photos
- New server modules: Event, TripRide, Ride classes with dedicated methods
- GraphQL queries centralized in `/lib/server/graphql/event.js`
- Enhanced error handling and debugging throughout API layer

### Fast Reservation Algorithm Implementation
- **Performance Considerations**: Algorithm must efficiently query and sort available rides
- **Caching Strategy**: Consider caching available seat counts to reduce database queries
- **Concurrency Handling**: Implement optimistic locking to prevent race conditions during reservations
- **Priority Weighting**: Algorithm criteria should be configurable (departure time vs. seat availability)
- **Fallback Mechanisms**: Graceful degradation when no seats available or algorithm fails
- **Audit Trail**: Log all fast reservation decisions for analysis and debugging

### Authentication Requirements
- User authentication via sessionStorage for ride participation
- Admin privileges verified through `user.is_admin` flag
- Admin-only routes automatically redirect non-admin users
- Driver verification needed for ride creation and management
- Session-based authentication integrated throughout admin interface

### Notification System Requirements
- Email notifications for ride changes
- SMS notifications for urgent updates
- In-app notifications for ride coordination

### Mobile Considerations
- Responsive design for mobile access
- Touch-friendly interface for ride selection
- Quick access to driver/rider contact information

## Future Enhancements

### Phase 1 (Completion) - 🚧 In Progress
- ✅ Complete ride management API endpoints
- ✅ Admin authentication integration
- ✅ Vehicle fleet management system
- ❌ **Critical: Global Business Rules Implementation (GBR-001, GBR-002)**
- ❌ **Critical: Opt-out/Opt-in functionality (UC-016, UC-017)**
- ❌ **Critical: Business rule validation in join/leave operations**
- ❌ **High Priority: Fast Reservation System (UC-019)** - Improves user experience
- 🚧 Enhanced trip ride editing interface
- 🚧 Vehicle assignment optimization

### Phase 2 (Enhanced Features)
- Real-time ride updates with WebSocket integration
- GPS location sharing for coordination
- Ride rating and feedback system
- Advanced search and filtering capabilities
- Email/SMS notification system
- Mobile-responsive ride booking interface

### Phase 3 (Advanced Features)  
- Automatic ride matching algorithms based on location/preferences
- Integration with calendar systems (Google Calendar, Outlook)
- Advanced route optimization using mapping APIs
- Analytics dashboard for usage patterns
- Integration with team communication tools (Slack, Discord)
- Automated reminder system for upcoming rides

## API Endpoints Summary

### Fully Implemented ✅
- `GET /carpool` - List events 
- `GET /carpool/[id]` - Event details 
- `GET /carpool/create` - Create event form (admin)
- `GET /carpool/admin` - Admin vehicle management
- `GET /carpool/[id]/edit` - Edit event form (admin)
- `GET /carpool/ride/[id]/[triptype]` - Enhanced trip details
- `POST /api/events` - Create new event
- `POST /api/events/[id]` - Update event
- `POST /api/events/[id]/archive` - Archive event
- `GET /api/rides` - Get all vehicles/rides
- `POST /api/rides` - Create vehicle/ride
- `PUT /api/rides/[id]` - Update vehicle/ride
- `POST /api/triprides/[id]/join` - Join ride
- `POST /api/triprides/[id]/leave` - Leave ride
- `GET /api/triprides/[id]` - Get trip ride details

### Partially Implemented 🚧
- `GET /carpool/ride/[id]/[triptype]/edit` - Edit trip form
- `GET /carpool/ride/[id]/[triptype]/vehicle` - Vehicle management
- `GET /carpool/vehicle/[id]` - Vehicle details
- `POST /api/triprides` - Create trip ride
- `PUT /api/triprides/[id]` - Update trip ride

### API Endpoints by Category

#### Event Management
- `GET /api/events` - List events with status filter
- `POST /api/events` - Create event
- `GET /api/events/[id]` - Get event by ID
- `POST /api/events/[id]` - Update event
- `POST /api/events/[id]/archive` - Archive event
- `GET /api/events/[id]/trips` - Get trips for event

#### Vehicle/Ride Management  
- `GET /api/rides` - Get all rides
- `POST /api/rides` - Create ride
- `GET /api/rides/[id]` - Get ride by ID
- `PUT /api/rides/[id]` - Update ride

#### Trip Ride Management
- `GET /api/triprides/[id]` - Get trip ride details
- `POST /api/triprides` - Create trip ride
- `PUT /api/triprides/[id]` - Update trip ride
- `POST /api/triprides/[id]/join` - Join ride
- `POST /api/triprides/[id]/leave` - Leave ride

#### Trip Management
- `POST /api/trips/[triptype]` - Create trip by type

### Still Needed for Enhanced Functionality

#### Core Business Rule Enforcement (Priority: High)
- `POST /api/events/[id]/trips/[triptype]/opt-out` - Opt-out from trip direction (GBR-002)
- `POST /api/events/[id]/trips/[triptype]/opt-in` - Opt-in to previously opted-out direction (GBR-002)  
- `GET /api/events/[id]/user-status` - Get user's transportation status (GBR-001, GBR-002)
- Enhanced validation in `POST /api/triprides/[id]/join` for business rules (GBR-001, GBR-002)

#### User Experience Enhancements (Priority: High)
- `POST /api/events/[id]/trips/[triptype]/fast-reserve` - Fast seat reservation algorithm (UC-019)

#### Additional Features (Priority: Medium)
- `GET /api/carpool/search` - Advanced search/filtering
- `GET /api/carpool/user/rides` - User's current rides  
- `DELETE /api/triprides/[id]` - Cancel trip ride
- `GET /api/carpool/analytics` - Usage analytics (admin)
- `POST /api/carpool/notifications` - Send notifications

#### Database Schema Updates Required
- Add opt-out status tracking table/fields
- Add business rule validation constraints
- Add audit logging for opt-out/opt-in changes

---

*Document updated on October 13, 2025*  
*Based on analysis of Ligerbots Website Frontend carpool system (carpool-admin-view branch)*  
*Reflects current implementation status with admin functionality, API endpoints, and enhanced routing*