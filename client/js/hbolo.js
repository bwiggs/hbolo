var hbolo = hbolo || {};

hbolo = function() {

	var canvas = document.getElementById("canvas").getContext('2d');
	var input = new hbolo.InputManager();	
	var map = new hbolo.MappingSystem('shitbrains');
	
	return {
		update: function() {
			if(input.getKeyStates.quit) {
				this.end();
			}
		},
		loop: function() {
			this.update();
			this.draw();
		},
		draw: function() {
			map.draw(canvas);
		},
		end: function() {
			clearInterval(GameLoop);
		}
	};
	
};
var GameLoop = setInterval("hbolo.loop()", 33);