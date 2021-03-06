var pdfGen = require('../index').pdf;

pdfGen.create({
		file: 'test.html',	
	},
	{
		file: 'test.pdf',
		pageSettings: { 
	        format: 'A4',//"10cm*20cm"
	       	margin: '1cm',
	        orientation: 'portrait',//'landscape',
	       	//tmpdir: './',
	       	//zoom: 1,
	       	//rendering_time: 1000,
	       	rendering_timeout: 90000,
	    }
	},
	[
		{
		    name: 'Gianluca',
		    items: ['item1', 'item2', 'item3']
		},
		{
		    name: 'Mattia',
		    items: ['item1', 'item2', 'item3']
		}
	], function(err, fileName){
		if(err)
			console.error(err);
		else
			console.log(fileName, 'render complete!');
		process.exit();
	});
