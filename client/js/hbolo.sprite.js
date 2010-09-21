var hbolo = hbolo || {};

hbolo.PlayerSprite = function(data) {

	var image = new Image(),
			velocity = 0.0,
			acceleration = 0.05,
			deceleration = 0.08,
			maxSpeed = 1.5,
			currentAngle = 0,
			rotationSpeed = 4, // how fast we rotate
			weaponCooldown = 10,
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

			if(input.getKeyStates.reset) {
				posX = undefined;
				posY = undefined;
			}

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
				currentAngle -= rotationSpeed;
			}
			if(input.getKeyStates.right) {
				currentAngle += rotationSpeed;
			}
			
			
			// cool down our weapons
			if(weaponCooldown > 0) {
				weaponCooldown--;
			}
			
			if(input.getKeyStates.fire) {
				if(weaponCooldown == 0) {
					weaponCooldown = 0;
					game.addGameObject(new hbolo.FlameThrowerSprite({
						angle:currentAngle,
						posX: posX,
						posY: posY
					}));
				}
			}

		},
		draw: function(ctx) {

			if(!ctx) throw "Must pass the drawing context";
			if(posX === undefined) posX = ctx.canvas.width/2;
			if(posY === undefined) posY = ctx.canvas.height/2;

			// crazy vector math stuff going on here
			posX += Math.sin(deg2rad(currentAngle)) * velocity;
			posY -= Math.cos(deg2rad(currentAngle)) * velocity;
			
			ctx.save();
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(deg2rad(currentAngle));
			ctx.drawImage(image, -(image.width/2),-(image.height/2));
			ctx.restore();
		}
	};
	
};

hbolo.MachineGunSprite = function(data) {

	var velocity = 5,
			angle = data.angle,
			posX = data.posX,
			posY = data.posY,
			lifeTime = 30;

	return {
		update: function(input) {
			posX += Math.sin(deg2rad(angle)) * velocity;
			posY -= Math.cos(deg2rad(angle)) * velocity;
			lifeTime--;
			if(lifeTime <= 0) game.removeGameObject(this); 
		},
		draw: function(ctx) {
			ctx.beginPath();
			ctx.fillStyle = "#fff";
			ctx.arc(posX+8, posY, 2, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		}
	};
};

hbolo.FlameThrowerSprite = function(data) {

	var velocity = 6,
			angle = data.angle,
			posX = data.posX,
			posY = data.posY,
			lifeTime = 18,
			currentLife = 0,
			radius = 2;

	return {
		update: function(input) {
			posX += Math.sin(deg2rad(angle)) * velocity;
			posY -= Math.cos(deg2rad(angle)) * velocity;
			currentLife++;
			if(currentLife >= lifeTime) game.removeGameObject(this); 
		},
		draw: function(ctx) {
			radius+=.6;
			ctx.beginPath();
			ctx.fillStyle = "rgba(255, "+Math.floor(Math.random(92)*92)+", 0, " + (1 - currentLife/lifeTime) + ")";
			// all this randomization stuff just makes the flame wobble...
			ctx.arc(posX+8+(Math.random(Math.pow(2, 2))*(Math.pow(2, 2))-(Math.pow(2, 2))), posY, radius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		}
	};
};

hbolo.PillBoxSprite = function(data) {

	var angle = 0,
			radius = 10,
			posX = data.posX,
			posY = data.posY,
			health = 100;

	return {
		update: function(input) {
			if(health <= 0) game.removeGameObject(this); 
		},
		draw: function(ctx) {
			// TODO: add a rotating turrets
			canvas2d.globalCompositeOperation = "lighter";
			ctx.beginPath();
			ctx.fillStyle = "#ccc";
			ctx.arc(posX, posY, radius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		}
	};
};