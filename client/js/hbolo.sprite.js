var hbolo = hbolo || {};

hbolo.PlayerSprite = function(data) {

	var image = new Image(),
			velocity = 0.0,
			acceleration = 0.05,
			deceleration = 0.08,
			maxSpeed = 1.8,
			currentAngle = 0,
			rotationSpeed = .07, // how fast we rotate
			weaponCooldown = 10,
			posX,
			posY,
			newPosX,
			newPosY,
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
		getCollisions: function(self){
			for(var i in game.getGameObjects().imperviousSprites) {
				var object = game.getGameObjects().imperviousSprites[i];
				if(self !== object) {
					// check for some sort of collision
					if(Physics.collision(pub.getCollisionBoundary(),object.getCollisionBoundary())) {
						return true;
					}
				}
			}
		},
		getDamage: function(self){
			for(var i in game.getGameObjects()) {
				var object = game.getGameObjects().damagingSprites[i];
				if(self !== object) {
					if(Physics.collision(pub.getCollisionBoundary(),object.getCollisionBoundary())) {
						health -= object.getDamage();
					}
				}
			}
		}
	};
	
	var pub = {
		update: function(input) {

			if(input.getKeyStates.reset) {
				posX = undefined;
				posY = undefined;
			}
			
			if(posX === undefined) posX = 400;
			if(posY === undefined) posY = 20;

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
			
			// attempt to move
			newPosX = posX + Math.sin(currentAngle) * velocity;
			newPosY = posY - Math.cos(currentAngle) * velocity;
			if(!self.getCollisions()) {
				if(!game.mapCollision(newPosX, posY)) {
					posX = newPosX;
				}
				// update the users y position
				if(!game.mapCollision(posX, newPosY)) {
					posY = newPosY;
				}
			}
			
			// handle weapons
			if(weaponCooldown > 0) {
				weaponCooldown--;
			}
			
			if(input.getKeyStates.fire) {
				if(weaponCooldown == 0) {
					weaponCooldown = 0;
					game.addDamagingSprite(new hbolo.FlameThrowerSprite({
						angle:currentAngle,
						posX: posX,
						posY: posY
					}));
				}
			}
			
			// handle damage
			

		},
		draw: function(ctx) {

			if(!ctx) throw "Must pass the drawing context";
			
			ctx.save();

			// draw the collision detection ring
			// ctx.beginPath();
			// ctx.strokeStyle = "#fff";
			// ctx.strokeWidth = 2;
			// ctx.arc(posX+collisionRadius/2, posY+collisionRadius/2, collisionRadius, 0, Math.PI*2, true); 
			// ctx.closePath();
			// ctx.stroke();
			
			// draw the shield detection ring
			// ctx.beginPath();
			// ctx.strokeStyle = "#0F0";
			// ctx.arc(posX+shieldRadius/2, posY+shieldRadius/2, shieldRadius, 0, Math.PI*2, true); 
			// ctx.closePath();
			// ctx.stroke();
			
			// draw the tank
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(currentAngle);
			ctx.drawImage(image, -(image.width/2),-(image.height/2));

			// restore the projection
			ctx.restore();
			
			
			
		},
		getCollisionBoundary: function() {
			return {
				r: collisionRadius,
				x: newPosX,
				y: newPosY
			};
		},
		getPosition: function() {
			return {
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
			currentAngle = 250,
			rotationSpeed = 8, // how fast we rotate
			weaponCooldown = 10,
			newPosX = 200,
			newPosY = 200,
			posX = 200,
			posY = 200,
			health = 100,
			collisionRadius = 12,
			shieldRadius = 14
			prey: {};

	switch(data.type) {
		case "tank":
			image.src = "/tanks/blue.png";
			break;
		default:
			throw "Sprite(): Must provide an asset type.";
	}

	var self = {
		getCollisions: function(self){
			for(var i in game.getGameObjects().imperviousSprites) {
				var object = game.getGameObjects().imperviousSprites[i];
				if(pub !== object) {
					// check for some sort of collision
					if(Physics.collision(pub.getCollisionBoundary(),object.getCollisionBoundary())) {
						return true;
					}
				}
			}
		},
		getDamage: function(self){
			for(var i in game.getGameObjects().damagingSprites) {
				var object = game.getGameObjects().damagingSprites[i];
				if(self !== object) {
					if(Physics.collision(pub.getCollisionBoundary(),object.getCollisionBoundary())) {
						health -= object.getDamagePoints();
					}
				}
			}
		}
	};
	
	var pub = {
		update: function(input) {
			
			self.getDamage();
			if(health <= 0) {
				game.removeImperviousSprite(this);
				return;
			}
			
			if(posX === undefined) posX = 300;
			if(posY === undefined) posY = 300;
			
			if(velocity < maxSpeed) velocity += acceleration;

			// CHASE ALGORITHM			

			// update the enemys vector
			prey = {
				x: game.getPlayer().getPosition().x,
				y: game.getPlayer().getPosition().y
			};
			
			prey.bearing = Math.abs(Math.floor(Math.rad2deg(Math.atan((prey.y-posY)/(prey.x-posX)))));
			
			// top right quadrant
			if(prey.x > posX && prey.y < posY) {
				prey.bearing = 90 - prey.bearing;
			// bottom right quadrant
			} else if(prey.x > posX && prey.y > posY) {
				prey.bearing += 90;
			// bottom left quadrant
			}	else if(prey.x < posX && prey.y > posY) {
				prey.bearing = 270 - prey.bearing;
			// top left quadrant
			} else if(prey.x < posX && prey.y < posY) {
				prey.bearing = 270 + prey.bearing;
			}
		
		
			var delta = Math.abs(prey.bearing - currentAngle);
			if(delta < 180) {
				if(currentAngle < prey.bearing) {
					currentAngle += rotationSpeed;
				} else {
					currentAngle -= rotationSpeed;
				}
			} else {
				currentAngle = prey.bearing;
			}
						
			newPosX = posX + Math.sin(Math.deg2rad(currentAngle)) * velocity;
			newPosY = posY - Math.cos(Math.deg2rad(currentAngle)) * velocity;
			if(!self.getCollisions()) {
				if(!game.mapCollision(newPosX, posY)) {
					posX = newPosX;
				}
				// update the users y position
				if(!game.mapCollision(posX, newPosY)) {
					posY = newPosY;
				}
			}
		},
		draw: function(ctx) {

			if(!ctx) throw "Must pass the drawing context";
			
			ctx.save();

			// draw the enemy tracking triangle
			// ctx.strokeStyle = "#fff";
			// ctx.beginPath();
			// ctx.moveTo(posX, posY);
			// ctx.lineTo(prey.x, posY);
			// ctx.lineTo(prey.x, prey.y);
			// ctx.lineTo(posX, posY);
			// ctx.stroke();
			// ctx.closePath();
			// ctx.strokeText(prey.bearing + "deg", 0, 12);

			// draw the collision detection ring
			// ctx.beginPath();
			// ctx.strokeStyle = "#fff";
			// ctx.strokeWidth = 2;
			// ctx.arc(posX+collisionRadius/2, posY+collisionRadius/2, collisionRadius, 0, Math.PI*2, true); 
			// ctx.closePath();
			// ctx.stroke();
			
			// draw the tank
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(Math.deg2rad(currentAngle));
			ctx.drawImage(image, -(image.width/2),-(image.height/2));

			// restore the projection
			ctx.restore();
			
			
			// HEALTH BAR
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

			// PLAYER NAME
			ctx.shadowBlur = 1;
			ctx.shadowColor = '#000';
			ctx.fillStyle = "#fff";
			ctx.font = "bold 10px verdana"
			ctx.fillText("COMPUTER", posX+image.width+5, posY-8);
			
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
			if(lifeTime <= 0) game.removeDamagingSprite(this); 
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
			damagePoints = 1;

	var self = {
		getCollisions: function(self){
			for(var i in game.getGameObjects().imperviousSprites) {
				var object = game.getGameObjects().imperviousSprites[i];
				if(self !== object) {
					// check for some sort of collision
					if(Physics.collision(pub.getCollisionBoundary(),object.getCollisionBoundary())) {
						return true;
					}
				}
			}
		}
	};

	var pub = {
		update: function(input) {
			if(currentLife >= lifeTime) {
				game.removeDamagingSprite(this);
				return;
			}
			
			posX += Math.sin(angle) * velocity;
			posY -= Math.cos(angle) * velocity;

			currentLife++;

			// if(self.getCollisions()) {
			// 	currentLife = lifeTime;
			// }

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
			return damagePoints/radius;
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