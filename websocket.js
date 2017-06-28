var ws = new WebSocket("ws://127.0.0.1:8080");

ws.onmessage = function (data) {
    data = data.data;
    console.log(data);
    if (typeof data === 'string') {
        data = JSON.parse(data);

        if (data.type === "goto") {
            window.location = data.target;
        }
    }
};

ws.onclose = function () {
    //window.location = window.location;
};
