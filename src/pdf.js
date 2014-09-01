var phantom = require('phantom'),
	 utils   = require('./utils'),
    ejs  	= require('ejs'),
	 fs 		= require('fs');

var defaultPageSettings = pageSettings: { 
   format: 'A4',//"10cm*20cm"
   margin: '1cm',
   orientation: 'portrait',//'landscape',
   //tmpdir: './',
   //zoom: 1,
   //rendering_time: 1000,
   rendering_timeout: 90000,
};

var session;
var createPhantomSession = function(callback){
   if(session){
      return callback(session);
   }else{
      phantom.create({}, function(_session){
         session = _session;
            return callback(session);
      });
   }
};


process.on('exit', function(code, signal){
   if(session)
      session.exit();
});

var renderPdf = function(session, callback){
   
};

var PdfGen = module.exports;

/**
 * Create a pdf from html file
 @param sourceOptions   object   source file options
 @param destOptions     object   destination file options
 @param callback        object   callback function (err, res)
 */
PdfGen.create = function(sourceOptions, destOptions, data, callback){

   createPhantomSession(function(ph){
      var page;

      try{
         ph.createPage(function(_page){
            page = _page;

            utils.readFile(sourceOptions.file, function(err, html){
               if(err)
                  return callback(err);
               
               html = ejs.render(html, data);            
               page.setContent(html);

               //DEBUG ONLY
               fs.writeFileSync(sourceOptions.file.split('.')[sourceOptions.file.split('.').length - 2] + '_rendered.html', html);
               
               if(!destOptions.pageSettings)
                  destOptions.pageSettings = defaultPageSettings;
               page.set('paperSize', destOptions.pageSettings, function(){             
                  page.render(destOptions.file, function(){
                     page.close();
                     page = null;
                     return callback(null, destOptions.file);
                  });
               });
            });      
         });
      }catch(e){
         try{
            if(page != null)
               page.close();
         }catch(e){
            // ignore as page may not have been initialised
         }
         return callback('Exception rendering pdf:' + e.toString());
      }
   });

}











