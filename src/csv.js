var stringify = require('csv-stringify'),
	parse = require('csv-parse'),
	fs = require('fs');


/*parse.options = {
	delimiter: ',',//Set the field delimiter. One character only, defaults to comma.
	rowDelimiter: '\n',//String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
	quote: '"',//Optionnal character surrounding a field, one character only, defaults to double quotes.
	escape: '"',//Set the escape character, one character only, defaults to double quotes.
	columns: null,// List of fields as an array, a user defined callback accepting the first line and returning the column names or true if autodiscovered in the first CSV line, default to null, affect the result data set in the sense that records will be objects instead of arrays.
	comment: '#',//Treat all the characteres after this one as a comment, default to '#'.
	objname: '',//Name of header-record title to name objects by.
	skip_empty_lines: false,//Dont generate empty values for empty lines.
	trim: false,//If true, ignore whitespace immediately around the delimiter, defaults to false.
	ltrim: false,//If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.
	rtrim: false,//If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.
	auto_parse: false,//If true, the parser will attempt to convert read data types to native types.
}*/
/*
strigify.options = {
	columns: null,//List of fields, applied when transform returns an object, order matters, read the transformer documentation for additionnal information, columns are auto discovered when the user write object, see the "header" option on how to print columns names on the first line.
	delimiter: ',',//Set the field delimiter, one character only, defaults to a comma.
	eof: true,//Add the value of "options.rowDelimiter" on the last line, default to true.
	escape: ,//Defaults to the escape read option.
	header: false,//Display the column names on the first line if the columns option is provided or discovered.
	lineBreaks: 'auto',//String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
	quote: ,//Defaults to the quote read option.
	quoted: false,//Boolean, default to false, quote all the non-empty fields even if not required.
	quotedEmpty: ,//Boolean, no default, quote empty fields? If specified, overrides quotedString for empty strings.
	quotedString: false,//Boolean, default to false, quote all fields of type string even if not required.
	rowDelimiter: 'auto',//String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
}*/
/*
var readStreamToStream = function(streamIn, streamOut, options){
	var parser = parse(options);
	streamIn.pipe(parser).pipe(streamOut);
}*/

var readStream = function(stream, options, callback){
	stream.pipe(parse(options, callback));
}

var readFile = function(filePath, options, callback){
	readStream(fs.createReadStream(filePath), options, callback);
}


var writeStreamToStream = function(streamIn, streamOut, options, callback){
	stringifier = stringify(options);
	streamIn.pipe(stringifier).pipe(streamOut);
}

var writeStream = function(data, streamOut, options){
	stringifier = stringify();
	stringifier.pipe(streamOut);

	if(options.template && typeof(options.template) != 'object')
		console.error('Error: Docsgen.csv - Bad template argument');

	if(options.template && typeof(options.template) == 'object'){
		var temp = [];
		for(var t in options.template)
			temp.push(options.template[t]);
		stringifier.write(temp);

		for(var i in data){
			var temp = [];
			for(var t in options.template)
				temp.push(data[i][t]);
			stringifier.write(temp);			
		}
	}else {
		for(var i in data)
			stringifier.write(data[i]);
	}
	
	stringifier.end();	
}

var writeFile = function(data, filePath, options, callback){
	var ws = fs.createWriteStream(filePath);
	ws.on('finish', function(){
		ws.close();
		callback();
	});
	ws.on('error', function(err){
		ws.close();
		callback(err);
	});

	writeStream(data, ws, options, callback);
}

//module.exports.readStreamToStream = readStreamToStream;
module.exports.readStream = readStream;
module.exports.readFile = readFile;

module.exports.writeStreamToStream = writeStreamToStream;
module.exports.writeStream = writeStream;
module.exports.writeFile = writeFile;

