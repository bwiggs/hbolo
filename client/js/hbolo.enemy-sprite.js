//=============================================================================
// ENEMY SPRITE
//=============================================================================
var PathfindingBehavior = PathfindingBehavior || {};

PathfindingBehavior.aStar = function() {
	
};

function ChasePathfindingBehavior() { // implements PathfindingBehavior[track, draw]

	return {
		pursue: function() {
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
		},
		draw: function(ctx) {
			//if(ctx === undefined) throw Exception('Must provide the drawing context');
		}
	};
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
			newPosX = 300,
			newPosY = 100,
			posX = undefined,
			posY = undefined,
			health = 100,
			collisionRadius = 12,
			shieldRadius = 14,
			prey = {},
			PathfindingBehavior = new ChasePathfindingBehavior(),
			aStarPath;

	switch(data.type) {
		case "tank":
			image.src = "/tanks/red.png";
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
			return false;
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
		},
		aStarAlgorithm: function() {

			// a* node constructor
			function Node(x, y) {
				this.x = x;
				this.y = y;
			};
			
			Node.prototype.calcCost = function() {
				this.cost = this.parent.cost + 16 + Math.Pythagoras(this.x*16, this.y*16, prey.x, prey.y);
			};
			
			Node.prototype.setParent = function(node) {
				this.parent = node;
			};

			// build and returns a multidimensional array of nodes
			var nodes = (function(){
				var i,j,a = new Array(game.getMap().getDimensions().height);
				
				for(i = 0; i < a.length; i++) {
					a[i] = new Array(game.getMap().getDimensions().width);
					for(j = 0; j < a[i].length; j++) {
						a[i][j] = new Node(j, i);
					}
				}
				return a;
			})();
			
			var open =[],
					closed = [],
					targetNodeCoords = game.getMap().getInhabitedTileNode(prey.x, prey.y),
					targetNode = nodes[targetNodeCoords.x][targetNodeCoords.y],
					currentNodeCoords = game.getMap().getInhabitedTileNode(posX, posY),
					currentNode = nodes[currentNodeCoords.x][currentNodeCoords.y];
					
			// initiate the open list
			currentNode.cost = 0;
			open.push(currentNode);
			
			// clear out the tracking path
			aStarPath = [];

			while(open.length > 0) {
				// get the cheapest node from our open node list
				currentNode = open.shift();
				// check if we've hit out target
				if(currentNode == targetNode) {
					while(currentNode.parent != null) {
						aStarPath.unshift(currentNode);
						currentNode = currentNode.parent;
					}
					break;
				} else {
					// move currentNode to the closed list
					closed.push(currentNode);

					// for each adjacent Node
					for (var dx=-1;dx<2;dx++) {
						for (var dy=-1;dy<2;dy++) {

							// skip the current node
							if(dx == 0 && dy==0) continue;

							var xp = dx + currentNode.x,
									yp = dy + currentNode.y;
							
							// if not contained in any of our lists
							if(xp > -1 && xp < nodes[0].length && yp > -1 && yp < nodes.length && ! _.include(open, nodes[yp][xp]) && ! _.include(closed, nodes[yp][xp])) {
								if(! game.mapCollision(xp * 16, yp * 16)) {
									nodes[yp][xp].setParent(currentNode);
									nodes[yp][xp].calcCost();
									open.push(nodes[yp][xp]);
								}
							}
						}
					}
					open = _.sortBy(open, function(node) { return node.cost; });
				}
			}
			
			var pathNode = aStarPath.shift();
			pathNode.x = pathNode.x * 16;
			pathNode.y = pathNode.y * 16;
			pathNode.bearing = Math.abs(Math.floor(Math.rad2deg(Math.atan((pathNode.y-posY)/(pathNode.x-posX)))));;
			
			// top right quadrant
			if(pathNode.x > posX && pathNode.y < posY) {
				pathNode.bearing = 90 - pathNode.bearing;
			// bottom right quadrant
			} else if(pathNode.x > posX && pathNode.y > posY) {
				pathNode.bearing += 90;
			// bottom left quadrant
			}	else if(pathNode.x < posX && pathNode.y > posY) {
				pathNode.bearing = 270 - pathNode.bearing;
			// top left quadrant
			} else if(pathNode.x < posX && pathNode.y < posY) {
				pathNode.bearing = 270 + pathNode.bearing;
			}
		
		
			var delta = Math.abs(pathNode.bearing - currentAngle);
			if(delta < 180) {
				if(currentAngle < pathNode.bearing) {
					currentAngle += rotationSpeed;
				} else {
					currentAngle -= rotationSpeed;
				}
			} else {
				currentAngle = pathNode.bearing;
			}
		
			newPosX = posX + Math.sin(Math.deg2rad(currentAngle)) * velocity;
			newPosY = posY - Math.cos(Math.deg2rad(currentAngle)) * velocity;
		}
	};
	
	var pub = {
		update: function(input) {
			
			self.getDamage();
			if(health <= 0) {
				game.removeImperviousSprite(this);
				return;
			}
			
			if(posX === undefined) posX = 300; //Math.random(400)*400;
			if(posY === undefined) posY = 100; //Math.random(400)*400;
			
			if(velocity < maxSpeed) velocity += acceleration;

			// get the coordinates for the prey
			prey = {
				x: game.getPlayer().getPosition().x,
				y: game.getPlayer().getPosition().y
			};

			self.aStarAlgorithm();
			//PathfindingBehavior.pursue();

			// update the x,y checking for collisions
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

			PathfindingBehavior.draw();

			// DRAW THE ENEMY TRACKING TRIANGLE
			// ctx.strokeStyle = "#fff";
			// ctx.beginPath();
			// ctx.moveTo(posX, posY);
			// ctx.lineTo(prey.x, posY);
			// ctx.lineTo(prey.x, prey.y);
			// ctx.lineTo(posX, posY);
			// ctx.stroke();
			// ctx.closePath();
			// ctx.strokeText(prey.bearing + "deg", 0, 12);

			// DRAW THE COLLISION DETECTION RING
			// ctx.beginPath();
			// ctx.strokeStyle = "#fff";
			// ctx.strokeWidth = 2;
			// ctx.arc(posX+collisionRadius/2, posY+collisionRadius/2, collisionRadius, 0, Math.PI*2, true); 
			// ctx.closePath();
			// ctx.stroke();
			
			// DRAW THE A* PATH
			if(aStarPath.length > 0) {
				ctx.strokeStyle = "#fff";
				ctx.beginPath();
				ctx.moveTo(posX, posY);
				var point;
				for(point in aStarPath) {
					ctx.lineTo(aStarPath[point].x *16 + 8, aStarPath[point].y * 16 + 8);
				}
				ctx.stroke();
				ctx.closePath();
			}
			
			// draw the tank
			ctx.translate(posX + image.width/2, posY + image.height/2);
			ctx.rotate(Math.deg2rad(currentAngle));
			ctx.drawImage(image, -(image.width/2),-(image.height/2));

			// restore the projection
			ctx.restore();
			
			
			// HEALTH BAR
			var pointBarWidth = 45,
					life = (health/100);		
			ctx.fillStyle = "#000";
			ctx.fillRect (posX+image.width+5, posY-5, pointBarWidth, 7);
			if(life > 0.66) {
				ctx.fillStyle = '#0f0';
			} else if(life > 0.33) {
				ctx.fillStyle = '#ff0';
			} else {
				ctx.fillStyle = '#f00';
			}
			ctx.fillRect (posX+image.width+5, posY-5, pointBarWidth*life, 7);

			// PLAYER NAME
			ctx.shadowBlur = 1;
			ctx.shadowColor = '#000';
			ctx.fillStyle = "#fff";
			ctx.font = "bold 10px verdana";
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
