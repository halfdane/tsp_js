var halfdane = halfdane || {};
halfdane.tsp = halfdane.tsp || {};

halfdane.tsp.createTourManager = function (initialPoints) {
    'use strict';

    var distances = {};

    function pointToCity(point) {
        point.distanceTo = function (otherPoint) {
            if (distances[point.toString() + "_" + otherPoint.toString()]) {
                return distances[point.toString() + "_" + otherPoint.toString()];
            }

            if (distances[otherPoint.toString() + "_" + point.toString()]) {
                return distances[otherPoint.toString() + "_" + point.toString()];
            }

            var xDistance = Math.abs(point.x - otherPoint.x),
                yDistance = Math.abs(point.y - otherPoint.y),
                distance = (xDistance * xDistance) + (yDistance * yDistance);

            distances[this.toString() + "_" + otherPoint.toString()] = distance;
            return distance;
        };

        point.toString = function () {
            return "(" + point.x + "/" + point.y + ")";
        };

        return point;
    }

    var t = {};

    t.destinationCities = $(initialPoints).map(function (index, point) {
        return pointToCity(point);
    });

    t.getCities = function () {
        return t.destinationCities;
    };

    t.getCity = function (index) {
        return t.destinationCities[index];
    };

    t.numberOfCities = function () {
        return t.destinationCities.length;
    };

    return t;
};

halfdane.tsp.tourCreator = function (tourManager) {
    'use strict';

    return function () {
        var t = {};
        t.tour = [];
        t.fitness = 0;
        t.distance = 0;

        t.usingBlanks = function () {
            var i;
            for (i = 0; i < tourManager.numberOfCities(); i++) {
                t.tour.push(null);
            }
            return t;
        };

        t.usingCities = function (cities) {
            $(cities).each(function (index, city) {
                t.setCity(index, city);
            });
            return t;
        };

        t.usingTourManagersPoints = function () {
            t.usingCities(tourManager.getCities());
            return t;
        };

        t.generateIndividual = function () {
            t.usingTourManagersPoints();
            // Randomly reorder the tour
            t.tour.sort(function () {
                return 0.5 - Math.random();
            });

            return t;
        };

        t.getCity = function (tourPosition) {
            return t.tour[tourPosition];
        };

        t.setCity = function (tourPosition, city) {
            t.tour[tourPosition] = city;
            // If the tours been altered we need to reset the fitness and distance
            t.fitness = 0;
            t.distance = 0;
        };

        t.getFitness = function () {
            if (t.fitness === 0) {
                t.fitness = 1 / t.getDistance();
            }
            return t.fitness;
        };

        t.getDistance = function () {
            if (t.distance === 0) {
                var tourDistance = 0,
                    cityIndex;
                // Loop through our tour's cities
                for (cityIndex = 0; cityIndex < t.tourSize(); cityIndex += 1) {
                    // Get city we're travelling from
                    var fromCity = t.getCity(cityIndex),
                    // City we're travelling to
                        destinationCity;
                    // Check we're not on our tour's last city, if we are set our
                    // tour's final destination city to our starting city
                    if (cityIndex + 1 < t.tourSize()) {
                        destinationCity = t.getCity(cityIndex + 1);
                    }
                    else {
                        destinationCity = t.getCity(0);
                    }
                    // Get the distance between the two cities
                    tourDistance += fromCity.distanceTo(destinationCity);
                }
                t.distance = tourDistance;
            }
            return t.distance;
        };

        t.tourSize = function () {
            return t.tour.length;
        };

        // Check if the tour contains a city
        t.containsCity = function (city) {
            var i;
            for (i = 0; i < t.tour.length; i += 1) {
                if (t.tour[i] === city) {
                    return true;
                }
            }
            return false;
        };

        t.toString = function () {
            var geneString = "|",
                i;
            for (i = 0; i < t.tourSize(); i += 1) {
                geneString += t.getCity(i).toString() + "|";
            }
            return geneString;
        };

        return t;
    };
};

halfdane.drawEdges = function (points, string, triangles) {
    'use strict';

    var context = $('<canvas></canvas>')
        .attr('height', 300)
        .attr('width', 200)
        .appendTo($('.target'))
        [0]
        .getContext('2d');

    if (triangles) {
        context.strokeStyle = '#ddd';
        $(triangles).each(function (index, triangle) {
            triangle.draw(context);
        });
    }

    context.strokeStyle = '#000';

    context.beginPath();
    context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    $(points).each(function (index, point) {
        context.lineTo(point.x, point.y);
    });
    context.closePath();
    context.stroke();
    context.fillStyle = '#000';
    context.textBaseline = 'bottom';
    context.fillText(string, 10, 250);
};
