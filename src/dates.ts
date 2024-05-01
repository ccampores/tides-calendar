import { DateTime, Settings } from 'luxon';

export const TIME_ZONE = 'Atlantic/Canary'
Settings.defaultZone = TIME_ZONE

export const now = DateTime.now().toUnixInteger();

export const queryParams = {
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

// console.log(queryParams);
// queryParams.changeTimestamp = 0;
// console.log(queryParams);