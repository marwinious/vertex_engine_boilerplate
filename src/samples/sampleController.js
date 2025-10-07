import { vertex } from '../../engine.js'
import { VertexController } from 'js_engine_boilerplate'

const options = {
    initialState: {} // put initial state properties here and they'll be ready when the controller instantiates
}

class SampleController extends VertexController {

    constructor() {
        super();

        // Initialize models
        // this.addModel('pages', new PagesModel())
    }

    foo() {
        return "bar";
    }

}

// Add controller to engine
vertex.registerController('sample', SampleController, options) // {label, class, options}

export { SampleController }