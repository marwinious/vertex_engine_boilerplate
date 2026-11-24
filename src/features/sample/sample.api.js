export const resultsApi = {
    async fetchLiveResults({http}, eventId, widgetId) {
        return await http.get(`/events/${eventId}/?filterRacesByWidgetId=${widgetId}`);
    }
}