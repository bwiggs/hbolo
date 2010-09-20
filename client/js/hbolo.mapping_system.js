var hbolo = hbolo || {};

hbolo.MappingSystem = function(ctx) {
	
	var digest = {},
			baseX = 0,
			baseY = 0,
			ctx = ctx,
			map;
	
	return {
		/**
		* Takes care of loading a map from the server and building the map png image.
		*/
		load: function(mapName) {
			var path = "/maps/" + mapName + "/";
			// load the map digest from the server
			$.ajax({
				url: path + 'digest.json',
				success: function(json) {
					digest = eval('(' + json + ')');
					digest.map.file = path + "map.png";
					var mapTiles = new Image();
					mapTiles.src = digest.map.file;

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

							ctx.drawImage(mapTiles, sX, sY, digest.map.tile_size, digest.map.tile_size, mapX, mapY, digest.map.tile_size, digest.map.tile_size);
						}
					}
					// save an encoded version of the image to use during the game
					map = new Image();
					map.src = ctx.canvas.toDataURL();
				},
				failure: function() {
					alert("Couldn't load the map digest\n" + path);
					GameLoop = false;
				}
			});
		},
		draw: function() {
			ctx.drawImage(map, baseX, baseY);
		}
	};
};