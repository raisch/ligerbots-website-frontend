import Event from '$lib/server/event.js'
import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const event = await Event.getEventById(params.id);
  return {
    event: event,
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
    updateEvent: async ({ request, params }) => {
        const data = await request.formData();
        const eventId = params.id;

        const name = data.get('name');
        const description = data.get('description');
        const start_date = data.get('start_date');
        const end_date = data.get('end_date');
        const location = data.get('location');
        const status = data.get('status');

        if (!name || !description || !start_date || !end_date || !location || !status) {
            throw error(400, 'Missing required fields');
        }

        if (
            typeof name !== 'string' ||
            typeof description !== 'string' ||
            typeof start_date !== 'string' ||
            typeof end_date !== 'string' ||
            typeof location !== 'string' ||
            typeof status !== 'string'
        ) {
            throw error(400, 'Invalid data types');
        }

        try {
            let result = await Event.updateEvent(eventId, {
                name, description, start_date, end_date, location, status
            });
            console.log('Event updated successfully:', result);
        } catch (e) {
            console.error('Error updating event', e);
            throw error(500, 'Failed to update event');
        }

        throw redirect(302, '/carpool');
    },
    archiveEvent: async ({ params }) => {
        const eventId = params.id;

        try {
            await Event.archiveEvent(eventId);
        } catch (e) {
            console.error('Error archiving event', e);
            throw error(500, 'Failed to archive event');
        }

        throw redirect(302, '/carpool');
    }
};
