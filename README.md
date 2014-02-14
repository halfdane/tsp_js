tsp_js
======

Solvers for the Traveling Salesman Problem, implemented in JavaScript.

There are three solvers available:

- Simulated Annealing (`annealingTsp.js`) 
- Evolutionary (`evolutionaryTsp.js`)
- Greedy (`nearestNeighbourTsp.js`)

If you want to improve the solution's quality, there's also a Lin-Kernighan Optimizer for you convenience (`linKernighanTspOpt.js`).

All of these use common code that's in `tspBase.js`

Please note that my implementation of the Greedy-Algorithm depends on a triangle-mesh, like that provided by https://github.com/ironwallaby/delaunay.
I am not sure if it were okay to straightly include the code from there, so please get it from there and include the delaunay.js.

For Live-Demos, explanations (in german) and examples on how to use, see 

- http://halfdane.github.io/2014/01/31/tsp_greedy/
- http://halfdane.github.io/2014/01/19/tsp_evolution/
- http://halfdane.github.io/2013/12/01/annealing/

The code is available under the GPLv3, see the LICENSE file.