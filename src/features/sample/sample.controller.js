import { defineController } from "vertex_engine";
import { resultsApi } from "./sample.api.js";
import { normalizeElectionResultsPayload } from "./sample.transform.js";
import { sortByKey } from "../../utility/sorters.js"

export const sampleController = defineController({
    name: 'results',
    setup({ state, globalState, logger, events, http}) {

        async function loadResults(eventId, widgetId, autoSortRaces=false) {
            logger.info(`Loading results for eventId: ${eventId} and widgetId: ${widgetId}`);
            
            if(!eventId || !widgetId) { return }

            // Set state to indicate results are loading while preserving previous races & lastUpdated
            globalState.setState({
                results: {
                    ...globalState.getState()?.results,
                    loading: true
                }
            });

            try {
                const rawData = await resultsApi.fetchLiveResults({http}, eventId, widgetId);
                const normalizedData = normalizeElectionResultsPayload(rawData);
                logger.debug(`Raw data from api: `, rawData);
                logger.debug(`Normalized data from api: `, normalizedData);

                if(autoSortRaces) {
                    // Sort the races
                    normalizedData.races = sortByKey(normalizedData.races, 'label', 'asc');
                }

                const lastUpdated = new Date().toISOString();

                globalState.setState({
                    results: {
                        ...globalState.getState()?.results,
                        loading: false, 
                        races: normalizedData.races,
                        lastUpdated
                    },
                    app: {
                        ...globalState.getState()?.app,
                        loading: false,
                        widgetConfig: normalizedData.widgetConfig
                    }
                });

                logger.debug('globalState: ', globalState.getState());
            }
            catch(err) {
                logger.error('Unable to load results: ', err)
            }
        }

        return {
            loadResults
        }

    }
})