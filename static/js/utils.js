Math.map = function(value, start1, stop1, start2, stop2) {
  return parseFloat(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)));
}
Math.constrain = function(value, min, max) {
  return parseFloat(Math.min(Math.max(value,min),max));
}
Math.lerp = function(value, target, ratio) {
  return parseFloat(value + (target-value)*ratio);
}
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};