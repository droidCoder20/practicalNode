//Require dependencies
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongoskin = require('mongoskin'),
    session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');    
    app = require();
    
//Configure settings
app.locals.appTitle = 'blog-express';
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if(app.get('env') == 'development') {
    app.use(errorHandler());
}

//Connect to DB
var dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
    db = mongoskin.db(dbUrl, {safe:true}),
    collections = {
        articles: db.collection('articles'),
        users: db.collection('users')
    };

//Define middleware
app.use(function(req, res, next){
    if(!collections.articles || !collections.users) {
        return next(new Error('No collections'));
    }     
    req.collections = collections;
    return next();
});

//Define Routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', routes.article.admin);
app.get('/post', routes.article.post);
app.post('/post', routes.article.postArticle);
app.post('/articles/:slug', routes.article.show);

app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);

app.all('*', function(req, res) {
  res.send(404);
});

//Start Server
var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function(){
    console.info('Express server listening on port ' + app.get('port'));
  });
}

var shutdown = function() {
  server.close();
}

if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}

//Start work with clusters