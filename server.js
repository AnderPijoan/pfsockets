
/**********************************************************************/
// Create APP
/**********************************************************************/

var express = require('express');
var app = global.app = express();

/**********************************************************************/
// Set PORT
/**********************************************************************/

app.set('port', 80);

/**********************************************************************/
// User HELMET
/**********************************************************************/

var helmet = require('helmet');
app.use(helmet());

/**********************************************************************/
// View engine setup
/**********************************************************************/

var path = require('path');
app.set('views', __dirname);
app.set('view engine', 'pug');

/**********************************************************************/
// Favicon
/**********************************************************************/

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.png'));

/**********************************************************************/
// Cors
/**********************************************************************/

var cors = require('cors');
app.use(cors());

/**********************************************************************/
// Logger mode
/**********************************************************************/

var logger = require('morgan');
app.use(logger('dev'));

/**********************************************************************/
// Body parser
/**********************************************************************/

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // NEEDED FOR LOGIN PARSING
app.use(bodyParser.urlencoded({ extended : true })); // EXTENDED TRUE NEEDE FOR PARSING PAYPAL IPN MESSAGES

/**********************************************************************/
// Cookie parser
/**********************************************************************/

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', function (req, res) {
    res.render('index');
});

/**********************************************************************/
// SOCKET ROUTES
/**********************************************************************/

app.get('/socket/:socket_id', function (req, res) {
    if( global.io.sockets.adapter.rooms[ req.params.socket_id ] ){
        res.send( { socket : true } );
    } else {
        res.status(400).send( { socket : false } );
    }
});

app.post('/socket/:socket_id/:signal', function (req, res) {
    global.io.to( req.params.socket_id ).emit( req.params.signal , req.body );
    res.send();
});

app.get('/sockets', function (req, res) {
    var room_ids = [];
    for( var i in global.io.sockets.adapter.rooms ){
        room_ids.push( i );
    }
    res.send( room_ids );
});

/**********************************************************************/
// Error handlers
/**********************************************************************/

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('index');
});

/**********************************************************************/
// Start SERVER
/**********************************************************************/

var server = app.listen(app.get('port'), function() {
    console.log('[SERVER.JS] Express server listening on port', server.address().port);
});


/**********************************************************************/
// Set SOCKET SERVER and ROOMS
/**********************************************************************/
 
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    
    socket.on( 'join' , function (data) {
        if( data.socket_id ){ // Register to room = socket
            socket.join( data.socket_id );
        }
    });
    
});
global.io = io;

/**********************************************************************/
// RUN USING : node server.js
/**********************************************************************/

module.exports = app;
