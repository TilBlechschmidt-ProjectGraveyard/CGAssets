var ws = new WebSocket("ws://" + window.location.hostname + ":8080");

var hidden = false;

ws.onmessage = function (data) {
    data = data.data;
    console.log(data);
    if (typeof data === 'string') {
        data = JSON.parse(data);

        if (data.type === "goto") {
            if (!hidden && typeof window["hide"] === "function") {
                window["hide"]();
                setTimeout(function () {
                    window.location = data.target;
                }, 2000)
            } else {
                window.location = data.target;
            }
            // window.location = data.target;
        } else if (data.type === "func") {
            if (typeof window[data.name] === "function") {
                window[data.name]();

                hidden = data.name === "hide";
            }
        } else if (data.type === "var") {
            if (data.name === "score1") {
                document.getElementById("counter").setAttribute("data-team1", data.value)
            } else if (data.name === "score2") {
                document.getElementById("counter").setAttribute("data-team2", data.value)
            }
        }
    }
};

ws.onclose = function () {
    //window.location = window.location;
};
