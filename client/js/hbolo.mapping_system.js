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
      _imperviousTiles = [],
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
      _imperviousTiles = _digest.map.impervious_tiles;
		},
		checkMapBoundaryCollision: function(tileX, tileY) {
      // get the current tile for the sprite
      tileX = Math.floor(tileX/_digest.map.tile_size);
      tileY = Math.floor(tileY/_digest.map.tile_size);

			if(tileX < 0 ||
				 tileX >= _mapTileDimensions.width-1 ||
				 tileY < 0 ||
				 tileY >= _mapTileDimensions.height-1) return true;
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

      // convert sprite x,y to tile x, y
      x = Math.floor(x/_digest.map.tile_size);
      y = Math.floor(y/_digest.map.tile_size);

      // check if we're at the side of the map
			if(_priv.checkMapBoundaryCollision(x, y)) {
        return true;
      };
      
      // check if we've hit a tile
      var currentTile = _digest.map.layout[y][x];
      for(var i = 0, len = _imperviousTiles.length; i < len; i++) {
        if(currentTile == _imperviousTiles[i]) {
          return true;
        }
      }
			return false;
		}
	};
	
	return pub;
	
})();
