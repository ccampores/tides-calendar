import { promises as fs } from 'fs';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { DateTime } from "luxon";
import { TIME_ZONE, sleep } from './utils.js';

const CALENDAR_ID = 'c3f7562306a95ad6eb8be337fd7b8b00081af37d05de95bee60111f7e4f38b8d@group.calendar.google.com'
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = './resources/token.json';
const CREDENTIALS_PATH = './resources/credentials.json';

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

export async function getAllEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
    } else {
        console.log('Upcoming events: ');
        events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
        });
    }

    return events;
}

function createEvent(dateTimeString, durationInMinutes, timeZone = TIME_ZONE) {
    const dt = DateTime.fromISO(dateTimeString).setZone(timeZone);
    const startTime = dt.minus({ minutes: durationInMinutes / 2 });
    const endTime = dt.plus({ minutes: durationInMinutes / 2 });

    return {
        start: startTime.toISO(),
        end: endTime.toISO()
    }
};

export async function addEvent(auth, input, durationInMinutes) {
    const { datetime, state } = input
    if (state === 'LOW TIDE') {
        console.log(`Event ${state} ${datetime} skipped.`);
        return;
    }

    const event = createEvent(datetime, durationInMinutes);
    if (!event) {
        console.log(`Event ${state} ${datetime} skipped.`);
        return;
    }

    const gEvent = {
        'summary': state,
        'start': {
            'dateTime': event.start,
            'timeZone': TIME_ZONE,
        },
        'end': {
            'dateTime': event.end,
            'timeZone': TIME_ZONE,
        }
    };

    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.insert({
        auth: auth,
        calendarId: CALENDAR_ID,
        resource: gEvent,
    }, function (err) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
    });

    console.log(`Added ${state} at ${datetime}`);
}

export async function deleteAllEvents(auth) {
    const events = await getAllEvents(auth);
    if (events.length > 0) {
        events.forEach((e) => { deleteEvent(auth, e); })
    }
}

async function deleteEvent(auth, event) {
    const calendar = google.calendar({ version: 'v3', auth: auth });
    calendar.events.delete({
        eventId: event.id,
        calendarId: CALENDAR_ID
    });
    await sleep(5000);
}