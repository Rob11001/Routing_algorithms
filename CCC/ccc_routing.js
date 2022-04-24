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
         * @param {string} idx a m bit string that defines the idx of the node
         * @param {number} pos a integer between 0 and m-1 which defines the position of the node in the cycle
         */
        constructor(idx, pos) {
            this.idx = idx;
            this.pos = pos;
            this.neighboor = null;
            this.predecessor = null;
            this.successor = null;
        }
        
        /**
         * Creates the neighborhood of the node
         * @param {{[x: string]: Node;}} nodes
         * @param {number} dim
         */
        join(nodes, dim) { // It's not a clean solution, but it's only a naive example
            // Edges to the predecessor and the successor in the cycle
            this.successor = nodes[[this.idx, (this.pos + 1) % dim].join('-')];
            
            // add edge to tracer {
                graphTracer.addEdge([this.idx, this.pos].join('-'), [this.idx, (this.pos + 1) % dim].join('-'));
            // }
            this.predecessor = nodes[[this.idx, (this.pos - 1) % dim].join('-')];
            // add edge to tracer {
                graphTracer.addEdge([this.idx, this.pos].join('-'), [this.idx, (this.pos - 1) % dim].join('-'));
            // }

            // Link pos of the hypercube
            let bit = this.idx.charAt(this.pos) === '0' ? '1' : '0';
            let w = [this.idx.substring(0, this.pos), bit, this.idx.substring(this.pos + 1)].join('');
            this.neighboor = nodes[[w, this.pos].join('-')];
            // add edge to tracer {
                graphTracer.addEdge([this.idx, this.pos].join('-'), [w, this.pos].join('-'));
            // }
        }
        
        /**
         * Lookup/routing operation
         * @param {object} target object containing idx and pos of the target node
         */
        lookup(target) {
            if(this.idx === target.idx && this.pos === target.pos) {
                // Completed
                // log {
                logTracer.println("Finished");
                // }
            } else if(this.idx.charAt(this.pos) !== target.idx.charAt(this.pos)) {
                // We need to use the link pos of the hypercube to fix the pos-bit
                // visualize step {
                    Tracer.delay();
                    graphTracer.select([this.neighboor.idx, this.neighboor.pos].join('-'), [this.idx, this.pos].join('-'));
                    Tracer.delay();
                // }
                this.neighboor.lookup(target);
            } else {
                // We don't need to use the link pos of the hypercube, so we pass to the successor
                // visualize step {
                    Tracer.delay();
                    graphTracer.select([this.successor.idx, this.successor.pos].join('-'), [this.idx, this.pos].join('-'));
                    Tracer.delay();
                // }
                this.successor.lookup(target);
            }
        } 
    }
        
    class CCC {
        /**
         * Creates a new CCC of dimension dim with 2^dim *dim nodes
         * @param {number} dim The CCC dimension
         */
        constructor(dim) {
            this.dim = dim;
            this.N = Math.pow(2, dim); 
            this.nodes = {};
            // Creating (2^dim) * (dim) nodes
            for(let i = 0; i < this.N; i++) {
                let idx = CCC.getIdx(i, dim);
                for(let j = 0; j < dim; j++) {
                    let node = new Node(idx, j);
                    this.nodes[[idx, j].join('-')] = node; // id of each node is "idx-pos"
                    // visualize node {
                    graphTracer.addNode([idx, j].join('-'));
                    // } 
                }
            }
                
            // Creating edges between nodes
            for(let i = 0; i < this.N; i++) {
                let row = CCC.getIdx(i, dim);
                for(let j = 0; j < dim; j++) {
                    this.nodes[[row, j].join('-')].join(this.nodes, dim);
                }
            }   
        }
        
        /**
         * Get the binary representation in binary (string of lenght dim) of the passed integer
         * @param {number} i a non-negative integer
         * @param {number} dim the hypercube dimension
         */
        static getIdx(i, dim) {
            let label = i.toString(2);
            let padding = '';
            for (let j = label.length; j < dim; j++) 
                padding = padding.concat('0');
            return [padding, label].join('');
        }
    }
            
    (function main() {
        // Creates a new CCC
        const G = new CCC(2);
        Tracer.delay();
        try {
            // First step {
            graphTracer.select('00-1')
            // }
            G.nodes['00-1'].lookup({
                idx:'11',
                pos: 1
            });
        } catch(err) {
            logTracer.println(err);
        }
    })();