
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var md = require("node-markdown").Markdown;
var crypto = require('crypto');
var databaseUrl = "blog";
var collections = ["posts", "sessions"]
var db = require("mongojs").connect(databaseUrl, collections);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('current_user', 'davedx@gmail.com');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mdx = function(text) {
	var html = md(text);
	return html.replace(/\[img ([^\]]+)\]/, "<img class=\"pic img-polaroid\" src=\"$1\">");
}

var checkToken = function(token, cb) {
	db.sessions.findOne({ token: token },
		function(err, session) {
			if(session)
				cb();
		});
}

app.post('/api/auth', function(req, res) {
	if(req.body.password == 'pass123') {
		var name = new Date() + 'ajsdisoaidjaso';
		var hash = crypto.createHash('md5').update(name).digest("hex");
		db.sessions.insert(
			{ token: hash });
		res.send({ token: hash });
	} else {
		res.status(500);
	}
});

app.get('/api/posts', function(req, res) {
	checkToken(req.get('token'), function() {
		db.posts.find({}, function(err, posts) {
		  if( err || !posts)
		  	res.status(500);
		  else {
		  	posts.forEach(function(post) {
		  		post.body_md = mdx(post.body);
		  	});
		  	res.send(posts);
		  }
		});
	});
});

app.get('/api/posts/:postid', function(req, res) {
	checkToken(req.get('token'), function() {
		db.posts.findOne({
			_id: db.ObjectId(req.params.postid)
			}, function(err, post) {
				if(err || !post)
					res.status(500);
				else {
					post.body_md = md(post.body);
					res.send(post);
				}
		});
	});
});

app.post('/api/posts', function(req, res) {
	checkToken(req.get('token'), function() {
		db.posts.insert(
			{ title: req.body.title,
				author: req.body.author,
				date: req.body.date,
				body: req.body.body
			});
		res.send({ status: 'OK'});
	});
});

app.post('/api/posts/:postid', function(req, res) {
	checkToken(req.get('token'), function() {
		db.posts.update(
			{ _id: db.ObjectId(req.params.postid) },
			{
				$set: { 
					title: req.body.title,
					author: req.body.author,
					date: req.body.date,
					body: req.body.body
				}
			});
		res.send({ status: 'OK'});
	});
});

app.get('/', function(req, res) {
	res.sendfile('public/index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
