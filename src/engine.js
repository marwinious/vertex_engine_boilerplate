import { createEngine } from 'vertex_engine'
import { sampleController } from './features/sample/sample.controller.js';

// Init engine with global state
const engine = createEngine({ 
    stateStore: null, // In ingesting project, optionally pass in state singleton to connect w/engine
    logLevel: import.meta.env.DEV ? 'debug' : 'warn', // Auto-sets logging level based on env
    logEnabled: true, // Enable or disable logging in general
    httpConfig: { // Optional: sets engine's http config for api requests
        baseUrl: 'https://jsonplaceholder.typicode.com/posts/1',
        timeout: 8000,
        headers: {
            'X-App-Version': '1.0.0'
        }
    }
});

// Register controllers
engine.register(sampleController);

export { engine }

/*
In ingesting project, create engine.js and add the following code to create a singleton
import { engine } from '/path/to/this/file';

// Any option config can go here

export {engine }
*/

/*
In ingesting project, get a controller's actions:
const someActions = engine.getActions('results');
const res = await someActions.loadResults(eventId, widgetId, autoSortRaces);
*/