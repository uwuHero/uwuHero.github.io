let frets = 5;
let minimumSustain = 0.5;
let ignoreGap = 1;
let maxBPS = 30;
let stripSustain = 1;
let maxNotes = 2;
let extendedSustains = true;
let noteTolerance = 0.15;
let startingWait = 2;

let keyBindings = {
  select: [13],
  up: [38],
  down: [40],
  back: [8, 27],
  notes: [90, 88, 67, 86, 66, 78, 77, 188, 190, 191]
};

function drawSettings(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  button(x + w * 0.05, y + h * 0.2, w * 0.3, h * 0.15, a => sb = 0, uwu2, uwu2b)
}

function s1() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawSettings);
}
