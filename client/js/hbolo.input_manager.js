var hbolo = hbolo || {};

hbolo.InputManager = function() {
	
	var keyStates = {
		forward: false,
		reverse: false,
		left: false,
		right: false,
		quit: false,
		fire: false,
		reset: false,
    toggleHealthBars: false,
    showPlayerNames: false,
    showAITrackingPath: false
	};
	
	document.onkeydown = function(e) {
		switch(e.keyCode) {
	
			// forward
			case 87:
				keyStates['forward'] = true;
				break;
	
			// backwards
			case 83:
				keyStates['reverse'] = true;
				break;
	
			// left
			case 65:
				keyStates["left"] = true;
				break;
	
			// right
			case 68:
				keyStates['right'] = true;
				break;
	
			// fire weapon
			case 32:
				keyStates['fire'] = true;
				break;
	
			// reset game
			case 82:
				keyStates['reset'] = true;
				break;
	
			// quit game
			case 81:
				keyStates['quit'] = true;
				break;

			default:
				//console.log(e.keyCode);
		}
	};

	document.onkeyup = function(e) {

		switch(e.keyCode) {

			// forward
			case 87:
				keyStates['forward'] = false;
				break;

			// backwards
			case 83:
				keyStates['reverse'] = false;
				break;

			// left
			case 65:
				keyStates['left'] = false;
				break;

			// right
			case 68:
				keyStates['right'] = false;
				break;
				
			// fire weapon
			case 32:
				keyStates['fire'] = false;
				break;

			// reset game
			case 82:
				keyStates['reset'] = false;
				break;

		}
	};
	
  document.onkeypress = function(e) {
    switch(e.keyCode) {

      case 116:
        hbolo.Settings.toggle('showAITrackingPath');
        break;

      case 108:
        hbolo.Settings.toggle('showHealthBars');
        hbolo.Settings.toggle('showPlayerNames');
        break;
    }

  };

	return {
		getKeyStates: (function() { return keyStates; })(),
	};
	
};
