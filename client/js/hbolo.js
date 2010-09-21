var UPS = 100;

var game = (function() {
	
	var ctx,
			input,
			map,
			paused,
			player,
			gameObjects;

	var pub = {
		init: function() {
			ctx = document.getElementById("canvas").getContext('2d');
			input = new hbolo.InputManager();	
			map = hbolo.MappingSystem,
			map.init(ctx, 'shitbrains');
			paused = false;
			player = new hbolo.PlayerSprite({type:"tank"});
			gameObjects = new Array();
			gameObjects.push(new hbolo.EnemySprite({type:"tank"}));
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
			player.update(input);

			for(var i in gameObjects) {
				gameObjects[i].update();
			}
			
		},
		draw: function() {
			// reset the canvas
			ctx.canvas.width = ctx.canvas.width;

			map.draw(ctx);
			player.draw(ctx);
			for(var i in gameObjects) {
				gameObjects[i].draw(ctx);
			}
		},
		end: function() {
			clearInterval(GameLoop);
		},
		addGameObject: function(object) {
			gameObjects.push(object);
		},
		removeGameObject: function(object) {
			var idx = gameObjects.indexOf(object);
			if(idx != -1) {
				gameObjects.splice(idx, 1);
			}
		},
		getGameObjects: function() {
			return gameObjects;
		},
		start: function() {
			GameLoop = setInterval("game.loop()", UPS);
		}
	};
	
	return pub;
})();
