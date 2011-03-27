//=============================================================================
// PHYSICS
//=============================================================================

var Physics = Physics || {
  collision: function(a, b) {
    return ((a.r + b.r) > Math.Pythagoras(a.x,a.y,b.x,b.y));
  },
  isPolyCollision: function() {
    return false;
  }
};
