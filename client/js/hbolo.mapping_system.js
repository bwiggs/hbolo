var hbolo = hbolo || {};

hbolo.MappingSystem = (function() {
	
	var digest = {},
			baseX = 0,
			baseY = 0,
			ctx,
			path = "/maps/",
			map;
	
	var self = {
		loadMap: function(mapName) {
			path += mapName + "/";
			$.ajax({
				url: path + 'digest.json',
				success: function(json) {self.loadSuccess(json); },
				failure: function() {
					alert("Couldn't load the map digest\n" + path);
					GameLoop = false;
				}
			});
		},
		loadSuccess: function(json) {
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
			map.onLoad = (function() {game.start();})();
		}
	};
	
	var pub = {
		init: function(context, mapName) {
				if(!context) throw "Must pass in the drawing context";
				ctx = context;
				self.loadMap(mapName);
		},
		draw: function() {
			ctx.drawImage(map, baseX, baseY);
		},
		checkTileCollision: function(x, y) {
			var currentTile = digest.map.layout[Math.floor(y/digest.map.tile_size)][Math.floor(x/digest.map.tile_size)];
			for(var i = 0; i < digest.map.impervious_tiles.length; i++) {
				if(currentTile == digest.map.impervious_tiles[i]) return true;
			}
			return false;
		}
	};
	
	return pub;
	
})();