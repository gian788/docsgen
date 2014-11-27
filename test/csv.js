var csv = require('../src/csv'),
	fs = require('fs');

csv.readFile('./test.csv', {columns: true}, function(err, data){
	console.error(err);
	console.log('readFile', data);
});

var rs = fs.createReadStream(__dirname + '/test.csv');
csv.readStream(rs, {columns: true}, function(err, data){
	console.log(err);
	console.log('readStream', data)
});


//var rs = fs.createReadStream(__dirname + '/test.csv');
//csv.readStreamToStream(rs, process.stdout, {columns: true})

var indata = [
		['123456','Mario','Rossi','Padova','12/11/14'],
		['123457','Gianni','Bianchi','Padova','12/11/14'],
		['123458','Luigi','Rossi','Padova','12/11/14'],
		['123459','Giuseppe','Verdi','Padova','12/11/14']		
	];
indata = [
		{
			matr: '123456',
			firstName: 'Mario',
			lastName: 'Rossi',
			comune: 'Padova',
			date: '12/11/14'
		},
		{
			matr: '123457',
			firstName: 'Gianni',
			lastName: 'Bianchi',
			comune: 'Padova',
			date: '12/11/14'
		},
		{
			matr: '123458',
			firstName: 'Luigi',
			lastName: 'Rossi',
			comune: 'Padova',
			date: '12/11/14'
		},
		{
			matr: '123459',
			firstName: 'Giuseppe',
			lastName: 'Verdi',
			comune: 'Padova',
			date: '12/11/14'
		},
	];
var template = {
	matr: 'Matricola',
	firstName: 'Nome',
	lastName: 'Cognome',
	'': '',
	comune: 'Comune',
	date: 'Data'
};

csv.writeFile(indata, __dirname + '/test3.csv', {template: template}, function(err){	
	console.log('writeFile: done!')
	/*should.be.eql('Matricola,Nome,Cognome,,Comune,Data\n' +
	'123456,Mario,Rossi,,Padova,12/11/14\n' + 
	'123457,Gianni,Bianchi,,Padova,12/11/14\n' +
	'123458,Luigi,Rossi,,Padova,12/11/14\n' +
	'123459,Giuseppe,Verdi,,Padova,12/11/14');*/
});

csv.writeStream(indata, process.stdout, {columns: true, header: true});