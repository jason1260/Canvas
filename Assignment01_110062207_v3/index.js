var canvas = document.getElementById('AS1');
var cvs = null;
if (canvas.getContext) cvs = canvas.getContext('2d', { willReadFrequently: true });
else alert('Your broswer does not support canvas.');
var colorZone = document.getElementById('colZone');
var clz = null;
if (colorZone.getContext) clz = colorZone.getContext('2d');
else alert('Your broswer does not support canvas.');
var mode = 0;
var size = 1;
var idx = 0;
var isDrawing = false;
var isInput = false;
var isFill = false;
var lx, ly;
var font = "Arial";
var textSize = "40px";
var cvHistory = Array();
cvs.lineCap = "round";
cvs.lineJoin = "round";
cvs.globalAlpha = 1;
canvas.style.cursor = "url(./src/pen.png) 0 30, auto";
cvHistory.push(cvs.getImageData(0, 0, canvas.width, canvas.height));
function colorChange() {
    var r = document.getElementById('cR').value;
    var g = document.getElementById('cG').value;
    var b = document.getElementById('cB').value;
    document.getElementById('rValue').textContent = r;
    document.getElementById('gValue').textContent = g;
    document.getElementById('bValue').textContent = b;
    cvs.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")";
    cvs.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
    colorZone.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
}
function widthChange() {
    cvs.lineWidth = document.getElementById('wd').value;
    size = cvs.lineWidth;
}
function tpChange() {
    cvs.globalAlpha = document.getElementById('tp').value / 100;
}
function fill() {
    isFill = document.getElementById("fill").checked;
}
function fontChange(e) {
    cvs.font = textSize + " " + e.value;
    font = e.value;
    console.log("font change!" + cvs.font);
};
function sizeChange(e) {
    cvs.font = e.value + " " + font;
    textSize = e.value;
    console.log("fontSize change!" + cvs.font);
};
function dl() {
    var dlimg = document.createElement('a');
    dlimg.href = canvas.toDataURL("image/png");
    dlimg.type = 'save';
    dlimg.download = "image.png";
    dlimg.click();
    dlimg.remove();
}
function ul() {
    document.getElementById("inp").click();
}
document.getElementById('inp').onchange = function(e) {
    var img = new Image();
    img.onload = drawimg;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
    img.width = "50px";
    img.height = "50px";
};
function drawimg() {
    cvs.drawImage(this, 50, 50, 320, 240);
}
function failed() {
    console.error("File uploaded error!");
}
canvas.addEventListener('mousedown', function(e) {
    var crect = canvas.getBoundingClientRect();
    lx = e.clientX - crect.left;
    ly = e.clientY - crect.top;
    if (mode != 2) {
        isDrawing = true;
        cvs.beginPath();
        cvs.moveTo(lx, ly);
    }
});
canvas.addEventListener('mousemove', function(e) {
    var crect = canvas.getBoundingClientRect();
    var mx = e.clientX - crect.left;
    var my = e.clientY - crect.top;
    if (isDrawing) {
        if (mode == 0) {
            cvs.globalCompositeOperation="source-over";
            cvs.lineTo(mx, my);
            cvs.stroke();
            lx = mx;
            ly = my;
        } else if (mode == 1) {
            cvs.globalCompositeOperation="destination-out";
            cvs.moveTo(lx, ly);
            cvs.arc(mx, my, size, 0, Math.PI*2, false);
            cvs.fill();
            lx = mx;
            ly = my;
        } else if (mode == 3) {
            cvs.clearRect(0, 0, canvas.width, canvas.height);
            cvs.globalCompositeOperation="source-over";
            cvs.beginPath();
            cvs.putImageData(cvHistory[idx], 0, 0);
            cvs.rect(lx, ly, mx - lx, my- ly);
            if (!isFill) cvs.stroke();
            else cvs.fill();
        } else if (mode == 4) {
            tx = (lx + mx) / 2;
            ty = (ly + my) / 2;    
            cvs.clearRect(0, 0, canvas.width, canvas.height);
            cvs.globalCompositeOperation="source-over";
            cvs.beginPath();
            cvs.putImageData(cvHistory[idx], 0, 0);
            cvs.arc(tx, ty, Math.sqrt(Math.pow(tx - mx, 2) + Math.pow(ty - my, 2)), 0, Math.PI*2, false);
            if (!isFill) cvs.stroke();
            else cvs.fill();
        } else if (mode == 5) {
            cvs.clearRect(0, 0, canvas.width, canvas.height);
            cvs.globalCompositeOperation="source-over";
            cvs.beginPath();
            cvs.putImageData(cvHistory[idx], 0, 0);
            cvs.moveTo(mx, my);
            cvs.lineTo(lx, my);
            cvs.lineTo((mx + lx) / 2, ly - 30);
            cvs.lineTo(mx, my);
            if (!isFill) cvs.stroke();
            else cvs.fill();
        } else if (mode == 6) {
            cvs.clearRect(0, 0, canvas.width, canvas.height);
            cvs.globalCompositeOperation="source-over";
            cvs.beginPath();
            cvs.putImageData(cvHistory[idx], 0, 0);
            cvs.moveTo(lx, ly);
            cvs.lineTo(mx, my);
            cvs.stroke();
        }
    }
});
canvas.addEventListener('mouseup', function(e) {
    if (mode != 2) {
        isDrawing = false;
        idx += 1;
        cvHistory.length = idx;
        cvHistory.push(cvs.getImageData(0, 0, canvas.width, canvas.height));
        if (mode == 0) console.log("stroke saved! " + idx);
        else if (mode == 1) console.log("erase saved!" + idx);
        else if (mode == 3) console.log("square saved!" + idx);
        else if (mode == 4) console.log("circle saved!" + idx);
        else if (mode == 5) console.log("triangle saved!" + idx);
        else if (mode == 6) console.log("line saved!" + idx);
    } else if (!isInput) {
        isInput = true;
        addText(e.offsetX, e.offsetY);
    }
});
function rst() {
    cvs.clearRect(0, 0, canvas.width, canvas.height);
    cvHistory.push(cvs.getImageData(0, 0, canvas.width, canvas.height));
    idx += 1;
}
function changeMode(x) {
    mode = x;
    if (mode == 0) canvas.style.cursor = "url(./src/pen.png) 0 30, auto";
    else if (mode == 1) canvas.style.cursor = "url(./src/erase.png) 0 30, auto";
    else if (mode == 2) canvas.style.cursor = "url(./src/text.png) 0 30, auto";
    else if (mode == 3) canvas.style.cursor = "url(./src/square.png) 0 30, auto";
    else if (mode == 4) canvas.style.cursor = "url(./src/circle.png) 0 30, auto";
    else if (mode == 5) canvas.style.cursor = "url(./src/triangle.png) 0 30, auto";
    else if (mode == 6) canvas.style.cursor = "url(./src/line.png) 0 30, auto";
}
function undo() {
    if (idx > 0) {
        console.log("undo " + idx);
        idx -= 1;
        cvs.clearRect(0, 0, canvas.width, canvas.height);
        cvs.putImageData(cvHistory[idx], 0, 0);
    }
}
function redo() {
    console.log("wula");
    if (idx < cvHistory.length - 1) {
        console.log("redo " + idx);
        idx += 1;
        cvs.clearRect(0, 0, canvas.width, canvas.height);
        cvs.putImageData(cvHistory[idx], 0, 0);
    }
}
function addText(x, y) {
    var input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.left = x + 'px';
    input.style.top = y + 'px';
    input.onkeydown = place;
    document.body.appendChild(input);
    input.focus();
}
function place(e) {
    if (e.keyCode == 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        isInput = false;
    }
}
function drawText(txt, x, y) {
    cvs.textAlign = "left";
    cvs.fillText(txt, x, y);
    cvHistory.push(cvs.getImageData(0, 0, canvas.width, canvas.height));
    idx += 1;
}