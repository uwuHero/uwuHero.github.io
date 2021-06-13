let frets = 5;

let hitWindow = 0.07;

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
  notes: [90, 88, 67, 86, 66, 78, 77, 188, 190, 191,-1,-1,-1,-1,-1,-1]
};

let binding = -1;

function drawSettings(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center center';
  ctx.font = `${(w*0.04)>>0}px sans-serif`;

  ctx.fillText('Lanes', x + w * 0.05, y + h * 0.38);
  ctx.fillText(frets, x + w * 0.25, y + h * 0.38);


  ctx.fillText('Keys', x + w * 0.45, y + h * 0.48);

  button(
    x + w * 0.18,
    y + h * 0.3 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      frets = Math.max(1, frets - 1)
    }, minus, minus);

  button(
    x + w * 0.3,
    y + h * 0.3 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      frets = Math.min(fretColors.length, frets + 1)
    }, plus, plus);


  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 0, backImg, backImgb);

  for(let i = 0; i < frets; i++) {
    button(
      x + w * 0.05 + w * 0.98 * i / frets - w * 0.04,
      y + h * 0.5 + w * 0.01,
      w * 0.08, w * 0.08,
      a => {binding = i;keyBindings.notes[i]=-1;}, minus, minus);

    ctx.fillText(keyBindings.notes[i],
      x + w * 0.05 + w * 0.98 * i / frets-h*0.05,
      y + h * 0.75);
  }
}

function s1() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawSettings);
}
