var hbolo = hbolo || {};

//=============================================================================
// PLAYER SPRITE
//=============================================================================

hbolo.PlayerSprite = function(data) {

	var image = new Image(),
			velocity = 0.0,
			acceleration = 0.05,
			deceleration = 0.08,
			maxSpeed = 3.8,
			currentAngle = 0,
			rotationSpeed = 0.07, // how fast we rotate
			weaponCooldown = 10,
			posX = 600,
			posY = 450,
			newPosX,
			newPosY,
			collisionRadius = 12,
			shieldRadius = 14,
      _currWeapon = 0,
      _weapons = [
        hbolo.MachineGunSprite,
        hbolo.FlamethrowerSprite
      ];

	switch(data.type) {
		case "tank":
			image.src = "/tanks/blue.png";
			break;
		default:
			throw "Sprite(): Must provide an asset type.";
	}

  hbolo.Events.subscribe('/player/nextweapon', function(){
    if(_currWeapon == _weapons.length-1) _currWeapon = 0;
    else _currWeapon++;
  });
	
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
			return false;
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

			// deceleration
			if(velocity > 0 && !input.getKeyStates.forward) {
        if(velocity >= deceleration) {
          velocity -= deceleration;
        } else {
          velocity = 0;
        }
			} else if(velocity < 0 && !input.getKeyStates.reverse) {
        if(velocity <= deceleration) {
          velocity += deceleration;
        } else {
          velocity = 0;
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

      // COLLISION DETECTIONS
      // check with other objects for collisions
			if(!self.getCollisions()) {

        // check the map for collisions
				if(!game.mapCollision(newPosX, posY)) {
					posX = newPosX;
				} else {
          velocity -= deceleration;
        }
				// update the users y position
				if(!game.mapCollision(posX, newPosY)) {
					posY = newPosY;
				} else {
          velocity -= deceleration;
        }
			}
			
			// handle weapons
			if(weaponCooldown > 0) {
				weaponCooldown--;
			}
			
			if(input.getKeyStates.fire) {
				if(weaponCooldown === 0) {
					weaponCooldown = 0;
					game.addDamagingSprite(new _weapons[_currWeapon]({
            velocity: velocity,
						angle:currentAngle,
						posX: posX,
						posY: posY
					}));
				}
			}
		},
		draw: function(ctx) {

			if(!ctx) throw "Must pass the drawing context";
			
			ctx.save();

			// draw the collision detection ring
      ctx.beginPath();
      ctx.strokeStyle = "#fff";
      ctx.strokeWidth = 2;
      ctx.arc(posX+collisionRadius/2, posY+collisionRadius/2, collisionRadius, 0, Math.PI*2, true); 
      ctx.closePath();
      ctx.stroke();

			
			// draw the shield detection ring
			// ctx.beginPath();
			// ctx.strokeStyle = "#0F0";
			// ctx.arc(posX+shieldRadius/2, posY+shieldRadius/2, shieldRadius, 0, Math.PI*2, true); 
			// ctx.closePath();
			// ctx.stroke();
			
			// draw the tank
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(currentAngle);
      ctx.fillStyle = "#0F0";
      ctx.fillRect(-(image.width/2),-(image.height/2),image.width,image.height);
			ctx.drawImage(image, -(image.width/2),-(image.height/2));


			// restore the projection
			ctx.restore();
      
      // draw the poxX, posY circle
			ctx.beginPath();
      ctx.arc(posX, posY, 1, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.strokeWidth = 2;
      ctx.strokeStyle = "#F00";
      ctx.stroke();
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


