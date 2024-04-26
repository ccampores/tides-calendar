import * as fsPromises from 'fs/promises';
import fetch from 'node-fetch';
import url from 'url';

const baseUrl = 'https://api.marea.ooo/v2/tides';

const queryParams = {
    duration: 10080,
    interval: 0,
    latitude: 29.118348,
    longitude: -13.565674,
    model: 'EOT20'
};

const urlWithParams = url.format({
    pathname: baseUrl,
    query: queryParams
});

const options = {
    method: 'GET',
    headers: {
        'x-marea-api-token': 'aaf9a059-2226-4a39-aade-358a93ddf9b3'
    }
};

export async function fetchTidesFromAPI() {
    try {
        const response = await fetch(urlWithParams, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tideData = await response.json();
        console.log(tideData.extremes);
        return tideData.extremes;
    } catch (error) {
        console.error(`Fetch error: ${error}`);
    }
}


export async function fetchTidesFromFile() {
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