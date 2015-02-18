var fs = require('fs'),
	juice = require('juice');

var readFile = function(file, callback){
	var stats = fs.stat(file);
    if(!stats.isFile())
    	return callback(file + ' is not a valid file path');

    var data = fs.readFileSync(file, 'utf8')
    if(data === '')
    	return callback(file + ' was an empty file');
    return data;    
}

var htmlFile = process.args[2],
 	cssFile = process.args[3],
 	destFile = process.args[4] ? process.args[4] : htmlFile;

var html = readFile(htmlFile),
	css = readFile(cssFile);

html = juice(html, stylesheet);

fs.writeFileSync(destFile, html);
console.log('Files merged!');

