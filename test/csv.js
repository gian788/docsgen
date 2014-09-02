var csv = require('csv-stringify');
/*
input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
csv(input, function(err, output){
  console.log(output)
  //output.should.eql('1,2,3,4\na,b,c,d');
});