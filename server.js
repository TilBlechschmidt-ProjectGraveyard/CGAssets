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
    score2: 0,
    startTime: 0,
    pauseTime: 0,
    ge_ohg: 0,
    ge_abi: 0,
    vo_ohg: 0,
    vo_abi: 0,
    fu_ohg: 0,
    fu_abi: 0
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
            } else if (pdata.opp === "set") {
                console.log(pdata);
                variables[name] = pdata.value;
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
    res.send('<a href="/control.html">Controller</a><br><a href="/scoreCounter.html">Score Counter</a>');
});

app.use(express.static('.'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
