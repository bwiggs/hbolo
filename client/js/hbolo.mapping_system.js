var MappingSystem = MappingSystem || function(ctx, mapName) {
	
	var canvas = ctx,
			map,
			digest;
	
	var loadMap = function(mapName) {

		var path = "/maps/" + mapName + "/";
		
		// load the map digest from the server
		$.ajax({
			url: path + 'digest.json',
			success: function(json) {
				digest = eval('(' + json + ')');
				digest.map.file = path + "map.png";
				map = new Image();
				map.src = digest.map.file;
				map.onload = draw();
			},
			failure: function() {
				alert("Couldn't load the map digest\n" + path);
			}
		});
		
	};
		
	var draw = function() {
		
		// loop through each data row
		for(y in digest.map.layout) {

			// get the number of tiles for the row
			var numTiles = digest.map.layout[y].length;
			
			for(x = 0; x < numTiles; x++) {

				var currentTile = digest.map.layout[y].charAt(x),
						sX = digest.map.tile_mappings[currentTile].split(",")[0],
						sY = digest.map.tile_mappings[currentTile].split(",")[1],
						mapX = x * digest.map.tile_size,
						mapY = y * digest.map.tile_size;
						
				// console.log(x + ' ' + currentTile + ": " + sX + "," + sY);
				// //console.log(x + ' ' + "map: " + mapX + "," + mapY);
				canvas.drawImage(map, sX, sY, digest.map.tile_size, digest.map.tile_size, mapX, mapY, digest.map.tile_size, digest.map.tile_size);
			}
		}
	};

	
	loadMap(mapName);
};