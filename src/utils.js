var phantom = require('phantom'),
    juice   = require('juice'),
	 ejs     = require('ejs'),
	 fs 	   = require('fs');

module.exports.readFile = function(file, callback){
	fs.stat(file, function(err, stats) {
		if(err)
			return callback(err);
        if(!stats.isFile())
        	return callback(file + ' is not a valid file path');

        fs.readFile(file, 'utf8', function(err, data) {
        	if(err)
        		return callback(err);

            if(data === '')
            	return callback(file + ' was an empty file');
            return callback(null, data);
        });
    });
}
