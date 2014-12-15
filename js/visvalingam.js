'use strict'

var chars = {};
chars.simplify = {};
chars.simplify.algorithms = {};
chars.simplify.algorithms.helper = {};

// Deep-copy any array-type
// http://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript
chars.simplify.algorithms.helper.copy = function (o) {
	var out, v, key;
	out = Array.isArray(o) ? [] : {};
	for (key in o) {
		v = o[key];
		out[key] = (typeof v === "object") ? this.copy(v) : v;
	}
	return out;
};

chars.simplify.algorithms.helper.area = function (point0, point1, point2) {
	var area = Math.abs( ((point1.x - point0.x)*(point2.y - point0.y) - (point2.x - point0.x)*(point1.y - point0.y)) / 2.0 );
	return area;
};

/*function area(t) {
  return Math.abs((t[0][0] - t[2][0]) * (t[1][1] - t[0][1]) - (t[0][0] - t[1][0]) * (t[2][1] - t[0][1]));
  return Math.abs( (t0.x - t2.x) * (t1.y - t0.y) - (t0.x - t1.x) * (t2.y - t0.y) );
}

inline float triArea(ofPoint d0, ofPoint d1, ofPoint d2)
{
	double dArea = ((d1.x - d0.x)*(d2.y - d0.y) - (d2.x - d0.x)*(d1.y - d0.y))/2.0;
	return (dArea > 0.0) ? dArea : -dArea;
}
*/

// Port of https://github.com/ofZach/Visvalingam-Whyatt
chars.simplify.algorithms.visvalingam = function (pointList, toKeep) {
	// Create a copy of the PointList[]
	var newPointList = chars.simplify.algorithms.helper.copy(pointList);
	var size = newPointList.length;

	// if we have 100 points, we have 98 triangles to look at
	var nTriangles = size - 2;


	var triangles = [];
	var triangle;
	var i;

	// Calculamos las areas de todos los triangulos
	for (i = 1; i < size-1; i++) {
		triangle = {};
		// Guardamos los indices de los puntos que forman el triangulo
		triangle.i0 = i - 1;
		triangle.i1 = i;
		triangle.i2 = i + 2:
		triangle.area = chars.simplify.algorithms.helper.area(
			newPointList[ triangle.i0 ],
			newPointList[ triangle.i1 ],
			newPointList[ triangle.i2 ]
			);

		triangles.push(triangle);
	}

	// set the next and prev triangles, use NULL on either end. this helps us update traingles that might need to be removed
	for (i = 0; i < nTriangles; i++) {
		triangles[i].prev = (i == 0 ? null : triangles[i - 1]);
		triangles[i].next = (i == nTriangles-1 ? null : triangles[i + 1]);
	}
	
	var trianglesVec = [];
	
	for (i = 0; i < nTriangles; i++) {
		trianglesVec.push(triangles[i]);
	}
	
	
	var count = 0;
	var tri;

	while (trianglesVec.length !== 0) {

		// ordenamos usando underscore.js
		trianglesVec = _.sortBy(trianglesVec, function (e) { return e.area; });
		
		tri = trianglesVec[0];
		
		// store the "importance" of this point in numerical order of 
		//removal (but inverted, so 0 = most improtant, n = least important.  
		//end points are 0.
		// Almacenamos la importancia en el vertice de enmedio del triangulo
		newPointList[tri.i1].z = size - count;
		count ++;
		
		
		if (tri.prev !== null) {
			tri.prev.next = tri.next;
			tri.prev.i2 = tri.i2;  // check!
			
			tri.prev.area = chars.simplify.algorithms.helper.area(
				newPointList[ tri.prev.i0 ],
				newPointList[ tri.prev.i1 ],
				newPointList[ tri.prev.i2 ]
				);
		}
		
		if (tri.next !== null) {
			tri.next.prev = tri.prev;
			tri.next.i0 = tri.i0;  // check!
			
			
			tri.next.area = chars.simplify.algorithms.helper.area(
				newPointList[ tri.next.i0 ],
				newPointList[ tri.next.i1 ],
				newPointList[ tri.next.i2 ]
				);
		}
		
		// Eliminamos el triangulo inicial
		trianglesVec.splice(0, 1);
	}
};



