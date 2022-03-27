//@ts-check
// import visualization libraries {
const {Layout, LogTracer, Tracer, VerticalLayout, GraphTracer } = require('algorithm-visualizer');
// }
    
// define tracer variables {
const logTracer = new LogTracer('Console');
const graphTracer = new GraphTracer('Hypercube');
// }

// visualize {
Layout.setRoot(new VerticalLayout([graphTracer, logTracer]));
Tracer.delay();
// }

    
        
(function main() {
    
})();
    