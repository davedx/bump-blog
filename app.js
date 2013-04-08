
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var md = require("node-markdown").Markdown;

var databaseUrl = "blog"; // "username:password@example.com/mydb"
var collections = ["posts"]
var db = require("mongojs").connect(databaseUrl, collections);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('current_user', 'davedx@gmail.com');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mdx = function(text) {
	var html = md(text);
	return html.replace(/\[img ([^\]]+)\]/, "<img class=\"pic img-polaroid\" src=\"$1\">");
}

app.get('/api/posts', function(req, res) {
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

app.get('/api/posts/:postid', function(req, res) {
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

app.post('/api/posts', function(req, res) {
	db.posts.insert(
		{ title: req.body.title,
			author: req.body.author,
			date: req.body.date,
			body: req.body.body
		});
	res.send({ status: 'OK'});
});

app.post('/api/posts/:postid', function(req, res) {
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

app.get('/', function(req, res) {
	res.sendfile('public/index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
