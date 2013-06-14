
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , client = require('./routes/client')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('4iuh234uibc39283z4592b83z5v27z528756287645287rkjasndnf'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express['static'](path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/client', client.index);


var server = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

//var tiltReceivers = [];

io.sockets.on('connection', function(socket) {

    socket.on('tilt', function(tilt) {
        console.log('tiltLR:', tilt.LR, 'tileFB:', tilt.FB);
        socket.broadcast.emit('tilt', tilt);
    });
});

