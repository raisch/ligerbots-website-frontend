import { describe, expect, it } from 'vitest'

// See https://vitest.dev/api/expect.html

import Event from '$lib/server/event.js'

describe('Events', () => {
  it('Event.getEvents', async () => {
    const eventsData = await Event.getEvents()
    expect(eventsData).toBeDefined()
    expect(eventsData).toBeInstanceOf(Array)
    expect(eventsData[0]).toBeTypeOf('object')
    expect(eventsData[0].id).toBeTypeOf('string')
  })
  it('Event.getEventById', async () => {
    const eventData = await Event.getEventById('1')
    expect(eventData).toBeDefined()
    expect(eventData).toBeTypeOf('object')
    expect(eventData?.id).toBeTypeOf('string')
  })
})
