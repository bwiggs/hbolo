var hbolo = hbolo || {};

UPS = 33;

hbolo = function() {

	var ctx = document.getElementById("canvas").getContext('2d');
	var input = new hbolo.InputManager();	
	var map = new hbolo.MappingSystem(ctx);
	map.load('shitbrains');
	var paused = false;
	var player = new hbolo.PlayerSprite({type:"tank"});
	var gameObjects = new Array();
	//gameObjects.push(new hbolo.PillBoxSprite({posX:200, posY:200}));
	
	return {
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

			for(i in gameObjects) {
				gameObjects[i].update();
			}
			
		},
		draw: function() {
			// reset the canvas
			ctx.canvas.width = ctx.canvas.width;

			map.draw(ctx);
			player.draw(ctx);
			for(i in gameObjects) {
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
		}
	};
	
};
var GameLoop = setInterval("game.loop()", UPS);