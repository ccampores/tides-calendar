import * as fsPromises from 'fs/promises';
import fetch from 'node-fetch';
import url from 'url';
import path from 'path';
import { now } from './utils.js';

const API_KEY = 'aaf9a059-2226-4a39-aade-358a93ddf9b3';
const ENDPOINT_URL = 'https://api.marea.ooo/v2/tides';

const queryParams = {
    timestamp: now,
    duration: 10080,
    interval: 0,
    latitude: 29.118348,
    longitude: -13.565674,
    model: 'EOT20',

    set changeTimestamp(newTimestamp: number) {
        this.timestamp = newTimestamp
    }
};

const options = {
    method: 'GET',
    headers: {
        'x-marea-api-token': API_KEY
    }
};

interface TideData {
    extremes: Extreme[]
}

interface Extreme {
    timestamp: number,
    height: number,
    state: string,
    datetime: string
}

export async function fetchAllTides(numberOfWeeks = 1, startTimestamp: number = now): Promise<Extreme[]> {
    console.log(`fetchAllTides from ${startTimestamp} for ${numberOfWeeks} weeks`)

    const tides: Extreme[] = [];
    let start = startTimestamp;

    for (let i = 1; i <= numberOfWeeks; i++) {
        console.log(`=== Week ${i} ===`);
        console.log(`Timestamp start: ${start}`);
        
        queryParams.timestamp = start;
        
        const urlWithParams: string = url.format({
            pathname: ENDPOINT_URL,
            query: queryParams
        });
        const oneWeekTides = await fetchTidesFromApi(urlWithParams, start);
        oneWeekTides.forEach((e: any) => tides.push(e));

        const lastTimestamp = oneWeekTides[oneWeekTides.length - 1].timestamp;
        console.log(`Last timestamp: ${lastTimestamp}`);
        start = lastTimestamp + 1;
    }

    return tides;
}

export async function fetchTidesFromFile(filename: string): Promise<Extreme[]> {
    try {
        const jsonString = await fsPromises.readFile(filename, 'utf8');
        const { extremes } = JSON.parse(jsonString);

        return extremes;
    } catch (error) {
        console.log(`Error reading or parsing JSON: ${error}`);
        throw error;
    }
}

async function fetchTidesFromApi(urlWithParams: string, startTimestamp: number): Promise<Extreme[]> {
    try {
        const response = await fetch(urlWithParams, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json() as TideData;
        await saveFile(jsonData, startTimestamp);
        return jsonData.extremes;
    } catch (error) {
        console.error(`Fetch error: ${error}`);
        throw error;
    }
}

async function saveFile(jsonData: TideData, startTimestamp: number): Promise<void> {
    try {
        const fileName = `${startTimestamp}.json`;
        console.log(`filename: ${fileName}`);
        const filePath = path.join('./resources/tide_data/', fileName);
        const jsonString = JSON.stringify(jsonData, null, 2);
        await fsPromises.writeFile(filePath, jsonString);
    } catch (error) {
        console.error(`Error saving json response: ${error}`);
        throw error;
    }
}