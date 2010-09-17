var hbolo = hbolo || {};

var hbolo = {
	map: undefined,
	canvas: undefined,
	tileSize: 16,
	mapData: [
		"wwwwwwwwwwwwwwwwwwss",
		"wwwwwwwwwwwwwwssssgg",
		"wwwwwwwwwwsssssggggg",
		"wwwwwwwwwssssggggggg",
		"wwwwwwwssssggggggggg",
		"wwwwssssgggggggggggb",
		"wwssssssggggggggggbb",
		"wwsssgggggggggggbbbb",
		"wwsssggggggggggbbbbb",
		"wwsssgggggggggbbbbbb",
		"wwsssggggggggbbbbbbb",
		"wwsssgggggggbbbbbbbb",
		"wwsssggggggbbbbbbbbb",
		"wwsssgggggbbbbbbbbbb",
		"wwsssggggbbbbbbbbbbb"
	],
	mapConversion: {
		g: "0,16",
		w: "16,16",
		b: "16,0",
		s: "0,0"
	},
	init: function() {
		hbolo.canvas = document.getElementById("canvas").getContext('2d');
		hbolo.map = new Image();
		hbolo.map.src = "maps/map.png";
		this.map.onload = hbolo.loadMap();
	},
	loadMap: function() {
		for(y in hbolo.mapData) {
			var numTiles = hbolo.mapData[y].length;
			for(x = 0; x < numTiles; x++) {
				var currentTile = hbolo.mapData[y].charAt(x);
				var sX = hbolo.mapConversion[currentTile].split(",")[0];
				var sY = hbolo.mapConversion[currentTile].split(",")[1];
				var mapX = x * hbolo.tileSize;
				var mapY = y * hbolo.tileSize;
				console.log(x + ' ' + currentTile + ": " + sX + "," + sY);
				console.log(x + ' ' + "map: " + mapX + "," + mapY);
				hbolo.canvas.drawImage(hbolo.map, sX, sY, hbolo.tileSize, hbolo.tileSize, mapX, mapY, hbolo.tileSize, hbolo.tileSize);
			}
			console.log("break");
		}
	},
};