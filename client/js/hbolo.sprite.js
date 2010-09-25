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
			posY,
			collisionRadius = 12,
			shieldRadius = 14;

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

			// HANDLE USER INPUT
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
			posX += Math.sin(Math.deg2rad(currentAngle)) * velocity;
			posY -= Math.cos(Math.deg2rad(currentAngle)) * velocity;
			
			ctx.save();

			// draw the collision detection ring
			ctx.beginPath();
			ctx.strokeStyle = "#fff";
			ctx.strokeWidth = 2;
			ctx.arc(posX+collisionRadius/2, posY+collisionRadius/2, collisionRadius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.stroke();
			
			// draw the collision detection ring
			ctx.beginPath();
			ctx.strokeStyle = "#0F0";
			ctx.arc(posX+shieldRadius/2, posY+shieldRadius/2, shieldRadius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.stroke();
			
			// draw the tank
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(Math.deg2rad(currentAngle));
			ctx.drawImage(image, -(image.width/2),-(image.height/2));

			// restore the projection
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
			posX += Math.sin(Math.deg2rad(angle)) * velocity;
			posY -= Math.cos(Math.deg2rad(angle)) * velocity;
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
			radius = 2,
			damagePoints = .08;

	var pub = {
		update: function(input) {
			posX += Math.sin(Math.deg2rad(angle)) * velocity;
			posY -= Math.cos(Math.deg2rad(angle)) * velocity;
			currentLife++;
			if(currentLife >= lifeTime) game.removeGameObject(this);
		},
		draw: function(ctx) {
			radius+=.8;
			ctx.beginPath();
			ctx.fillStyle = "rgba(255, "+Math.floor(Math.random(92)*92)+", 0, " + (1 - currentLife/lifeTime) + ")";
			// all this randomization stuff just makes the flame wobble...
			ctx.arc(posX+8+(Math.random(Math.pow(2.1, 2.1))*(Math.pow(2.1, 2.1))-(Math.pow(2.1, 2.1))), posY, radius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		},
		getDamagePoints: function(){
			return damagePoints;
		},
		getCollisionBoundary: function() {
			return {
				r: radius,
				x: posX,
				y: posY
			};
		}
	};
	
	return pub;
};

hbolo.EnemySprite = function(data) {

	var image = new Image(),
			velocity = 0.0,
			acceleration = 0.05,
			deceleration = 0.08,
			maxSpeed = 1.5,
			currentAngle = 0,
			rotationSpeed = 4, // how fast we rotate
			weaponCooldown = 10,
			posX = 200,
			posY = 200,
			health = 100,
			collisionRadius = 12,
			shieldRadius = 14;

	switch(data.type) {
		case "tank":
			image.src = "/tanks/blue.png";
			break;
		default:
			throw "Sprite(): Must provide an asset type.";
	}

	var self = {
		checkCollisions: function(self){
			for(var i in game.getGameObjects()) {
				var object = game.getGameObjects()[i];
				if(self !== object) {
					// check for some sort of collision
					if(Physics.collision(self.getCollisionBoundary(),object.getCollisionBoundary())) {
						health -= object.getDamagePoints();
					}
				}
			}
		}
	};
	
	var pub = {
		update: function(input) {
			
			self.checkCollisions(this);
			
			if(health <= 0) {
				game.removeGameObject(this);
			}

		},
		draw: function(ctx) {

			if(!ctx) throw "Must pass the drawing context";
			if(posX === undefined) posX = ctx.canvas.width/2;
			if(posY === undefined) posY = ctx.canvas.height/2;

			// crazy vector math stuff going on here
			posX += Math.sin(Math.deg2rad(currentAngle)) * velocity;
			posY -= Math.cos(Math.deg2rad(currentAngle)) * velocity;
			
			ctx.save();

			// draw the collision detection ring
			ctx.beginPath();
			ctx.strokeStyle = "#fff";
			ctx.strokeWidth = 2;
			ctx.arc(posX+collisionRadius/2, posY+collisionRadius/2, collisionRadius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.stroke();
			
			// draw the collision detection ring
			ctx.beginPath();
			ctx.strokeStyle = "#0F0";
			ctx.arc(posX+shieldRadius/2, posY+shieldRadius/2, shieldRadius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.stroke();
			
			// draw the tank
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(Math.deg2rad(currentAngle));
			ctx.drawImage(image, -(image.width/2),-(image.height/2));

			// restore the projection
			ctx.restore();
			
			var pointBarWidth = 45,
					life = (health/100);
			ctx.fillRect (posX+image.width+5, posY-5, pointBarWidth, 7);
			if(life > .66) {
				ctx.fillStyle = '#0f0';
			} else if(life > .33) {
				ctx.fillStyle = '#ff0';
			} else {
				ctx.fillStyle = '#f00';
			}

			ctx.fillRect (posX+image.width+5, posY-5, pointBarWidth*life, 7);
			
			
		},
		getCollisionBoundary: function() {
			return {
				r: collisionRadius,
				x: posX,
				y: posY
			};
		}
	};
	
	return pub;
	
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