
# Carpool UI Plan

The carpool UI will be built to facilitate the creation and management of
  carpools for events using Directus as the backend. The UI will leverage
  Directus GraphQL API to interact with the carpool data models defined in
  `carpool.plan.md`.

Components will use [shadcn-svelte](https://ui.shadcn.com/docs/components) for
a modern, accessible, and consistent design system.

## UI Components & Wireframes


### 1. Event List Page

- **Description:** Displays a list of published events as cards.
- **shadcn-svelte Components:**
  - Card, Button, Input (for search/filter), Skeleton (for loading)
- **Functionality:**
  - Fetch events using GraphQL query.
  - Display each event as a card with name, date, location, and a "View Trips" button.
  - Search/filter events by name/date.
  - Clicking a card navigates to the Trip List Page for that event.


**Wireframe:**

```text
---------------------------------------------------
|  [Search Events...]                             |
---------------------------------------------------
|  [Event Card]   [Event Card]   [Event Card]     |
|  Name           Name           Name             |
|  📅 Date        📅 Date        📅 Date           |
|  📍 Location    📍 Location    📍 Location       |
|  [View Trips]   [View Trips]   [View Trips]     |
---------------------------------------------------
```

### 2. Trip List Page

- **Description:** Displays trips (destination and return) for a selected event.
- **shadcn-svelte Components:**
  - Card, Checkbox, Button, Dialog (for modals), Tabs or Grid
- **Functionality:**
  - Fetch event trips using GraphQL query.
  - Display two columns: Destination Trips | Return Trips.
  - Each trip is a card with summary and a "View Details" button.
  - At the top of each column, a checkbox: "I do not need a ride for this direction" (submits preference via GraphQL mutation).
  - Clicking a trip opens the Trip Detail Modal Popup.

**Wireframe:**

```text
---------------------------------------------------
| 🚗 Destination Trips   | 🏁 Return Trips         |
| [ ] No ride needed    | [ ] No ride needed      |
| [Trip Card]           | [Trip Card]             |
| [View Details]        | [View Details]          |
| ...                   | ...                     |
---------------------------------------------------
```


### 3. Trip Detail Modal Popup

- **Description:** Shows detailed information about a selected trip and its rides.
- **shadcn-svelte Components:**
  - Dialog, Card, Button, Badge, List, Avatar (for driver/passenger icons)
- **Functionality:**
  - Fetch trip details and rides using GraphQL query.
  - For each ride: show driver, vehicle, passengers, free seats (badges or chips).
  - "Join Ride" button for available rides (opens Join Ride Form Modal).

**Wireframe:**

```text
---------------- Trip Details (Modal) ----------------
| Trip: [Destination/Return]                        |
| 🕒 Date/Time: [..]                                |
|                                                   |
| Rides:                                            |
| [Ride Card]  👤 Driver: [Avatar] Name             |
|   🚗 Vehicle: [..]                                |
|   🧑‍🤝‍🧑 Passengers: [Avatar] [Avatar] ...            |
|   🪑 Free Seats: [2]                              |
|   [Join Ride]                                     |
| ...                                               |
-----------------------------------------------------
```
### 4. Join Ride Form Modal Popup

- **Description:** Allows users to join a ride by submitting their info.
- **shadcn-svelte Components:**
  - Dialog, Form, Input, Button, Alert (for errors)
- **Functionality:**
  - Validate required fields.
  - Submit form via GraphQL mutation to join the ride.
  - Show success or error message.

**Wireframe:**

```text
------------- Join Ride (Modal) -------------
| 👤 Name:  [___________]                    |
| ☎️ Contact: [___________]                  |
| 📍 Pickup Location: [___________]          |
| [Join Ride]                                |
| [Cancel]                                   |
---------------------------------------------
```
