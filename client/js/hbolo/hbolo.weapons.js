
//=============================================================================
// MACHINE GUN SPRITE
//=============================================================================

hbolo.MachineGunSprite = function(data) {

    var velocity = 5,
        offset = Math.deg2rad(Math.floor(Math.random(5)*5)),
        angle = data.angle + offset,
        posX = data.posX,
        posY = data.posY,
        lifeTime = 20 + Math.random(15)*15,
        collisionRadius = 2,
        damagePoints = 0.5;
    
    console.log();
    if(data.velocity) velocity+=data.velocity;

    return {
        update: function(input) {
            posX += Math.sin(angle) * velocity;
            posY -= Math.cos(angle) * velocity;
            lifeTime--;
            if(lifeTime <= 0) game.removeDamagingSprite(this); 
        },
        draw: function(ctx) {
            ctx.beginPath();
            ctx.fillStyle = "#fff";
            ctx.arc(posX+8, posY, 1, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        },
        getCollisionBoundary: function() {
            return {
                r: collisionRadius,
                x: posX,
                y: posY
            };
        },
        getDamagePoints: function(){
            game.removeDamagingSprite(this);
            return damagePoints;
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

