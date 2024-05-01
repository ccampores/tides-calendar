import { addEvent, authorize, deleteAllEvents, getAllEvents } from './gcalendar.js';
import { fetchAllTides, fetchTidesFromFile } from './tides.js';

const authClient = await authorize();

// deleteAllEvents(authClient);

const tides = await fetchTidesFromFile('./resources/tide_data/1714602684.json');

tides.forEach((t) => {
    addEvent(authClient, t)
        .catch(console.error);
});

// getAllEvents(authClient);

//await fetchAllTides(2, 1717590779);
