var halfdane = halfdane || {};
halfdane.tsp = halfdane.tsp || {};

halfdane.tsp.enhancePoints = function (points) {
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
            if (!point.name) {
                point.name = "(" + point.x + "/" + point.y + ")";
            }
            return point.name;
        };

        return point;
    }

    return $(points).map(function (index, point) {
        return pointToCity(point);
    });
};

// generate single path tween points:
// * create delaunay triangulation
// * solve tsp on triangulation the greedy way.
halfdane.tsp.nearestNeighbour = function (points, drawEdgesFunction) {

    var triangles = triangulate(halfdane.tsp.enhancePoints(points)),
        tourPoints = [],
        pointmap = {},
        currentPoint,
        maxTripSentry = 2000000000,
        tenPercent = Math.round(points.length / 10),
        count;

    function createPointMap(triangles) {
        var map = {};

        map.allPoints = function () {
            return Object.getOwnPropertyNames(map);
        };

        map.endpointsFromPoint = function (point) {
            return map.endpointsFromString(point.toString());
        };

        map.endpointsFromString = function (pointName) {
            return map[pointName];
        };

        map.hasEndpoints = function (point) {
            return pointmap.endpointsFromPoint(point) !== undefined;
        };

        map.remove = function (point) {
            delete map[point.toString()];
        };


        function addPointAsProperty(point, triangle, map) {
            if (!map[point.toString()]) {
                map[point.toString()] = [];
            }
            if ((triangle.a.x !== point.x || triangle.a.y !== point.y)) {
                map[point.toString()].push(triangle.a);
            }
            if ((triangle.b.x !== point.x || triangle.b.y !== point.y)) {
                map[point.toString()].push(triangle.b);
            }
            if ((triangle.c.x !== point.x || triangle.c.y !== point.y)) {
                map[point.toString()].push(triangle.c);
            }
        }

        $(triangles).each(function (index, triangle) {
            addPointAsProperty(triangle.a, triangle, map);
            addPointAsProperty(triangle.b, triangle, map);
            addPointAsProperty(triangle.c, triangle, map);
        });

        return map;
    }

    pointmap = createPointMap(triangles);

    // start with any point
    currentPoint = triangles[0].a;
    tourPoints.push(currentPoint);

    while (true) {
        var currentEndpoints = pointmap.endpointsFromPoint(currentPoint),
            nearest = maxTripSentry,
            p2 = undefined;

        count += 1;

        // remove current point from point map
        pointmap.remove(currentPoint);

        // choose nearest neighbour from current point
        $(currentEndpoints).each(function (index, point) {
            var d = currentPoint.distanceTo(point);
            if (pointmap.hasEndpoints(point) && d < nearest) {
                p2 = point;
                nearest = d;
            }
        });

        if (!p2) {
            // choose any closest point as endpoint
            $(pointmap.allPoints()).each(function (index, pointname) {
                $(pointmap.endpointsFromString(pointname)).each(function (index, point) {
                    var d = currentPoint.distanceTo(point);
                    if (pointmap.hasEndpoints(point) && d < nearest) {
                        p2 = point;
                        nearest = d;
                    }
                });
            });
        }

        if (!p2) {
            drawEdgesFunction(tourPoints, tourPoints.length + " Punkte", triangles);
            return tourPoints;
        }

        // add edge to edges
        tourPoints.push(p2);
        // use edge's endpoint as current point
        currentPoint = p2;

        if (tourPoints.length % (tenPercent) === 0 ){
            drawEdgesFunction(tourPoints, tourPoints.length + " Punkte", triangles);
        }
    }
};


halfdane.tsp.greedyTest = function (pointsCount) {
    'use strict';

    var points = [],
        i;

    for (i = 0; i <= pointsCount; i += 1) {
        points.push({
            x: Math.random() * 200,
            y: Math.random() * 200
        });
    }


    halfdane.tsp.nearestNeighbour(points, halfdane.drawEdges);
};
