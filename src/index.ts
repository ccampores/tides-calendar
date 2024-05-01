// import { now } from './dates.js';
import { addEvent, authorize, deleteAllEvents, getAllEvents } from './gcalendar.js';
import { fetchAllTides } from './tides.js';

// const authClient = await authorize();

// deleteAllEvents(authClient);

// const tides = await fetchAllTides(now);

// tides.forEach((t) => {
//     addEvent(authClient, t)
//         .catch(console.error);
// });


// getAllEvents(authClient);

const tides = await fetchAllTides(4, 1715802005);
// tides.forEach(element => {
//     console.log(element)
// });
