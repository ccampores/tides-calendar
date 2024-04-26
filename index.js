import { addEvent, authorize, deleteAllEvents, getAllEvents } from './gcalendar.js';
import { fetchTides } from './tides.js';

const authClient = await authorize();
const tides = await fetchTides();

// tides.forEach((t) => {
//     addEvent(authClient, t)
//         .catch(console.error);
// });

//deleteAllEvents(authClient);

getAllEvents(authClient);
