import { addEvent, authorize, deleteAllEvents, getAllEvents } from './gcalendar.js';
import { fetchTidesFromAPI, fetchTidesFromFile } from './tides.js';

const authClient = await authorize();

// deleteAllEvents(authClient);

// const tides = await fetchTidesFromAPI();

// tides.forEach((t) => {
//     addEvent(authClient, t)
//         .catch(console.error);
// });


getAllEvents(authClient);
