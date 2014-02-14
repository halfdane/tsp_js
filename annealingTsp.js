/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true, jquery:true, devel: true */

var halfdane = halfdane || {};
halfdane.tsp = halfdane.tsp || {};

halfdane.tsp.createAnnealing = function (pointSet, drawEdgesFunction) {
    'use strict';

    var tourManager = halfdane.tsp.createTourManager(pointSet),
        createTour = halfdane.tsp.tourCreator(tourManager);

    function acceptanceProbability(engery, newEngery, temperature) {
        // If the new solution is better, accept it
        if (newEngery < engery) {
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        return Math.exp((engery - newEngery) / temperature);
    }

    function solve() {
        // Set initial temp
        var temp = 10000,
        // Cooling rate
            coolingRate = 0.001,
        // Initialize intial solution
            currentSolution = createTour().usingTourManagersPoints();

        drawEdgesFunction(currentSolution.tour, 'temp: ' + temp);

        // Set as current best
        var best = createTour().usingCities(currentSolution.tour);

        // Loop until system has cooled
        while (temp > 1) {
            // Create new neighbour tour
            var newSolution = createTour().usingCities(currentSolution.tour);

            // Get a random positions in the tour
            var tourPos1 = Math.floor(newSolution.tourSize() * Math.random());
            var tourPos2 = Math.floor(newSolution.tourSize() * Math.random());

            // Get the cities at selected positions in the tour
            var citySwap1 = newSolution.getCity(tourPos1);
            var citySwap2 = newSolution.getCity(tourPos2);

            // Swap them
            newSolution.setCity(tourPos2, citySwap1);
            newSolution.setCity(tourPos1, citySwap2);

            // Get energy of solutions
            var currentEngery = currentSolution.getDistance();
            var neighbourEngery = newSolution.getDistance();

            // Decide if we should accept the neighbour
            if (acceptanceProbability(currentEngery, neighbourEngery, temp) > Math.random()) {
                currentSolution = createTour().usingCities(newSolution.tour);
            }

            // Keep track of the best solution found
            if (currentSolution.getDistance() < best.getDistance()) {
                best = createTour().usingCities(currentSolution.tour);
                drawEdgesFunction(best.tour, 'temp: ' + temp);
            }

            // Cool system
            temp *= 1 - coolingRate;
        }
        drawEdgesFunction(best.tour, 'temp: ' + temp);

        return best.tour;
    }

    return {solve: solve};
};

halfdane.tsp.annealingTest = function () {
    'use strict';

    var points = [
        {x: 60, y: 200},
        {x: 180, y: 200},
        {x: 80, y: 180},
        {x: 140, y: 180},
        {x: 20, y: 160},
        {x: 100, y: 160},
        {x: 200, y: 160},
        {x: 140, y: 140},
        {x: 40, y: 120},
        {x: 100, y: 120},
        {x: 180, y: 100},
        {x: 60, y: 80},
        {x: 120, y: 80},
        {x: 180, y: 60},
        {x: 20, y: 40},
        {x: 100, y: 40},
        {x: 200, y: 40},
        {x: 20, y: 20},
        {x: 60, y: 20},
        {x: 160, y: 20}
    ];

    halfdane.tsp.createAnnealing(points, halfdane.drawEdges).solve();
};
