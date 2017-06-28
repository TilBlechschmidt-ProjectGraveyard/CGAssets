const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

var variables = {
    score1: 0,
    score2: 0
};

wss.on('connection', function connection(ws) {

    for (var key in variables) {
        ws.send(JSON.stringify({ type: "var", name: key, value: variables[key] }))
    }



    ws.on('message', function incoming(data) {
        console.log(data);
        // Broadcast to everyone else.
        var message = data;

        var pdata = JSON.parse(data);

        if (pdata.type === "var") {
            var name = pdata.name;

            if (pdata.opp === "inc") {
                variables[name]++;
            } else if (pdata.opp === "dec") {
                variables[name]--;
            }

            message = JSON.stringify({ type: "var", name: name, value: variables[name] })
        }

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});



// Static file serving
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use(express.static('.'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
