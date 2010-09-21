PI = Math.PI;

function deg2rad(deg) {
	return deg * PI/180
}

Math.Pythagoras = function(x1, y1, x2, y2) {
	return Math.sqrt(
		Math.pow((x1-x2), 2) + Math.pow((y1 - y2), 2)
	);
};


var Physics = Physics || {};

Physics.collision = function(a, b) {
	//console.log("enemy: " + a.x + "," + a.y);
	console.log("object: " + b.x + "," + b.y);
	//console.log(Math.Pythagoras(a.x,a.y,b.x,b.y));
	return ((a.r + b.r) > Math.Pythagoras(a.x,a.y,b.x,b.y));
};