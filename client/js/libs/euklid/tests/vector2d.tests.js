module('Vector2d');

test('Constructor', function() {
  var v = new Vector2d(3, 5);
  ok(v, 'Object instantiated successfully.');
  deepEqual(v.toObject(), {x:3,y:5},'Set x, y components correctly');
});

test('toObject()', function() {
  var v = new Vector2d(3, 5),
      o = v.toObject();
  deepEqual(v.toObject(), {x:3,y:5},'Object Literal created correctly');
});

test('length()', function(){
  var v = new Vector2d(3, 4);
  equal(v.length(), 5, 'Solve for length using pythagoras theorem.');
});

test('length2()', function(){
  var v = new Vector2d(3, 4);
  equal(v.length2(), 25, 'Return the length squared');
});

test('normalize()', function(){
  var v = new Vector2d(6, 8);
  v.normalize();
  deepEqual(v.toObject(), {x: 0.6, y: 0.8}, 'Return the normalized vector');
});

test('add()', function() {
  var v = new Vector2d(2, 3),
      w = new Vector2d(4, 5);
  v.add(w);
  deepEqual(v.toObject(), {x:6,y:8}, 'Adding two vectors');
});

test('subtract()', function() {
  var v = new Vector2d(6, 12),
      w = new Vector2d(3, 4);
  v.subtract(w);
  deepEqual(v.toObject(), {x:3, y:8}, 'Subtracting two vectors');
});

test('multiply()', function() {
  var v = new Vector2d(2, 6),
      w = new Vector2d(3, 4);
  v.multiply(w);
  deepEqual(v.toObject(), {x:6, y:24}, 'Multiplying two vectors');
});

test('divide()', function() {
  var v = new Vector2d(6, 12),
      w = new Vector2d(3, 4);
  v.divide(w);
  deepEqual(v.toObject(), {x:2, y:3}, 'Dividing two vectors');
});
