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


var docsgen = require('../index');
var fs = require('fs');
var ws = fs.createWriteStream('./export-csv-users.csv');
var users = [ { _id: '54773545f054cf273e5be2ca',
    lastMod: 'Thu Nov 27 2014 15:29:25 GMT+0100 (CET)',
    provider: 'local',
    firstName: 'Griffin',
    lastName: 'Rau',
    email: 'ricky.brown25@yahoo.com',
    hashedPassword: 'K3LAY5ISCF432otyt7cbQW9D5pFlZfOC3n3LpuuRku8VzkxefAKKzb96abRH3HMwY0IDeWruCi7hOX2svdFq7A==',
    salt: 'PtRyZRR7gP5xDUF8MGjcYQ==',
    __v: 1,
    subscriptions: [ '54773545f054cf273e5be2cb' ],
    esameStato: {},
    laurea: {},
    job: {},
    birthday: {},
    state: 1,
    role: 'user' },
  { _id: '54773543f054cf273e5be2c2',
    lastMod: 'Thu Nov 27 2014 15:29:25 GMT+0100 (CET)',
    provider: 'local',
    firstName: 'Fake',
    lastName: 'User',
    email: 'test@test.com',
    hashedPassword: 'EVNZjltQIlL0OQipf34nXHMIw+HLElVE99L8839fAoAx8TgFlvvsdZqPdK2P1QzEMKkpiMl0KPCZP6u7eRnMpQ==',
    salt: 'UfX6nBaF+c5gzWNVrbO2Hg==',
    __v: 1,
    subscriptions: [ '54773545f054cf273e5be2cd' ],
    esameStato: {},
    laurea: {},
    job: {},
    birthday: {},
    state: 1,
    role: 'user' },
  { _id: '54773543f054cf273e5be2c3',
    lastMod: 'Thu Nov 27 2014 15:29:25 GMT+0100 (CET)',
    provider: 'local',
    firstName: 'Fake',
    lastName: 'User 2',
    email: 'test2@test.com',
    hashedPassword: 'BtimhBYts4sUEXQKmDJHHR+A5szAFHt0vf1agVW4/XlWv4oq7lW9XAMyhO1NtKIV8F7RbeueCPqjf8FfBsBkrA==',
    salt: 'F8CrUpnGF5NgtfKjxnIAfQ==',
    __v: 1,
    subscriptions: [ '54773545f054cf273e5be2ce' ],
    esameStato: {},
    laurea: {},
    job: {},
    birthday: {},
    state: 1,
    role: 'manager' },
  { _id: '54773545f054cf273e5be2cc',
    lastMod: 'Thu Nov 27 2014 15:29:25 GMT+0100 (CET)',
    provider: 'local',
    firstName: 'Ray',
    lastName: 'Kovacek',
    email: 'palma83@gmail.com',
    hashedPassword: 'q5APMlh9SwKkd9uarEvNXRPjYPtdzU6X+ES8Ug//o8potFHWeAkg520L+fbg3jYJiGrQ9mdl0TnhIlLBOLng/g==',
    salt: 'im40Gy6L9JGRthbldako/Q==',
    __v: 1,
    subscriptions: [ '54773545f054cf273e5be2cf' ],
    esameStato: {},
    laurea: {},
    job: {},
    birthday: {},
    state: 1,
    role: 'user' } ]
var options = {}
var template = {
				firstName: 'Nome',
				lastName: 'Cognome',
				email: 'Email'
			}
			options.template = template;
docsgen.csv.writeStream(users, ws, options);