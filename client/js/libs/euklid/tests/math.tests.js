module('Math');

test('degToRad()', function() {
  equal(Math.deg2rad(90).toFixed(5), 1.57080, 'convert degrees to radians');
});

test('radToDeg()', function() {
  equal(Math.rad2deg(2).toFixed(5), 114.59156 , 'convert degrees to radians');
});
