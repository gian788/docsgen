var phantom = require('phantom'),
    utils   = require('./utils'),
    ejs     = require('ejs'),
    fs      = require('fs');

//move to config or utils
ejs.filters.decimal = function(num) {
   var s = '' + parseFloat(num).toFixed(2);
   s = s.replace('.', ',');
   return s;
};
  
ejs.filters.date = function(obj) {
   var date = new Date(obj);
   return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
};

var defaultPageSettings = { 
   format: 'A4',//"10cm*20cm"
   margin: '1cm',
   orientation: 'portrait',//'landscape',
   //tmpdir: './',
   //zoom: 1, //
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

            var render = function(html){
               /** Render html **/
               if(!data.length) {
                  html = ejs.render(html, data);
               } else {
                  //handle multi array of data (one "render" per array element)
                  var htmlTemplate = html;
                  html = '';
                  for(var i in data)
                     if(i != data.length - 1)
                        html += '<div style="page-break-after:always;">' + ejs.render(htmlTemplate, data[i]) + '</div>';
                     else
                        html += '<div>' + ejs.render(htmlTemplate, data[i]) + '</div>';
               }                           
               

               if(typeof(destOptions) == 'function')
                  destOptions = destOptions(ph);

               if(!destOptions.pageSettings)
                  destOptions.pageSettings = defaultPageSettings;

               page.set('settings.localToRemoteUrlAccessEnabled', true);
               page.set('settings.loadImages', true);
               page.set('settings.webSecurityEnabled', false);               
                            

               var reqCount = 0,
                   resCount = 0;

               var render = function(){
                  //console.log('render');
                  page.render(destOptions.file, {quality: '100'}, function(){                     
                     page.close();
                     page = null;
                     return callback(null, destOptions.file);
                  });
               }

               page.set('onLoadFinished', function() {
                  //console.log('onLoadFinished')
               });

               page.set('onResourceRequested', function(success) {
                  reqCount++;
                  //console.log('req', reqCount, success.url)
               });

               page.set('onResourceReceived', function(success) {
                  //for every resource it receive two response      
                  if(++resCount == reqCount * 2)            
                     render();
                  //console.log('res', resCount, success.url)
               });

               page.set('paperSize', destOptions.pageSettings, function(){
                  page.open('about:blank', function(err) {

                     page.setContent(html);

                     page.evaluate(function(){
                        }, function(){
                           //console.log('created');
                           if(reqCount == 0)
                              render();
                     });
                  });
               });
            }

            if(sourceOptions.file)
               utils.readFile(sourceOptions.file, function(err, html){
                  if(err) return callback(err);
                  render(html);
               });
            else if(sourceOptions.html)
               render(sourceOptions.html);
            else
               return callback({message: 'Missing template'});           
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











