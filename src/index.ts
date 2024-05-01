import { now } from './dates.js';
import { addEvent, authorize, deleteAllEvents, getAllEvents } from './gcalendar.js';
import { fetchAllTides } from './tides.js';

//const authClient = await authorize();

// deleteAllEvents(authClient);

// const tides = await fetchTidesFromAPI();

// tides.forEach((t) => {
//     addEvent(authClient, t)
//         .catch(console.error);
// });


//getAllEvents(authClient);

const tides = await fetchAllTides(now, 2, false);
tides.forEach(element => {
    console.log(element)
});
