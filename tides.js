import * as fsPromises from 'fs/promises';

export async function fetchTides() {
    try {
        // Read the JSON file
        const jsonString = await fsPromises.readFile('resources/tides.json', 'utf8');

        // Parse the JSON string into an object
        const tideData = JSON.parse(jsonString);

        // Access the 'extremes' property from the tideData object
        return tideData.extremes;
    } catch (error) {
        console.log('Error reading or parsing JSON:', error);
        throw error;
    }
}

