var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer( (request, response) => {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead( 301 , { Location : 'https://pantallafacil.tv' } );
    response.end();

});

server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    maxReceivedFrameSize: 64*1024*1024,   // 64MiB
    maxReceivedMessageSize: 64*1024*1024, // 64MiB
    fragmentOutgoingMessages: false,
    keepalive: false,
    disableNagleAlgorithm: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('connect' , connection => {
     console.log((new Date()) + ' Connection accepted - Protocol Version ' + connection.webSocketVersion);
});

wsServer.on('request' , request => {

    var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
    
    connection.on('message', message => {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF( message.utf8Data );
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes( message.binaryData );
        }
    });
    
    connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
    
});
