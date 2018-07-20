function average(scores) {
  var sum = 0;
  scores.forEach(function(s) {
    //console.log(s);
    sum += s;
  });
  return Math.ceil(sum/scores.length);
}

var scores = [90, 98, 89, 100, 100, 86, 94];
console.log(average(scores));
var scores = [40, 65, 77, 82, 80, 54, 73, 63, 95, 49];
console.log(average(scores));
