//@ts-check
// import visualization libraries {
const {Layout, LogTracer, Tracer, VerticalLayout, GraphTracer } = require('algorithm-visualizer');
// }
        
// define tracer variables {
const logTracer = new LogTracer('Console');
const graphTracer = new GraphTracer('Butterfly');
// }
    
// visualize {
Layout.setRoot(new VerticalLayout([graphTracer, logTracer]));
graphTracer.directed(false);
graphTracer.log(logTracer);
Tracer.delay();
// }
    
class Node {
    /**
     * Creates a new node
     * @param {string} row a m bit string that defines the row of the node
     * @param {number} column a integer between 0 and m
     */
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.neighboors = [];
        this.predecessor = null;
    }
    
    /**
     * Creates the neighborhood of the node
     * @param {{[x: string]: Node;}} nodes
     * @param {number} dim
     */
    join(nodes, dim) { // It's not a clean solution, but it's only a naive example
        if(this.column > 0) {
            this.predecessor = nodes[[this.row, this.column - 1].join('-')];
        }
        if(this.column !== (dim + 1)) {
            this.neighboors[0] = nodes[[this.row, this.column + 1].join('-')]; // Direct link
            // add edge to tracer {
                graphTracer.addEdge([this.row, this.column].join('-'), [this.row, this.column + 1].join('-'));
            // }
            let bit = this.row.charAt(this.column) === '0' ? '1' : '0';
            let w = [this.row.substring(0, this.column), bit, this.row.substring(this.column + 1)].join('');
            this.neighboors[1] = nodes[[w, this.column + 1].join('-')]; // Crossed link
            // add edge to tracer {
                graphTracer.addEdge([this.row, this.column].join('-'), [w, this.column + 1].join('-'));
            // }
        }
    }
    
    /**
     * Lookup/routing operation
     * @param {object} target object containing row and column of the target node
     * @param {number} step Routing step
     */
    lookup(target, step) {
        // First phase
        if(step === 0 && this.predecessor !== null) {
            // visualize step {
                Tracer.delay();
                graphTracer.select([this.predecessor.row, this.predecessor.column].join('-'), [this.row, this.column].join('-'));
                Tracer.delay();
            // }
            this.predecessor.lookup(target, step);
        } else if(step !== this.row.length) { // If all bits have not been already "fixed"
            // Second phase
            let choice = (this.row.charAt(step) !== target.row.charAt(step)) ? 1 : 0;
            // visualize step {
                Tracer.delay();
                graphTracer.select([this.neighboors[choice].row, this.neighboors[choice].column].join('-'), [this.row, this.column].join('-'));
                Tracer.delay();
            // }
            this.neighboors[choice].lookup(target, step + 1);
        } else if(this.column !== target.column) { // We search the target in its row
            // Third phase
            // visualize step {
                Tracer.delay();
                graphTracer.select([this.predecessor.row, this.predecessor.column].join('-'), [this.row, this.column].join('-'));
                Tracer.delay();
            // }
            this.predecessor.lookup(target, step);
        } else {
            // Completed
            // log {
            logTracer.println("Finished");
            // }
        }        
    }
    
}
    
class Butterfly {
    /**
     * Creates a new Butterfly of dimension dim with 2^dim *(dim + 1) nodes
     * @param {number} dim The Butterfly dimension
     */
    constructor(dim) {
        this.dim = dim;
        this.N = Math.pow(2, dim); 
        this.nodes = {};
        // Creating (2^dim) * (dim + 1) nodes
        for(let i = 0; i < this.N; i++) {
            let row = Butterfly.getRow(i, dim);
            for(let j = 0; j <= dim; j++) {
                let node = new Node(row, j);
                this.nodes[[row, j].join('-')] = node; // id of each node is "row-column"
                // visualize node {
                graphTracer.addNode([row, j].join('-'));
                // } 
            }
        }
            
        // Creating edges between nodes
        for(let i = 0; i < this.N; i++) {
            let row = Butterfly.getRow(i, dim);
            for(let j = 0; j <= dim; j++) {
                this.nodes[[row, j].join('-')].join(this.nodes, dim);
            }
        }   
    }
    
    /**
     * Get the binary representation in binary (string of lenght dim) of the passed integer
     * @param {number} i a non-negative integer
     * @param {number} dim the hypercube dimension
     */
    static getRow(i, dim) {
        let label = i.toString(2);
        let padding = '';
        for (let j = label.length; j < dim; j++) 
            padding = padding.concat('0');
        return [padding, label].join('');
    }
}
        
(function main() {
    // Creates a new Butterfly
    const G = new Butterfly(2);
    Tracer.delay();
    try {
        // First step {
        graphTracer.select('00-2')
        // }
        G.nodes['00-2'].lookup({
            row: '11',
            column: 1
        }, 0);
    } catch(err) {
        logTracer.println(err);
    
    }
})();