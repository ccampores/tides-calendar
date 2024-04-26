export const createEvent = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);

    const startTime = new Date(dateTime.getTime());
    startTime.setMinutes(startTime.getMinutes() - 60);

    const endTime = new Date(dateTime.getTime());
    endTime.setMinutes(endTime.getMinutes() + 60);

    return {
        start: startTime.toISOString(),
        end: endTime.toISOString()
    }
};
