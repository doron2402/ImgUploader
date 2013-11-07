/*
var photos = [];

photos.push({
	name: 'basdfc a',
	path: 'http://nodejs.org/images/logos/nodejs-green.png'
});

photos.push({
	name: 'asdfasdf kjasndfiuhkjn asd',
	path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

exports.list = function(req, res) {
	
	res.render('photos', {
		title: 'Photos',
		photos: photos
	});
};

*/


var fs = require('fs');
var path = require('path');
var join = path.join;
var Photo = require('../models/Photo');


exports.list = function (req, res, next) {
	Photo.find({}, function (err, photos) {
		if (err)
			return next(err)

		res.render('photos', {
			title: 'Photos',
			photos: photos
		});
	});
};


exports.form = function (req, res) {
	res.render('photos/upload', {
		title: 'Upload a photo'
	});
};

exports.submit = function(dir) {
	return function (req, res, next) {
		var img = req.files.photo.image;
		var name = req.body.photo.name || img.name;
		var path = join(dir, img.name);

		fs.rename(img.path, path, function(err) {
			if (err)
				return next(err);

			Photo.create({
				name: name,
				path: img.name
			}, function (err) {
				if (err)
					return next(err);

				res.redirect('/photos');
			});
		});
	};
};


exports.download = function (dir) {
	return function (req, res, next) {
		var id = req.params.id;

		Photo.findById(id, function(err, photo) {
			if (err) 
				return next(err);

			console.log(photo);
			var path = join(dir, photo.path); //return absolute path to file
			//res.sendfile(path); //transfer file
			res.download(path, photo.name+'.jpg');
		});
	};
};
