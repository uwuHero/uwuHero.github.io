let dev = true;
let version = "0.0.1";

const colors = ["#242729", "grey", "#151515", "white", "blue"];


//initialize canvas
const c = document.getElementById("canvas");
const ctx = c.getContext("2d", {
  alpha: false
});
c.style.backgroundColor = "red";
c.width = window.innerWidth;
c.height = window.innerHeight;

//initialize variables and constants
let w = c.width,
  h = c.height,
  last = true,
  mouseIsPressed = false,
  FPSCounter = false;

let mouseX = 0,
  mouseY = 0;

/**
 * button - draws a rectangular button with an image & hover-image
 *
 * @param  {type} x        x
 * @param  {type} y        y
 * @param  {type} w        width
 * @param  {type} h        height
 * @param  {type} callback runs when clicked
 * @param  {type} img      main image
 * @param  {type} imgb     hover-image
 */
function button(x, y, w, h, callback, img, imgb) {
  if(img) {
    if(mouseX > x &&
      mouseX < x + w &&
      mouseY > y &&
      mouseY < y + h) {
      document.body.style.cursor = 'pointer';
      if(!last && mouseIsPressed) {
        callback();
        last = true;
      }
      ctx.drawImage(imgb, x >> 0, y >> 0, w >> 0, h >> 0);
    } else {
      ctx.drawImage(img, x >> 0, y >> 0, w >> 0, h >> 0);
    }
    return;
  }

  if(mouseX > x &&
    mouseX < x + w &&
    mouseY > y &&
    mouseY < y + h) {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    document.body.style.cursor = 'pointer';
    if(!last && mouseIsPressed) {
      callback();
      last = true;
    }
    ctx.fillRect(x >> 0, y >> 0, w >> 0, h >> 0);
  } else if(!img) {
    ctx.fillStyle = colors[2];
    ctx.fillRect(x >> 0, y >> 0, w >> 0, h >> 0);
  }
}

/**
 * callWithinAR - Calls the callback function with parameters for a rect of the specified aspect ratio within the rect provided
 *
 * @param  {number} x        x
 * @param  {number} y        y
 * @param  {number} width    width
 * @param  {number} height   height
 * @param  {number} ar       aspect ratio
 * @param  {function} callback callback
 */
function callWithinAR(x, y, width, height, ar, callback) {
  if(height * ar < width) {
    //wide
    callback(x + width / 2 - height / 2 * ar >> 0, y >> 0, height * ar >> 0, height >> 0);
  } else {
    //tall
    callback(x >> 0, y + height / 2 - width / 2 / ar >> 0, width >> 0, width / ar >> 0);
  }
}

function imgaeWithinAR(img, ar, x, y, w, h) {
  callWithinAR(x, y, w, h, ar, (x, y, w, h) => ctx.drawImage(img, x, y, w, h));
}

let scene = 0,
  sb = 0;

const scenes = [s0, s1, s2, s3, s4];

let lt = Date.now();
let ti = lt;

function drawCanvas(t) {
  ctx.imageSmoothingQuality = "high";
  document.body.style.cursor = 'default';
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  scenes[scene]();
  scene = sb;
  if(scene != 4) {
    keys = [];
  }

  if(dev) {
    ti = Date.now();
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 100, 25);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText((1000 / (ti - lt) >> 0) + " FPS", 5, 20);
    lt = ti;
  }

  if(t) {
    window.requestAnimationFrame(drawCanvas);
  }
}
window.requestAnimationFrame(drawCanvas);

//event listeners
window.onresize = () => {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  w = c.width;
  h = c.height;
}

window.onmousemove = (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

window.onmouseup = (event) => {
  mouseIsPressed = true;
  last = false;
  drawCanvas(false);
  mouseIsPressed = false;
  last = true;
}

window.onmouseleave = (event) => {
  mouseIsPressed = false;
  last = true;
  mouseX = -1;
  mouseY = -1;
}


window.onmouseout = (event) => {
  mouseIsPressed = false;
  last = true;
  mouseX = -1;
  mouseY = -1;
}

let gamepadKeys = {};
let gamepads = {};

function pollGamepads() {
  let cGamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

  for(let i in gamepads) {
    let gp = cGamepads[i];
    if(gp) {
      for(let j = 0; j < gp.buttons.length; j++) {
        let pr = gp.buttons[j].pressed;
        if(gamepadKeys[i][j] !== pr){
          gamepadKeys[i][j] = pr;
          keys.push([255+255*i+j, pr, Date.now()]);

          if(pr && binding >= 0) {
            keyBindings.notes[binding] = 255+255*i+j;
            binding = -1;
          }
        }
      }
    }
  }
}

gamepadInterval = setInterval(pollGamepads, 10);

function gamepadHandler(event, connecting) {
  let gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if(connecting) {
    gamepads[gamepad.index] = gamepad;
    gamepadKeys[gamepad.index] = [];
    for(let i = 0; i < gamepad.buttons.length; i++) {
      gamepadKeys[gamepad.index][i] = false;
    }
  } else {
    delete gamepads[gamepad.index];
    delete gamepadKeys[gamepad.index];
  }
}

window.addEventListener("gamepadconnected", function(e) {
  gamepadHandler(e, true);
}, false);
window.addEventListener("gamepaddisconnected", function(e) {
  gamepadHandler(e, false);
}, false);


let ltouch = [0, 0];
window.ontouchstart = (event) => {
  mouseX = event.touches[0].clientX;
  mouseY = event.touches[0].clientY;
  ltouch = [mouseX, mouseY];
  mouseIsPressed = true;
}

window.ontouchend = (event) => {
  mouseIsPressed = true;
  last = false;
  drawCanvas(false);
  mouseIsPressed = false;
  last = true;
  mouseX = -1;
  mouseY = -1;
}

window.ontouchmove = (event) => {
  if(mouseIsPressed) {
    mouseX = event.touches[0].clientX;
    mouseY = event.touches[0].clientY;
  }
}

let keys = [];

document.onkeydown = (event) => {
  if(binding >= 0) {
    keyBindings.notes[binding] = event.keyCode;
    binding = -1;
  }
  keys.push([event.keyCode, true, Date.now()]);
}

document.onkeyup = (event) => {
  keys.push([event.keyCode, false, Date.now()]);
}

document.addEventListener('contextmenu', event => event.preventDefault());

// special dev settings
if(dev) {
  FPSCounter = true;
}
