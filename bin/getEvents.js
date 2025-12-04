#!/usr/bin/env node

import 'dotenv/config'

import Event from '../src/lib/server/event.js'

async function main() {
  try {
    // By default, fetch all published events using the Event service.
    const events = await Event.getEvents()

    // Pretty-print the events as JSON to stdout.
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(events, null, 2))
    for (const id of events.map((e) => e.id)) {
      console.log(`\nFetching complete event data for event ID: ${id}\n`)
      const completeEvent = await Event.getCompleteEventById(id)
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(completeEvent, null, 2))
    }
    process.exit(0)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving events:', error)
    process.exit(1)
  }
}

main()
