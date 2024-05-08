import { DateTime, Settings } from 'luxon';

export const TIME_ZONE = 'Atlantic/Canary'
Settings.defaultZone = TIME_ZONE

export const now = DateTime.now().toUnixInteger();

export async function sleep(ms: number): Promise<void> {
    return new Promise(
        (resolve) => setTimeout(resolve, ms)
    );
}
