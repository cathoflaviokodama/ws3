var WebSocketClient = require('websocket').client;

function Client(request) {
    var client = new WebSocketClient();
    var _resolve = null,_reject = null;
    var promise = new Promise((resolve,reject)=>{
        _resolve = resolve;
        _reject = reject;
    });

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection) {
        console.log('WebSocket Client Connected');
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
            _resolve();
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            }
        });
        function sendNumber() {
            if (connection.connected) {
                var number = Math.round(Math.random() * 0xFFFFFF);
                if(request) {
                    request.close = true;
                    request = JSON.stringify(request);
                } else {
                    request = JSON.stringify(
                        {
                            value : number.toString(),
                            close : true
                        }
                    );
                }
                connection.sendUTF(request);
            }
        }
        sendNumber();
    });
    
    client.connect('ws://localhost:8080/', 'echo-protocol');

    return {
        websocket : client,
        dataPromise : promise
    };


}

module.exports = Client;

