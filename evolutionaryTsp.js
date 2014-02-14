var halfdane = halfdane || {};
halfdane.tsp = halfdane.tsp || {};

halfdane.tsp.createEvolutionary = function (pointSet, drawEdgesFunction) {
    'use strict';

    var tourManager = halfdane.tsp.createTourManager(pointSet),
        createTour = halfdane.tsp.tourCreator(tourManager),

        createPopulation = function (populationSize, initialise) {
            var p = {};
            p.tours = [];

            p.saveTour = function (index, tour) {
                p.tours[index] = tour;
            };

            p.getTour = function (index) {
                return p.tours[index];
            };

            p.getFittest = function () {
                var fittest = p.getTour(0),
                    i;
                // Loop through individuals to find fittest
                for (i = 1; i < populationSize; i++) {
                    if (fittest.getFitness() <= p.getTour(i).getFitness()) {
                        fittest = p.getTour(i);
                    }
                }
                return fittest;
            };

            p.populationSize = function () {
                return p.tours.length;
            };

            // If we need to initialise a population of tours do so
            var i;
            // Loop and create individuals
            for (i = 0; i < populationSize; i++) {
                if (initialise) {
                    var newTour = createTour().usingTourManagersPoints();
                    p.tours.push(newTour);
                } else {
                    p.tours.push(undefined);
                }
            }

            return p;
        },

        createGA = function () {
            var ga = {};

            ga.mutationRate = 0.055;
            ga.tournamentSize = 5;
            ga.elitism = true;

            ga.evolvePopulation = function (pop) {
                var newPopulation = createPopulation(pop.populationSize(), false),

                // Keep our best individual if elitism is enabled
                    elitismOffset = 0;
                if (ga.elitism) {
                    newPopulation.saveTour(0, pop.getFittest());
                    elitismOffset = 1;
                }

                // Crossover population
                // Loop over the new population's size and create individuals from
                // Current population
                var i;
                for (i = elitismOffset; i < newPopulation.populationSize(); i += 1) {
                    // Select parents
                    var parent1 = ga.tournamentSelection(pop),
                        parent2 = ga.tournamentSelection(pop),
                    // Crossover parents
                        child = ga.crossover(parent1, parent2);
                    // Add child to new population
                    newPopulation.saveTour(i, child);
                }

                // Mutate the new population a bit to add some new genetic material
                for (i = elitismOffset; i < newPopulation.populationSize(); i += 1) {
                    ga.mutate(newPopulation.getTour(i));
                }

                return newPopulation;
            };

            ga.crossover = function (parent1, parent2) {
                // Create new child tour
                var child = createTour().usingBlanks(),

                // Get start and end sub tour positions for parent1's tour
                    startPos = Math.floor(Math.random() * parent1.tourSize()),
                    endPos = Math.floor(Math.random() * parent1.tourSize()),
                    i,
                    ii;

                // Loop and add the sub tour from parent1 to our child
                for (i = 0; i < child.tourSize(); i += 1) {
                    // If our start position is less than the end position
                    if (startPos < endPos && i > startPos && i < endPos) {
                        child.setCity(i, parent1.getCity(i));
                    } // If our start position is larger
                    else if (startPos > endPos) {
                        if (!(i < startPos && i > endPos)) {
                            child.setCity(i, parent1.getCity(i));
                        }
                    }
                }

                // Loop through parent2's city tour
                for (i = 0; i < parent2.tourSize(); i += 1) {
                    // If child doesn't have the city add it
                    if (!child.containsCity(parent2.getCity(i))) {
                        // Loop to find a spare position in the child's tour
                        for (ii = 0; ii < child.tourSize(); ii += 1) {
                            // Spare position found, add city
                            if (child.getCity(ii) === null) {
                                child.setCity(ii, parent2.getCity(i));
                                break;
                            }
                        }
                    }
                }
                return child;
            };

            ga.mutate = function (tour) {
                var tourPos1,
                    tourPos2;
                // Loop through tour cities
                for (tourPos1 = 0; tourPos1 < tour.tourSize(); tourPos1++) {
                    // Apply mutation rate
                    if (Math.random() < ga.mutationRate) {
                        // Get a second random position in the tour
                        tourPos2 = Math.floor(tour.tourSize() * Math.random());

                        // Get the cities at target position in tour
                        var city1 = tour.getCity(tourPos1);
                        var city2 = tour.getCity(tourPos2);

                        // Swap them around
                        tour.setCity(tourPos2, city1);
                        tour.setCity(tourPos1, city2);
                    }
                }
            };

            ga.tournamentSelection = function (pop) {
                // Create a tournament population
                var tournament = createPopulation(ga.tournamentSize, false),
                    i;
                // For each place in the tournament get a random candidate tour and
                // add it
                for (i = 0; i < ga.tournamentSize; i += 1) {
                    var randomId = Math.floor(Math.random() * pop.populationSize());
                    tournament.saveTour(i, pop.getTour(randomId));
                }
                // Get the fittest tour
                return tournament.getFittest();
            };

            return ga;
        };

    function createSolver(ga) {
        return function solve() {
            var pop = createPopulation(50, true),
                i;
            drawEdgesFunction(pop.getFittest().tour, "Ausgangstour");
            pop = ga.evolvePopulation(pop);
            for (i = 0; i <= 100; i += 1) {
                pop = ga.evolvePopulation(pop);
                if (i%10 ===0) {
                    drawEdgesFunction(pop.getFittest().tour, "Fittest of generation "+i);
                }
            }
            return pop.getFittest().tour;
        };
    }

    return {solve: createSolver(createGA())};
};

halfdane.tsp.evolutionaryTest = function () {
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

    halfdane.tsp.createEvolutionary(points, halfdane.drawEdges).solve();
};
