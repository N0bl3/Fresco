// WebSocket setup
var socket = new WebSocket("ws://localhost:3000");
socket.onopen = (e) => {
    socket.onclose = (e) => {
        console.log("closed")
    }
    socket.onmessage = (e) => {
        console.log(e.data);
    };
}

socket.onerror = (e) => {
    console.log("error")
}

// Set paint brush
var fresco = document.getElementById("fresco");

var mousedown = 0;
fresco.addEventListener("mousedown", function (e) {
    e.preventDefault();
    mousedown = 1;
});
fresco.addEventListener("mouseup", function (e) {
    e.preventDefault();
    mousedown = 0;
});

var pixels = document.getElementsByClassName("pixel");
for (let i = 0; i < pixels.length; i++) {
    pixels[i].addEventListener("mouseenter", function (e) {
        if ((mousedown)) {
            const hexColor = document.getElementById("color-picker").value;
            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);

            this.setAttribute("style", `background-color:rgb(${r},${g},${b})`);
            
            var changeColor = new XMLHttpRequest();
            changeColor.open("POST", "/change", true);
            changeColor.setRequestHeader(
                "Content-type",
                "application/x-www-form-urlencoded"
            );
            changeColor.send(
                `_id=${this.getAttribute("_id")}&x=${this.getAttribute("x")}&y=${this.getAttribute("y")}&r=${r}&g=${g}&b=${b}`
            );
            
            /* socket.send(JSON.stringify({
                _id: this.getAttribute("_id"),
                x: this.getAttribute("x"),
                y: this.getAttribute("y"),
                r: r,
                g: g,
                b: b
            }))*/

        }
    });
}
