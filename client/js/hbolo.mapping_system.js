var hbolo = hbolo || {};

hbolo.MappingSystem = function(mapName) {
	
	var digest = {},
			path = "/maps/" + mapName + "/",
			baseX = 0,
			baseY = 0;
	
	// load the map digest from the server
	$.ajax({
		url: path + 'digest.json',
		success: function(json) {
			digest = eval('(' + json + ')');
			digest.map.file = path + "map.png";
			map = new Image();
			map.src = digest.map.file;
		},
		failure: function() {
			alert("Couldn't load the map digest\n" + path);
			GameLoop = false;
		}
	});	
	
	return {
		draw: function(canvas) {

			// loop through each data row
			for(y in digest.map.layout) {

				// get the number of tiles for the row
				var numTiles = digest.map.layout[y].length;

				for(x = 0; x < numTiles; x++) {

					var currentTile = digest.map.layout[y].charAt(x),
							sX = digest.map.tile_mappings[currentTile].split(",")[0],
							sY = digest.map.tile_mappings[currentTile].split(",")[1],
							mapX = baseX + (x * digest.map.tile_size),
							mapY = baseY + (y * digest.map.tile_size);

					canvas.drawImage(map, sX, sY, digest.map.tile_size, digest.map.tile_size, mapX, mapY, digest.map.tile_size, digest.map.tile_size);
				}
			}
		}
	};
};