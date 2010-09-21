var hbolo = hbolo || {};

UPS = 33;

game = function() {

	var self = {
		ctx:undefined,
		input:undefined,
		map:undefined,
		paused:undefined,
		player:undefined,
		gameObjects:undefined
	};

	var pub = {
		init: function() {
			self.ctx = document.getElementById("canvas").getContext('2d');
			self.input = new hbolo.InputManager();	
			self.map = new hbolo.MappingSystem(self.ctx);
			self.map.load('shitbrains');
			self.paused = false;
			self.player = new hbolo.PlayerSprite({type:"tank"});
			self.gameObjects = new Array();
		},
		loop: function() {
			if(! self.paused) {
				this.update();
				this.draw();
			}
		},
		update: function() {
			if(self.input.getKeyStates.quit) {
				this.end();
				return;
			}
			self.player.update(self.input);

			for(var i in self.gameObjects) {
				self.gameObjects[i].update();
			}
			
		},
		draw: function() {
			// reset the canvas
			self.ctx.canvas.width = self.ctx.canvas.width;

			self.map.draw(self.ctx);
			self.player.draw(self.ctx);
			for(var i in self.gameObjects) {
				self.gameObjects[i].draw(self.ctx);
			}
		},
		end: function() {
			clearInterval(GameLoop);
		},
		addGameObject: function(object) {
			self.gameObjects.push(object);
		},
		removeGameObject: function(object) {
			var idx = self.gameObjects.indexOf(object);
			if(idx != -1) {
				self.gameObjects.splice(idx, 1);
			}
		},
		start: function() {
			GameLoop = setInterval("game.loop()", UPS);
		}
	};
	
	return pub;
}();
