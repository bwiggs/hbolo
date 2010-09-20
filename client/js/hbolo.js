var hbolo = hbolo || {};

UPS = 33;

hbolo = function() {

	var ctx = document.getElementById("canvas").getContext('2d');
	var input = new hbolo.InputManager();	
	var map = new hbolo.MappingSystem('shitbrains');
	var paused = false;
	var player = new hbolo.Sprite({type:"tank"});

	var gameObjects = new Array();
	gameObjects.push(player);
	
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
			
		},
		draw: function() {
			ctx.canvas.width = ctx.canvas.width;
			map.draw(ctx);
			for(i in gameObjects) {
				gameObjects[i].draw(ctx);
			}
		},
		end: function() {
			clearInterval(GameLoop);
		}
	};
	
};
var GameLoop = setInterval("hbolo.loop()", UPS);