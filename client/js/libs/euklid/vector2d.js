//=============================================================================
// VECTOR 2D
//=============================================================================

var Vector2d = function(x, y) {
  this.x = x;
  this.y = y;
};

Vector2d.prototype = {
  toObject: function() {
    return {
      x: this.x,
      y: this.y
    };
  },
  length: function() {
   return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  },
  length2: function() {
   return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  },
  normalize: function() {
    var len = this.length();
    this.x /= len;
    this.y /= len;
  },
  add: function(v) {
    this.x += v.x;
    this.y += v.y;
  },
  subtract: function(v) {
    this.x -= v.x;
    this.y -= v.y;
  },
  multiply: function(v) {
    this.x *= v.x;
    this.y *= v.y;
  },
  divide: function(v) {
    this.x /= v.x;
    this.y /= v.y;
  }
};
