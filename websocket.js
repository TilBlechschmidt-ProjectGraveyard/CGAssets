var hidden = false;

var variables = {
    startTime: 0,
    pauseTime: 0
}


var isController = window.location.pathname.indexOf("control.html") > 0

var ws = new WebSocket("ws://" + window.location.hostname + ":8080");


ws.onmessage = function (data) {
    data = data.data;
    console.log(data);
    if (typeof data === 'string') {
        data = JSON.parse(data);
        
        

        if (!isController && data.type === "goto") {
            if (!hidden && typeof window["hide"] === "function") {
                window["hide"]();
                setTimeout(function () {
                    window.location = data.target;
                }, 2000)
            } else {
                window.location = data.target;
            }
            // window.location = data.target;
        } else if (isController && data.type === "func") {
            if (typeof window[data.name] === "function") {
                window[data.name]();

                hidden = data.name === "hide";
            }
        } else if (data.type === "var") {
            variables[data.name] = data.value
            
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
