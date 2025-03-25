import { json } from '@sveltejs/kit';
import Event from '$lib/server/event.js';

// Get a single event by ID
export async function GET({ params }) {
    const { id } = params;
    try {
        const eventData = await Event.getEventById(id);
        if (!eventData) {
            return json({ message: 'Event not found' }, { status: 404 });
        }
        return json(eventData);
    } catch (error) {
        console.error('Error getting event', error);
        return json({ message: error.message }, { status: 500 });
    }
}

// Update an existing event
export async function POST({ params, request }) {
    const { id } = params;
    const eventData = await request.json();
    try {
        const updatedEvent = await Event.updateEvent(id, eventData);
        return json(updatedEvent);
    } catch (error) {
        console.error('Error updating event', error);
        return json({ message: error.message }, { status: 500 });
    }
}

// Archive an event
export async function PATCH({ params }) {
    const { id } = params;
    try {
        const archivedEvent = await Event.archiveEvent(id);
        return json(archivedEvent);
    } catch (error) {
        console.error('Error archiving event', error);
        return json({ message: error.message }, { status: 500 });
    }
}

// Delete an event
export async function DELETE({ params }) {
    const { id } = params;
    try {
        const result = await Event.deleteEvent(id);
        return json(result);
    } catch (error) {
        console.error('Error deleting event', error);
        return json({ message: error.message }, { status: 500 });
    }
}
