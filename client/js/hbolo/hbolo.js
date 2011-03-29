var UPS = 33;

var hbolo = hbolo || {};
hbolo.Settings = {
  toggle: function(settingName) {
    hbolo.Settings[settingName] = !hbolo.Settings[settingName];
  },
  togglePlayerNames: false,
  showHealthBars: false,
  showAITrackingPath: false
};

var game = (function() {
	
	var ctx,
			input,
			paused,
			player,
			gameObjects,
			map;

	var pub = {
		init: function() {
			ctx = document.getElementById("canvas").getContext('2d');
			input = new hbolo.InputManager();	
			map = hbolo.MappingSystem;
			map.init(ctx, 'maze');
			paused = false;
			player = new hbolo.PlayerSprite({type:"tank"});
			gameObjects = {
				imperviousSprites: [],
				damagingSprites: []
			};
			gameObjects.imperviousSprites.push(new hbolo.EnemySprite({type:"tank"}));
      //game.addImperviousSprite(new hbolo.PillBoxSprite({posX:285,posY:53}));
      //gameObjects.imperviousSprites.push(new hbolo.PillBoxSprite({posX:300,posY:300}));
			//gameObjects.imperviousSprites.push(new hbolo.EnemySprite({type:"tank"}));
		},
		loop: function() {
			if(! paused) {
				this.update();
				this.draw();
			}
		},
		update: function() {

			if(input.getKeyStates.quit) {
				this.end();
				return;
			}

      // toggle overlay display settings
      if(input.getKeyStates.showAITrackingPath) {
				hbolo.Settings.showAITrackingPath = !hbolo.Settings.showAITrackingPath;
			}
      if(input.getKeyStates.showHealthBars) {
        hbolo.Settings.showHealthBars = !hbolo.Settings.showHealthBars;
			}
      if(input.getKeyStates.showPlayerNames) {
				hbolo.Settings.showPlayerNames = !hbolo.Settings.showPlayerNames;
			}

			player.update(input);

			for(var i in gameObjects) {
				for(var j in gameObjects[i]) {
					gameObjects[i][j].update();
				}
			}
			
		},
		draw: function() {
			// reset the canvas
			ctx.canvas.width = ctx.canvas.width;

			map.draw(ctx);
			player.draw(ctx);
			for(var i in gameObjects) {
				for(var j in gameObjects[i]) {
					gameObjects[i][j].draw(ctx);
				}
			}
		},
		end: function() {
			clearInterval(GameLoop);
		},
		addDamagingSprite: function(object) {
			gameObjects.damagingSprites.push(object);
		},
		removeDamagingSprite: function(object) {
			var idx = gameObjects.damagingSprites.indexOf(object);
			if(idx != -1) {
				gameObjects.damagingSprites.splice(idx, 1);
			}
		},
		addImperviousSprite: function(object) {
			gameObjects.imperviousSprites.push(object);
		},
		removeImperviousSprite: function(object) {
			var idx = gameObjects.imperviousSprites.indexOf(object);
			if(idx != -1) {
				gameObjects.imperviousSprites.splice(idx, 1);
			}
		},
		getGameObjects: function() {
			return gameObjects;
		},
		start: function() {
			GameLoop = setInterval("game.loop()", UPS);
		},
		mapCollision: function(x, y){
			return map.checkTileCollision(x, y);
		},
		getPlayer: function() {
			return player;
		},
		getMap: function() {
			return map;
		}
	};
	
	return pub;
	
})();
