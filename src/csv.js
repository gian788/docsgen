var stringify = require('csv-stringify'),
	parse = require('csv-parse'),
	fs = require('fs');


/*
parse.options = {
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

	template: ,//Object or Array containing header
	transformer: ,//Function that transform each object input data row to an array
}*/


var CSVGen = module.exports;

//Read
/*
CSVGen.readStreamToStream = function(streamIn, streamOut, options){
	var parser = parse(options);
	streamIn.pipe(parser).pipe(streamOut);
}*/

/**
 * Read a csv from a stream and return an array of objects
 @param stream    ReadableStream   	source data stream
 @param options   Object   			parse options
 @param callback  Object   			callback function (err, res)
 */
CSVGen.readStream = function(stream, options, callback){
	stream.pipe(parse(options, callback));
}

/**
 * Read a csv from a file and return an array of objects
 @param filePath  String   source file path
 @param options   Object   parse options
 @param callback  Object   callback function (err, res)
 */
CSVGen.readFile = function(filePath, options, callback){
	readStream(fs.createReadStream(filePath), options, callback);
}

//Write
/**
 * Create a csv and send it to the stream
 @param data   		ReadableStream	input data stream
 @param streamOut   WritableStream  destination file path
 @param options     Object   		stringify options
 */
CSVGen.writeStreamToStream = function(streamIn, streamOut, options){
	stringifier = stringify(options);
	streamIn.pipe(stringifier).pipe(streamOut);
}

/**
 * Create a csv and send it to the stream
 @param data   		Object  		input data
 @param streamOut   WritableStream  destination file path
 @param options     Object   		stringify options
 */
CSVGen.writeStream = function(data, streamOut, options){
	stringifier = stringify();
	stringifier.pipe(streamOut);

	if (options.template && typeof(options.template) == 'object'){
		if (Object.prototype.toString.call(options.template) != '[object Array]'){			
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

			stringifier.end();
			return;
		} else {
			stringifier.write(options.template);
		} 
	} 

	if (options.transformer && typeof(options.transformer) == 'function'){		
		for(var i in data)
			stringifier.write(options.transformer(data[i]));		
	} else {
		for(var i in data)
			stringifier.write(data[i]);
	}

	stringifier.end();
}

/**
 * Create a csv and save it to file
 @param data   		Object   input data
 @param filePath    String   destination file path
 @param options     Object   stringify options
 @param callback    Object   callback function (err, res)
 */
CSVGen.writeFile = function(data, filePath, options, callback){
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


