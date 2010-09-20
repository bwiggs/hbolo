var hbolo = hbolo || {};

hbolo.InputManager = function() {
	
	var keyStates = {
		forward: false,
		reverse: false,
		left: false,
		right: false,
		quit: false,
		fire: false
	};
	
	document.onkeypress = function(e) {
		switch(e.keyIdentifier) {

			// forward
			case 'U+0057':
				keyStates['forward'] = true;
				break;

			// backwards
			case 'U+0053':
				keyStates['reverse'] = true;
				break;

			// left
			case 'U+0041':
				keyStates["left"] = true;
				break;

			// right
			case 'U+0044':
				keyStates['right'] = true;
				break;

			// fire weapon
			case 'U+0020':
				keyStates['fire'] = true;
				break;

			// quit game
			case 'U+0051':
				keyStates['quit'] = true;
				break;

			default:
				console.log(e.keyIdentifier);
		}
	};
	
	document.onkeyup = function(e) {
		switch(e.keyIdentifier) {

			// forward
			case 'U+0057':
				keyStates['forward'] = false;
				break;

			// backwards
			case 'U+0053':
				keyStates['reverse'] = false;
				break;

			// left
			case 'U+0041':
				keyStates['left'] = false;
				break;

			// right
			case 'U+0044':
				keyStates['right'] = false;
				break;
				
			// fire weapon
			case 'U+0020':
				keyStates['fire'] = false;
				break;
		}
	};
	
	return {
		getKeyStates: (function() { return keyStates; })(),
	};
	
};