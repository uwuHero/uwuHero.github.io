let frets = 5;

let hitWindow = 0.07;

let minimumSustain = 1;
let ignoreGap = 1;
let maxBPS = 30;
let stripSustain = 32;
let maxNotes = 2;
let extendedSustains = true;
let noteTolerance = 0.15;
let startingWait = 2;

let keyBindings = {
  select: [13],
  up: [38],
  down: [40],
  back: [8, 27],
  notes: [90, 88, 67, 86, 66, 78, 77, 188, 190, 191, -1, -1, -1, -1, -1, -1]
};

let binding = -1;

var keyCodes={
  3:'break',
  8:'back',
  9:'tab',
  12:'clear',
  13:'enter',
  16:'shift',
  17:'crtl',
  18:'alt',
  19:'pause',
  20:'caps',
  21:'hangul',
  25:'hanja',
  28:'cnvrsn',
  29:'n-cnvrsn',
  32:'space',
  33:'pg up',
  34:'pg dn',
  35:'end',
  36:'home',
  37:'left',
  38:'up',
  39:'right',
  40:'down',
  41:'slct',
  42:'prnt',
  43:'exe',
  44:'prt scn',
  45:'ins',
  46:'del',
  47:'help',
  91:'lwin',
  92:'rwin',
  93:'rcmd',
  95:'sleep',
  96:'np 0',
  97:'np 1',
  98:'np 2',
  99:'np 3',
  100:'np 4',
  101:'np 5',
  102:'np 6',
  103:'np 7',
  104:'np 8',
  105:'np 9',
  160:'^',
  161:'!',
  162:';',
  163:'#',
  164:'$',
  165:'u',
  172:'home',
  193:'?',
  223:'`',

  188:',',
  186:';',
  187:'=',
  189:'-',
  190:'.',
  191:'/',
  192:'`',
  194:'.',
  219:'[',
  220:'\\',
  221:']'
};

function keyName(code){
  if(code>47 && code<91){
    return String.fromCharCode(code);
  }
  if(keyCodes.hasOwnProperty(code)){
    return keyCodes[code];
  }
  return code;
}

function drawSettings(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center center';
  ctx.font = `${(w*0.04)>>0}px sans-serif`;

  ctx.fillText('Keys', x + w * 0.45, y + h * 0.78);

  ctx.fillText('Lanes', x + w * 0.05, y + h * 0.23);
  ctx.fillText(frets, x + w * 0.45, y + h * 0.23);

  button(
    x + w * 0.38,
    y + h * 0.15 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      frets = Math.max(2, frets - 1)
    }, minus, minus);

  button(
    x + w * 0.5,
    y + h * 0.15 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      frets = Math.min(fretColors.length, frets + 1)
    }, plus, plus);

  ctx.fillText('Max Chord Size', x + w * 0.05, y + h * 0.33);
  ctx.fillText(maxNotes, x + w * 0.45, y + h * 0.33);

  button(
    x + w * 0.38,
    y + h * 0.25 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      maxNotes = Math.max(1, maxNotes - 1)
    }, minus, minus);

  button(
    x + w * 0.5,
    y + h * 0.25 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      maxNotes = Math.min(frets, maxNotes + 1)
    }, plus, plus);


  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 0, backImg, backImgb);

  for(let i = 0; i < frets; i++) {
    button(
      x + w * 0.05 + w * 0.98 * i / frets - w * 0.04,
      y + h * 0.8 + w * 0.01,
      w * 0.08, w * 0.08,
      a => {
        binding = i;
        keyBindings.notes[i] = -1;
      }, minus, minus);

    ctx.fillStyle = fretColors[i];
    ctx.fillRect(
      x + w * 0.05 + w * 0.98 * i / frets - w * 0.04,
      y + h * 0.8 + w * 0.01,
      w * 0.08, w * 0.04);

    ctx.fillText(keyName(keyBindings.notes[i]),
      x + w * 0.05 + w * 0.98 * i / frets - h * 0.04,
      y + h * 0.95);
  }
}

function s1() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawSettings);
}
