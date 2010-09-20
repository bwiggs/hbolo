var hbolo = hbolo || {};

hbolo.Sprite = function(data) {

	var image = new Image(),
			velocity = 0.0,
			acceleration = 0.05,
			deceleration = 0.03,
			maxSpeed = 1.5,
			rotation = 0,
			rotationSpeed = 4, // this is in degrees
			posX,
			posY;

	switch(data.type) {
		case "tank":
			image.src = "/tanks/blue.png";
			break;
		default:
			throw "Sprite(): Must provide an asset type.";
	}
	
	return {
		update: function(input) {

			// UPDATE MOVEMENT VELOCITIES
			// moving forward
			if(velocity > 0) {
				if(! input.getKeyStates.forward) {
					if(velocity >= deceleration) velocity -= deceleration;
					else velocity = 0;
				}
			// moving backwards
			} else if(velocity < 0) {
				if(! input.getKeyStates.reverse) {
					if(velocity <= deceleration) velocity += deceleration;
					else velocity = 0;
				}
			}

			// HANDLE USE INPUT
			if(input.getKeyStates.forward) {
				if(velocity < maxSpeed) velocity += acceleration;
			}
			if(input.getKeyStates.reverse) {
				if(velocity > -maxSpeed) velocity -= acceleration;
			}
			
			if(input.getKeyStates.left) {
				rotation -= rotationSpeed;
			}
			if(input.getKeyStates.right) {
				rotation += rotationSpeed;
			}

		},
		draw: function(ctx) {

			if(!ctx) throw "Must pass the drawing context";
			if(posX === undefined) posX = ctx.canvas.width/2;
			if(posY === undefined) posY = ctx.canvas.height/2;
			
			// crazy vector math stuff going on here
			posX += Math.sin(deg2rad(rotation)) * velocity;
			posY -= Math.cos(deg2rad(rotation)) * velocity;
			
			ctx.save();
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(deg2rad(rotation));
			ctx.drawImage(image, -(image.width/2),-(image.height/2));
			ctx.restore();
		}
	};
	
};