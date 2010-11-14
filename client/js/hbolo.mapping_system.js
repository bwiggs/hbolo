var hbolo = hbolo || {};

hbolo.MappingSystem = (function() {
	
	var digest = {},
			viewportX = 0,
			viewportY = 0,
			ctx,
			path = "/maps/",
			map,
			dimensions = {},
			mapTiles;
	
	var self = {
		loadMap: function(mapName) {
			path += mapName + "/";
			$.ajax({
				url: path + 'digest.json',
				success: function(json) {self.buildDigest(json); },
				failure: function() {
					alert("Couldn't load the map digest\n" + path);
					GameLoop = false;
				}
			});
		},
		buildDigest: function(json) {
			digest = eval('(' + json + ')');
			digest.map.file = path + "map.png";
			mapTiles = new Image();
			mapTiles.onload = function() {self.buildMap();};
			mapTiles.src = digest.map.file;
		},
		checkMapBoundaryCollision: function(x, y) {
			if(x <= 0 ||
				 x >= map.width ||
				 y <=0 ||
				 y >= map.height) return true;
		},
		buildMap: function() {
			// set the map dimensions
			dimensions.height = digest.map.layout.length;
			dimensions.width = digest.map.layout[0].length;

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
			map.onload = function() {
				game.start();
			};
			map.src = ctx.canvas.toDataURL();
			
		}
	};
	
	var pub = {
		init: function(context, mapName) {
				if(!context) throw "Must pass in the drawing context";
				ctx = context;
				self.loadMap(mapName);
		},
		draw: function() {
			ctx.drawImage(map, viewportX, viewportY);
		},
		getDimensions: function() {
			return dimensions;
		},
		getInhabitedTileNode: function(x, y) {
		  return {
				x: Math.floor(y/digest.map.tile_size),
				y: Math.floor(x/digest.map.tile_size)
			};
		},
		checkTileCollision: function(x, y) {
			if(self.checkMapBoundaryCollision(x, y)) return true;
			var currentTile = digest.map.layout[Math.floor(y/digest.map.tile_size)][Math.floor(x/digest.map.tile_size)];
			for(var i = 0; i < digest.map.impervious_tiles.length; i++) {
				if(currentTile == digest.map.impervious_tiles[i]) return true;
			}
			return false;
		}
	};
	
	return pub;
	
})();