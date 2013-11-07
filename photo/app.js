
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var photos = require('./routes/photos');

var http = require('http');
var path = require('path');

var app = express();

app.configure(function (){
	app.set('views', path.join(__dirname, 'views'));
	app.set('photos_dir', path.join(__dirname, 'public/photos'));
	app.set('view engine', 'ejs');
	app.set('title', 'Doron Segal')
	app.set('port', process.env.PORT || 3000);


});
	

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


/*
	Production Env'
*/
app.configure('production', function (){

});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Configure locals (global variable) */
app.locals.settings = app.settings;

var i18n = {
	prev: 'Prev',
	next: 'Next',
	save: 'Save'
}
app.locals(i18n);

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/photos', photos.list);

app.get('/upload', photos.form);
app.post('/upload', photos.submit(app.get('photos_dir')));
app.get('/photo/:id/download', photos.download(app.get('photos_dir')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
