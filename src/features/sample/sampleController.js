import { vertex } from '../../engine.js'
import { VertexController } from 'js_engine_boilerplate'
import { SampleModel } from './sampleModel.js';

const options = {
    initialState: {} // put initial state properties here and they'll be ready when the controller instantiates
}

class SampleController extends VertexController {

    constructor() {
        super();

        // Initialize models
        this.addModel('sample', new SampleModel())
    }

    sampleMethod() {
        // Some series of actions here.
        // Should not contain business logic or at least not much.
    }

}

// Add controller to engine
vertex.registerController('sample', SampleController, options) // {label, class, options}

export { SampleController }