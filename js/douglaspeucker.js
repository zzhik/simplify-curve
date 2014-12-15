'use strict'

var chars = {};
chars.simplify = {};
chars.simplify.algorithms = {};
chars.simplify.algorithms.helper = {};



//Compute the dot product AB . AC
chars.simplify.algorithms.helper.dotProduct = function (pointA, pointB, pointC) {
	var ab; // point
	var bc; // point
	
	ab.x = pointB.x - pointA.x;
	ab.y = pointB.y - pointA.y;
	bc.x = pointC.x - pointB.x;
	bc.y = pointC.y - pointB.y;

	var dot = (ab.x * bc.x) + (ab.y * bc.y);

	return dot;
};

//Compute the cross product AB x AC
chars.simplify.algorithms.helper.crossProduct = function (pointA, pointB, pointC) {
	var ab; // point
	var ac; // point

	ab.x = pointB.x - pointA.x;
	ab.y = pointB.y - pointA.y;
	ac.x = pointC.x - pointA.x;
	ac.y = pointC.y - pointA.y;
	
	var cross = (ab.x * ac.y) - (ab.y * ac.x);

	return cross;
};

//Compute the distance from A to B
chars.simplify.algorithms.helper.distance = function (pointA, pointB) {
	var dx = pointA.x - pointB.x;
	var dy = pointA.y - pointB.y;

	return Math.sqrt( (dx * dx) + (dy * dy) );
};

//Compute the distance from AB to C
//if isSegment is true, AB is a segment, not a line.
// http://stackoverflow.com/a/4448097
chars.simplify.algorithms.helper.lineToPointDistance2D = function (line, point, bool isSegment) {
	var pointA = line.startPoint;
	var pointB = line.endPoint;
	var pointC = point;

	var dist = this.crossProduct(pointA, pointB, pointC) / this.distance(pointA, pointB);
	if (isSegment) {
		var dot1 = this.dotProduct(pointA, pointB, pointC);
		if (dot1 > 0) return this.distance(pointB, pointC);

		var dot2 = this.dotProduct(pointB, pointA, pointC);
		if (dot2 > 0) return this.distance(pointA, pointC);
	}

	return Math.abs(dist);
};


chars.simplify.algorithms.helper.shortestDistanceToSegment = function (point, segment) {
	return this.lineToPointDistance2D(segment, point, true);
};


// http://en.wikipedia.org/wiki/Ramer–Douglas–Peucker_algorithm
chars.simplify.algorithms.douglasPeucker = function (pointList, epsilon) {
	// Encontramos el punto con la distancia maxima que no sean el primero y el ultimo punto del segmento
	var dmax = 0;
	var index = 0;
	var endIndex = pointList.length - 1;
	var i;
	var d;

	var recResults1;
	var recResults2;
	var resultList;

	for (i = 1; i < endIndex; i++) {
		d = this.helper.shortestDistanceToSegment(pointList[i], { startPoint : pointList[0], endPoint : pointList[endIndex] });
		if (d > dmax) {
			index = i;
			dmax = d;
		}
	}

	// If max distance is greater than epsilon, recursively simplify
	if (dmax > epsilon) {
		// Recursive call - Se usar el +1 debido a que slice no incluye el ultimo elemento dado
		recResults1 = this.douglasPeucker(pointList.slice(0, index + 1), epsilon);
		recResults2 = this.douglasPeucker(pointList.slice(index, endIndex + 1), epsilon);

		// Build the result list - Nos aseguramos de no incluir el ultimo punto de la primera
		// lista, ya que coincide con el primer punto de la segunda lista.
		resultList = { recResults1.slice(0, recResults1.length - 1).concat(recResults2) }
	} else {
		// Si no hay una distancia a un punto superior a epsilon descartamos todos los puntos
		// intermedios y devolvemos solo los extremos del segmento
		resultList = [ pointList[0], pointList[endIndex] ];
	}
};

