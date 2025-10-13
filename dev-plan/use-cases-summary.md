# Ligerbots Carpool System - Use Cases Summary

## System Overview
**Purpose**: Organize team transportation to/from robotics events  
**Technology**: SvelteKit frontend + Directus CMS backend  
**Hierarchy**: Events → Trips (to/from) → Rides → Riders

## Key Routes
- `/carpool` - Event list | `/carpool/create` - New event (admin)
- `/carpool/[id]` - Event details | `/carpool/[id]/edit` - Edit (admin)  
- `/carpool/admin` - Vehicle management | `/carpool/ride/[id]/[type]` - Trip details

## Core Business Rules

**GBR-001: One Seat Per Trip Type** - Users can reserve max 1 seat per direction (to/from event)  
**GBR-002: Mandatory Opt-Out** - Users must explicitly opt-out if they don't need a direction

| Need Transport | To Event | From Event | Required Action |
|----------------|----------|------------|-----------------|
| Both directions | Join 1 ride | Join 1 ride | Normal use |
| To event only | Join 1 ride | **Opt-out** | Must opt-out from return |
| From event only | **Opt-out** | Join 1 ride | Must opt-out from destination |
| Neither direction | **Opt-out** | **Opt-out** | Must opt-out from both |


## Core Use Cases

| UC | Actor | Goal | Endpoint | Status |
|----|-------|------|----------|---------|
| UC-001 | Team Member | Browse carpool events | `GET /carpool` | ✅ Complete |
| UC-002 | Team Member | View event details & trips | `GET /carpool/[id]` | ✅ Complete |
| UC-003 | Team Member | View trip details & rides | `GET /carpool/trip/[id]` | 🚧 In Progress |
| UC-004 | Team Member | View ride details & join/leave | `GET /carpool/trip/ride/[id]` | ❌ Placeholder |
| UC-005 | Admin | Create new event | `POST /api/events` | ✅ Complete |
| UC-006 | Admin | Create trip for event | `POST /api/trips` | ❌ Not Implemented |
| UC-007 | Team Member | Join carpool ride | `POST /api/triprides/[id]/join` | ✅ Complete |
| UC-008 | Team Member | Leave carpool ride | `POST /api/triprides/[id]/leave` | ✅ Complete |
| UC-009 | Driver | Cancel carpool ride | `DELETE /api/triprides/[id]` | ❌ Not Implemented |
| UC-010 | Team Member | Search carpool options | `GET /api/carpool/search` | ❌ Not Implemented |
| UC-011 | Admin | Edit event details | `POST /api/events/[id]` | ✅ Complete |
| UC-012 | Admin | Manage vehicle fleet | `GET /carpool/admin` | ✅ Complete |
| UC-013 | Team Member | Enhanced trip details | `GET /carpool/ride/[id]/[type]` | ✅ Complete |
| UC-014 | Admin/Driver | Manage trip rides | `GET /api/triprides/[id]` | ✅ Backend Done |
| UC-015 | Admin | Vehicle details & assignment | `GET /carpool/vehicle/[id]` | 🚧 In Progress |
| UC-016 | Team Member | Opt-out from trip direction | `POST /api/events/[id]/trips/[type]/opt-out` | ❌ Not Implemented |
| UC-017 | Team Member | Opt-in to trip direction | `POST /api/events/[id]/trips/[type]/opt-in` | ❌ Not Implemented |
| UC-018 | Team Member | View transportation status | `GET /api/events/[id]/user-status` | 🚧 Partial |
| UC-019 | Team Member | Fast seat reservation | `POST /api/events/[id]/trips/[type]/fast-reserve` | ❌ Not Implemented |

## Implementation Priorities

### Phase 1 (Critical) - Business Rules
- ❌ **GBR-001 & GBR-002 enforcement** (UC-007, UC-008 validation)
- ❌ **Opt-out/opt-in functionality** (UC-016, UC-017)  
- ❌ **Fast reservation system** (UC-019)
- 🚧 **Trip/ride editing interface** (UC-015)

### Phase 2 (Enhanced Features)
- Search & filtering (UC-010) | Ride cancellation (UC-009)
- Real-time updates | GPS coordination | Notification system
- Mobile optimization | Calendar integration

## Key API Endpoints

### Fully Implemented ✅
```
GET  /carpool                    - Event list
GET  /carpool/[id]              - Event details  
POST /api/events                - Create event (admin)
POST /api/events/[id]           - Update event (admin)
GET  /carpool/admin             - Vehicle management (admin)
POST /api/triprides/[id]/join   - Join ride
POST /api/triprides/[id]/leave  - Leave ride
```

### Critical Missing ❌
```
POST /api/events/[id]/trips/[type]/opt-out      - Opt-out (GBR-002)
POST /api/events/[id]/trips/[type]/opt-in       - Opt-in (GBR-002)  
POST /api/events/[id]/trips/[type]/fast-reserve - Quick reservation
GET  /api/events/[id]/user-status              - User status
```

## Technical Implementation Notes

**Architecture**: SvelteKit + Directus CMS with GraphQL API  
**Authentication**: Session-based with admin role verification  
**Data Models**: Event → TripRide → Ride classes with dedicated methods  
**Fast Reservation**: Priority algorithm (departure time, seat availability, creation date)

**Critical Requirements**:
- Business rule validation at API and UI levels  
- Optimistic locking for concurrent reservations
- Audit logging for opt-out/opt-in decisions
- Mobile-responsive design for field use

## Fast Reservation Algorithm (UC-019)
**Priority Criteria**: Earliest departure → Most seats → Creation date → Vehicle name  
**Business Rules**: Enforces GBR-001 (one seat per trip type) & GBR-002 (no opted-out users)  
**Technical**: Optimistic locking prevents race conditions during concurrent reservations

---

*Ligerbots Carpool System - Use Cases Summary*  
*Updated October 13, 2025 | carpool-admin-view branch*