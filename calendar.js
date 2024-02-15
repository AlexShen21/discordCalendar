const keys = require('./keys.json');
const { google } = require('googleapis');

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_CALENDAR_ID = keys.calendar_id;
const jwtClient = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    SCOPES
);

const calendar = google.calendar({
    version: 'v3',
    auth: jwtClient
});

function createGoogleCalendarEvent(eventDetails) {
    return new Promise((resolve, reject) => {
        calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            resource: eventDetails,
        }, (err, event) => {
            if (err) {
                console.error('Error creating event:', err);
                reject(err);
            } else {
                console.log('Event created: %s', event.data.htmlLink);
                resolve(event.data);
            }
        });
    });
}

module.exports = { createGoogleCalendarEvent };
