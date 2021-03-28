const WebSocket = require('ws');

const PORT = 8080;

const wss = new WebSocket.Server({port: PORT});

// 37 -> LEFT
// 38 -> UP
// 39 -> RIGHT
// 40 -> DOWN
const DIRECTIONS = [37, 38, 39, 40];

let counter = 0;

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        counter++;
        let idx = counter%DIRECTIONS.length;
        let direction = DIRECTIONS[idx];
        ws.send(direction);
        counter = idx;
    });
});

console.log('WS listening', PORT);
