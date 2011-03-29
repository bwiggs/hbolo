
//=============================================================================
// MACHINE GUN SPRITE
//=============================================================================

hbolo.MachineGunSprite = function(data) {

    var _velocity = 5,
        offset = Math.deg2rad(Math.floor(Math.random(5)*5)),
        angle = data.angle + offset,
        posX = data.posX,
        posY = data.posY,
        lifeTime = 20 + Math.random(15)*15,
        _shellRadius = data.shellRadius || 1,
        _damagePoints = data.damagePoints || 0.5;
    
    if(data.velocity) _velocity+=data.velocity;

    return {
        update: function(input) {
            posX += Math.sin(angle) * _velocity;
            posY -= Math.cos(angle) * _velocity;
            lifeTime--;
            if(lifeTime <= 0) game.removeDamagingSprite(this); 
        },
        draw: function(ctx) {
            ctx.beginPath();
            ctx.fillStyle = "#fff";
            ctx.arc(posX+8, posY, _shellRadius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        },
        getCollisionBoundary: function() {
            return {
                r: _shellRadius,
                x: posX,
                y: posY
            };
        },
        getDamagePoints: function(){
            game.removeDamagingSprite(this);
            return _damagePoints;
        }
    };
};

//=============================================================================
// FLAMETHROWER SPRITE
//=============================================================================

hbolo.FlamethrowerSprite = function(data) {

    var velocity = 6,
        angle = data.angle,
        posX = data.posX,
        posY = data.posY,
        lifeTime = 18,
        currentLife = 0,
        radius = 2,
        damagePoints = 1.0;

    if(data.velocity) velocity+=data.velocity;

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

        },
        draw: function(ctx) {
            radius+=0.8;
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

//=============================================================================
// PILLBOX SPRITE
//=============================================================================

hbolo.PillBoxSprite = function(data) {

    var angle = 0,
        radius = 10,
        posX = data.posX,
        posY = data.posY,
        health = 400,
        detectionRadius = 75,
        _mode = 'scanning',
        _bogeys = [];


    var pub =  {
        update: function(input) {
          if(health <= 0) game.removeGameObject(this); 
          if(angle >= 360) angle=0;
          else angle+=1;

          if(pub.getDetections()) {
            _mode = 'attacking';
          } else {
            _mode = 'scanning';
            _bogeys = [];
          }

        },
        getDetections: function(){
          var detections = false;
          for(var i in game.getGameObjects().imperviousSprites) {
            var object = game.getGameObjects().imperviousSprites[i];
            if(pub !== object) {
              // check for some sort of collision
              var target = object.getCollisionBoundary();
              if(Physics.collision({ r: detectionRadius, x: posX, y: posY }, target)) {
                detections = true;
                game.addDamagingSprite(new hbolo.MachineGunSprite({
                  angle:Math.sin((posX - target.x) / (posY - target.y )),
                  posX: posX-8,
                  posY: posY,
                  damagePoints: 1,
                  shellRadius: 2
                }));
              }
            }
          }
          return detections;
        },
        draw: function(ctx) {
            // TODO: add a rotating turrets

            // draw the radar detection ring
            switch(_mode) {
              case 'attacking':
                ctx.fillStyle = "rgba(255,0,0,.1)";
                ctx.strokeStyle = "rgb(255,0,0)";
                break;
              default:
                ctx.fillStyle = "rgba(0,255,0,.1)";
                ctx.strokeStyle = "rgb(0,255,0)";
                break;
            }

            ctx.beginPath();
            ctx.strokeWidth = "1";
            ctx.arc(posX, posY, detectionRadius, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // draw the turret
            ctx.beginPath();
            ctx.fillStyle = "#ccc";
            ctx.arc(posX, posY, radius, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill();

            // draw the radar beam
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(posX+Math.cos(Math.deg2rad(angle))*detectionRadius, posY+Math.sin(Math.deg2rad(angle))*detectionRadius);
            ctx.closePath();
            ctx.stroke();

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

