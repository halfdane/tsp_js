var halfdane = halfdane || {};
halfdane.tsp = halfdane.tsp || {};

halfdane.tsp.createLinKernighan = function (pointSet) {
    'use strict';

    var tourManager = halfdane.tsp.createTourManager(pointSet),
        createTour = halfdane.tsp.tourCreator(tourManager);


    function createSolver() {
        return function solve() {
            var tour = createTour().usingTourManagersPoints(),
                i,
                ii;

            console.log("Initial solution distance: " + tour.getDistance());

            for (i = 0; i < tour.tourSize(); i += 1) {
                // consecutively swap cities around
                for (ii = i; ii < tour.tourSize(); ii += 1) {
                    if (ii === i) {
                        continue;
                    }

                    var newSolution = createTour().usingCities(tour.tour);

                    // Swap two cities
                    newSolution.setCity(ii, newSolution.getCity(i));
                    newSolution.setCity(i, newSolution.getCity(ii));

                    // Decide if we should accept the neighbour
                    if (tour.getDistance() > newSolution.getDistance()) {
                        tour = newSolution;
                    }
                }
            }
            console.log("Final solution distance: " + tour.getDistance());

            return tour.tour;
        };
    }

    return {solve: createSolver()};
};

halfdane.tsp.kOptTest = function () {
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

    halfdane.tsp.createLinKernighan(points).solve();
};

halfdane.tsp.kOptTest();