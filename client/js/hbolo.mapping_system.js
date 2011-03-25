var hbolo = hbolo || {};

hbolo.MappingSystem = (function() {
	
	var _digest = {},
			_viewportX = 0,
			_viewportY = 0,
			_ctx,
			_path = "/maps/",
			map,
			_mapTileDimensions = {},
			_mapTiles,
      mapBoundaries = {
        x:0,
        y:0
      };
	
	var _priv = {
		loadMap: function(mapName) {
			_path += mapName + "/";
			$.ajax({
				url: _path + 'digest.json',
				success: _priv.buildDigest,
				failure: function() {
					alert("Couldn't load the map _digest\n" + _path);
					GameLoop = false;
				}
			});
		},
		buildDigest: function(json) {
			_digest = eval('(' + json + ')');
			_digest.map.file = _path + "map.png";
			_mapTiles = new Image();
			_mapTiles.onload = function() {_priv.buildMap();};
			_mapTiles.src = _digest.map.file;
		},
		checkMapBoundaryCollision: function(x, y) {
      // get the current tile for the sprite
      x = Math.floor(x/_digest.map.tile_size);
      y = Math.floor(y/_digest.map.tile_size);

			if(x < 0 ||
				 x >= _mapTileDimensions.width-1 ||
				 y < 0 ||
				 y >= _mapTileDimensions.height-1) return true;
		},
		buildMap: function() {
			
      // set the map dimensions
			_mapTileDimensions.height = _digest.map.layout.length;
			_mapTileDimensions.width = _digest.map.layout[0].length;

			// loop through each data row
			for(var y in _digest.map.layout) {

				// get the number of tiles for the row
				var numTiles = _digest.map.layout[y].length;

				for(x = 0; x < numTiles; x++) {

					var currentTile = _digest.map.layout[y].charAt(x),
							sX = _digest.map.tile_mappings[currentTile].split(",")[0],
							sY = _digest.map.tile_mappings[currentTile].split(",")[1],
							mapX = x * _digest.map.tile_size,
							mapY = y * _digest.map.tile_size;

					_ctx.drawImage(_mapTiles, sX, sY, _digest.map.tile_size, _digest.map.tile_size, mapX, mapY, _digest.map.tile_size, _digest.map.tile_size);
				}
			}
			
			// save an encoded version of the image to use during the game
			map = new Image();
			map.onload = function() {
				game.start();
			};
			map.src = _ctx.canvas.toDataURL();
			
		}
	};
	
	var pub = {
		init: function(context, mapName) {
				if(!context) throw "Must pass in the drawing context";
				_ctx = context;
				_priv.loadMap(mapName);
		},
		draw: function() {
			_ctx.drawImage(map, _viewportX, _viewportY);
		},
		getDimensions: function() {
			return _mapTileDimensions;
		},
		getInhabitedTileNode: function(x, y) {
		  return {
				x: Math.floor(y/_digest.map.tile_size),
				y: Math.floor(x/_digest.map.tile_size)
			};
		},
		checkTileCollision: function(x, y) {
			if(_priv.checkMapBoundaryCollision(x, y)) return true;
			var currentTile = _digest.map.layout[Math.floor(y/_digest.map.tile_size)][Math.floor(x/_digest.map.tile_size)];
			for(var i = 0; i < _digest.map.impervious_tiles.length; i++) {
				if(currentTile == _digest.map.impervious_tiles[i]) return true;
			}
			return false;
		}
	};
	
	return pub;
	
})();
