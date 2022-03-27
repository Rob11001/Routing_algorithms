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
graphTracer.directed(false);
graphTracer.log(logTracer);
Tracer.delay();
// }

class Node {
    /**
     * @param {string} label a m bit string that defines the identifier of the node
     */
    constructor(label) {
        this.label = label;
        this.neighboors = [];
    }

    /**
     * @param {{ [x: string]: Node; }} nodes
     */
    join(nodes) { // It's not a clean solution, but it's only a naive example
        for(let i = 0; i < this.label.length; i++) {
            let bit = this.label.charAt(i);
            bit = (bit === '0') ? '1' : '0';
            let next = this.label.substring(0, i).concat(bit);
            if(i < this.label.length) {
               next = next.concat(this.label.substring(i + 1));
            }

            this.neighboors[i] = nodes[next];
            // add edge to tracer {
            graphTracer.addEdge(this.label, next);
            // }
        }
    }

    /**
     * @param {string} target
     * @param {number} step
     */
    lookup(target, step) {
        if(this.label === target) {
            // Completed
            return;
        }
        for(let i = step; i < this.label.length; i++)
            if(this.label.charAt(i) !== target.charAt(i)) {
                // visualize step {
                Tracer.delay();
                graphTracer.select(this.neighboors[i].label, this.label);
                Tracer.delay();
                
                // }
                return this.neighboors[i].lookup(target, i + 1);
            }
    }

}

class Graph {
    /**
     * @param {number} dim The Hypercube dimension
     */
    constructor(dim) {
        this.dim = dim;
        this.N = Math.pow(2, dim); 
        this.nodes = {};
        // Creating 2^dim nodes with label going from 0 to 2^dim - 1
        for(let i = 0; i < this.N; i++) { 
            let label = Graph.getLabel(i, dim);
            this.nodes[label] = new Node(label);
            // add node to tracer {
            graphTracer.addNode(label);
            // }
        }

        for(let i = 0; i < this.N; i++) { 
            let label = Graph.getLabel(i, dim);
            this.nodes[label].join(this.nodes);
        }
    }

    /**
     * @param {number} i
     * @param {number} dim
     */
    static getLabel(i, dim) {
        let label = i.toString(2);
        let padding = '';
        for (let j = label.length; j < dim; j++) 
            padding = padding.concat('0');
        return [padding, label].join('');
    }
}

    
        
(function main() {
    const G = new Graph(4);
    Tracer.delay();
    // first step {
    graphTracer.select('0000');
    Tracer.delay(1);
    // }
    
    G.nodes['0000'].lookup('1111', 0);
})();
    