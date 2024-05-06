import { sleep } from './dates.js';
import { addEvent, authorize, deleteAllEvents, getAllEvents } from './gcalendar.js';
import { fetchAllTides, fetchTidesFromFile } from './tides.js';
import fs from 'fs';
import path from 'path';

const authClient = await authorize();

const directoryPath = './resources/tide_data';
const filenames = getFilenamesInDirectory(directoryPath);

// for (const f of filenames.slice(1, 3)) {
//     const filename = path.join(directoryPath, f);
//     console.log(`Filename: ${filename}`);
//     const tides = await fetchTidesFromFile(filename);

//     tides.forEach((t) => {
//         addEvent(authClient, t)
//             .catch(console.error);
//         sleep(5000);
//     });
// }

// getAllEvents(authClient);

//await fetchAllTides(2, 1717590779);

function getFilenamesInDirectory(directoryPath: string): string[] {
    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
        console.error(`Directory "${directoryPath}" does not exist.`);
        return [];
    }

    try {
        // Read the contents of the directory
        const filenames = fs.readdirSync(directoryPath);

        // Filter out directories and return only filenames
        return filenames.filter(filename => {
            const filePath = path.join(directoryPath, filename);
            return fs.statSync(filePath).isFile();
        });
    } catch (error) {
        console.error(`Error reading directory "${directoryPath}":`, error);
        return [];
    }
}