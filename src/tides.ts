import * as fsPromises from 'fs/promises';
//import { DateTime } from 'luxon';
import fetch from 'node-fetch';
import url from 'url';
import { now, queryParams } from './dates.js';

const baseUrl = 'https://api.marea.ooo/v2/tides';

const options = {
    method: 'GET',
    headers: {
        'x-marea-api-token': 'aaf9a059-2226-4a39-aade-358a93ddf9b3'
    }
};

const urlWithParams: string = url.format({
    pathname: baseUrl,
    query: queryParams
});

interface TideData {
    extremes: Extreme[]
}

interface Extreme {
    timestamp: number,
    height: number,
    state: string,
    datetime: string
}

// TODO for 0 .. # weeks. increase last returned timestamp
export async function fetchAllTides(startTimestamp: number, numberOfWeeks = 1, remote = true) {
    // if (startTimestamp) {
    //     queryParams.changeTimestamp(startTimestamp);
    //     urlWithParams.changeQueryParams(queryParams);
    // }
    console.log(`fetchAllTides from ${startTimestamp} for ${numberOfWeeks} weeks, remote=${remote}`)
    let tides: any[] = [];
    let start = startTimestamp;
    for (let i = 0; i < numberOfWeeks; i++) {
        console.log(`Timestamp start: ${i}: ${start}`);
        const oneWeekTides = await fetchTides(remote);
        oneWeekTides.forEach((e: any) => tides.push(e));

        const lastTimestamp = oneWeekTides[oneWeekTides.length - 1].timestamp;
        console.log(`Last timestamp: ${lastTimestamp}`);
        start = lastTimestamp + 1;
    }

    return tides;
}

async function fetchTides(remote: boolean) {
    if (remote) {
        return fetchTidesFromApi();
    } else {
        return fetchTidesFromFile();
    }
}

async function fetchTidesFromApi() {
    try {
        const response = await fetch(urlWithParams, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { extremes } = await response.json() as TideData;
        console.log(extremes);
        return extremes;
    } catch (error) {
        console.error(`Fetch error: ${error}`);
        return null;
    }
}


async function fetchTidesFromFile() {
    try {
        const jsonString = await fsPromises.readFile('./resources/tides.json', 'utf8');
        const { extremes } = JSON.parse(jsonString);
        // for (let key in extremes) {
        //     console.log(`${key} => ${extremes[key].timestamp}`);
        // }

        return extremes;
    } catch (error) {
        console.log('Error reading or parsing JSON:', error);
        throw error;
    }
}

