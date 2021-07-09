let frets = 5;

let volume = 11;

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

var keyCodes = {
  3: 'break',
  8: 'back',
  9: 'tab',
  12: 'clear',
  13: 'enter',
  16: 'shift',
  17: 'crtl',
  18: 'alt',
  19: 'pause',
  20: 'caps',
  21: 'hangul',
  25: 'hanja',
  27: 'esc',
  28: 'cnvrsn',
  29: 'n-cnvrsn',
  32: 'space',
  33: 'pg up',
  34: 'pg dn',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  41: 'slct',
  42: 'prnt',
  43: 'exe',
  44: 'prt scn',
  45: 'ins',
  46: 'del',
  47: 'help',
  91: 'lwin',
  92: 'rwin',
  93: 'rcmd',
  95: 'sleep',
  96: 'np 0',
  97: 'np 1',
  98: 'np 2',
  99: 'np 3',
  100: 'np 4',
  101: 'np 5',
  102: 'np 6',
  103: 'np 7',
  104: 'np 8',
  105: 'np 9',

  106: 'np *',
  107: 'np +',

  109: 'np -',
  110: 'np .',
  111: 'np /',

  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',

  144: 'numL',
  145: 'scrL',

  160: '^',
  161: '!',
  162: ';',
  163: '#',
  164: '$',
  165: 'u',
  172: 'home',

  173: 'mute',
  174: 'vol-',
  175: 'vol+',

  182: 'comp',
  183: 'calc',

  188: ',',
  186: ';',
  187: '=',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  193: '?',
  194: '.',

  219: '[',
  220: '\\',
  221: ']',
  222: '\'',
  223: '`',
};

let hyperSpeed = 7 / 3;
let hyperSpeedV = 3;

let colorMode = 1;
let colorPalette = 0;
let lefty = false;

let highway = 0;

let highScores = {};

function addHighScore() {
  let myScore = 0;
  let per = notesHit / totalNotes * 100;

  while(per >= scoreThresholds[myScore]) {
    myScore++;
  }

  let hash = CryptoJS.SHA1(
    JSON.stringify(songs[currentSong][2].tracks[chartTrack].notes)
  ).toString(CryptoJS.enc.Base64);

  if(!highScores.hasOwnProperty(hash)) {
    highScores[hash] = {};
  }

  if(highScores[hash].hasOwnProperty(`${frets},${maxNotes}`)) {
    if((FC ? 1 : 0) + per < (highScores[hash][`${frets},${maxNotes}`][1] ? 1 : 0) + highScores[hash][`${frets},${maxNotes}`][2]) {
      return;
    }
  }

  highScores[hash][`${frets},${maxNotes}`] = [myScore, FC, per];
}

function keyName(code) {
  if(code >= 256) {
    return `P${code/256>>0}-${(code%256)+1}`;
  }
  if(code > 47 && code < 91) {
    return String.fromCharCode(code);
  }
  if(keyCodes.hasOwnProperty(code)) {
    return keyCodes[code];
  }
  return code;
}

let notes = [0, 2, 4, 5, 7, 9, 11];

let pianoSounds = {};
let pianoHotkeys = {};
let transpose = 0;

function playPiano() {
  while(keys.length) {
    let key = keys.shift();
    fret = keyBindings.notes.indexOf(key[0]);
    if(fret < 0 || fret >= frets || holdingKeys[fret] === key[1]) {
      if(!pianoHotkeys.hasOwnProperty(key[0]) || !pianoHotkeys[key[0]]) {
        switch (key[0]) {
          case 38:
          case 16:
            transpose++;
            break;
          case 40:
          case 17:
          case 32:
            transpose--;
            break;
          case 13:
          case 39:
            transpose += 12;
            break;
          case 8:
          case 18:
          case 37:
            transpose -= 12;
            break;
          default:
            return;
        }
      } else if(!key[1]) {
        switch (key[0]) {
          case 16:
            transpose--;
            break;
          case 17:
          case 32:
            transpose++;
            break;
          case 13:
            transpose -= 12;
            break;
          case 8:
          case 18:
            transpose += 12;
            break;
        }
      }
      pianoHotkeys[key[0]] = key[1];
      return;
    }
    holdingKeys[fret] = key[1];
    if(!key[1]) {
      if(pianoSounds.hasOwnProperty(fret)) {
        pianoSounds[fret].cancel();
        delete pianoSounds[fret];
      }
      return;
    }
    if(fret < frets) {
      pianoSounds[fret] = player.queueWaveTable(audioContext, audioContext.destination, _tone_0010_GeneralUserGS_sf2_file, 0,
        60 + transpose + notes[fret % 7] + (fret / 7 >> 0) * 12, 999, volume / 50);
    }
  }
}

function drawSettings(x, y, w, h) {
  playPiano();
  ctx.drawImage(background, x, y, w, h);

  ctx.fillStyle = '#fff';
  ctx.font = `${(w*0.04)>>0}px Open Sans`;

  ctx.fillText('Keys', x + w * 0.45, y + h * 0.78);

  ctx.fillText('Lanes', x + w * 0.05, y + h * 0.23);
  ctx.textAlign = 'center';
  ctx.fillText(frets, x + w * 0.45, y + h * 0.23);
  ctx.textAlign = 'left';

  if(frets > 2) {
    button(
      x + w * 0.38,
      y + h * 0.15 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        frets = Math.max(2, frets - 1);
      }, minus, minus);
  }
  if(frets < fretColors[colorMode].length) {
    button(
      x + w * 0.48,
      y + h * 0.15 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        frets = Math.min(fretColors[colorMode].length, frets + 1);
      }, plus, plus);
  }

  ctx.fillText('Extended Sustains', x + w * 0.55, y + h * 0.23);

  button(
    x + w * 0.925,
    y + h * 0.15 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      extendedSustains = !extendedSustains;
    }, extendedSustains ? minus : plus, extendedSustains ? minus : plus);

  ctx.fillText('Lefty', x + w * 0.55, y + h * 0.33);

  button(
    x + w * 0.925,
    y + h * 0.25 + w * 0.01,
    w * 0.04, w * 0.04,
    a => {
      lefty = !lefty;
      for(let i = 0; i < fretColors.length; i++) {
        for(let j = 0; j < fretColors[i].length; j++) {
          fretColors[i][j].reverse();
        }
      }
    }, lefty ? minus : plus, lefty ? minus : plus);


  ctx.fillText('Color Mode', x + w * 0.55, y + h * 0.43);

  if(colorMode > 0) {
    button(
      x + w * 0.90,
      y + h * 0.35 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        colorMode = Math.max(0, colorMode - 1);
      }, minus, minus);
  }
  if(colorMode < fretColors.length - 1) {
    button(
      x + w * 0.95,
      y + h * 0.35 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        colorMode = Math.min(fretColors.length - 1, colorMode + 1);
      }, plus, plus);
  }

  ctx.fillText('Palette', x + w * 0.55, y + h * 0.53);

  if(colorPalette > 0) {
    button(
      x + w * 0.90,
      y + h * 0.45 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        colorPalette = Math.max(0, colorPalette - 1);
      }, minus, minus);
  }
  if(colorPalette < fretPalette.length - 1) {
    button(
      x + w * 0.95,
      y + h * 0.45 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        colorPalette = Math.min(fretPalette.length - 1, colorPalette + 1);
      }, plus, plus);
  }


  ctx.fillText('Highway', x + w * 0.55, y + h * 0.63);

  if(highway > 0) {
    button(
      x + w * 0.90,
      y + h * 0.55 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        highway = Math.max(0, highway - 1);
      }, minus, minus);
  }
  if(highway < highways.length - 1) {
    button(
      x + w * 0.95,
      y + h * 0.55 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        highway = Math.min(highways.length - 1, highway + 1);
      }, plus, plus);
  }


  ctx.fillText('Max Chord Size', x + w * 0.05, y + h * 0.33);
  ctx.textAlign = 'center';
  ctx.fillText(maxNotes, x + w * 0.45, y + h * 0.33);
  ctx.textAlign = 'left';

  if(maxNotes > 1) {
    button(
      x + w * 0.38,
      y + h * 0.25 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        maxNotes = Math.max(1, maxNotes - 1);
      }, minus, minus);
  }
  if(maxNotes < frets) {
    button(
      x + w * 0.48,
      y + h * 0.25 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        maxNotes = Math.min(frets, maxNotes + 1);
      }, plus, plus);
  }

  ctx.fillText('hyperSpeed', x + w * 0.05, y + h * 0.43);
  ctx.textAlign = 'center';
  ctx.fillText(hyperSpeedV, x + w * 0.45, y + h * 0.43);
  ctx.textAlign = 'left';

  if(hyperSpeedV > 1) {
    button(
      x + w * 0.38,
      y + h * 0.35 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        hyperSpeedV = Math.max(1, hyperSpeedV - 1);
        hyperSpeed = 7 / hyperSpeedV;
      }, minus, minus);
  }
  if(hyperSpeedV < 20) {
    button(
      x + w * 0.48,
      y + h * 0.35 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        hyperSpeedV = Math.min(20, hyperSpeedV + 1);
        hyperSpeed = 7 / hyperSpeedV;
      }, plus, plus);
  }

  ctx.fillText('Volume', x + w * 0.05, y + h * 0.53);
  ctx.textAlign = 'center';
  ctx.fillText(volume, x + w * 0.45, y + h * 0.53);
  ctx.textAlign = 'left';

  if(volume > 0) {
    button(
      x + w * 0.38,
      y + h * 0.45 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        volume = Math.max(0, volume - 1);
      }, minus, minus);
  }
  if(volume < 20) {
    button(
      x + w * 0.48,
      y + h * 0.45 + w * 0.01,
      w * 0.04, w * 0.04,
      a => {
        volume = Math.min(20, volume + 1);
      }, plus, plus);
  }
  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => {
      for(let sound in pianoSounds) {
        pianoSounds[sound].cancel();
        delete pianoSounds[sound];
      }
      sb = 0;
      saveCookie();
    }, backImg, backImgb);

  highways[highway](x - w, y + h * 0.8, w * 3, h * 0.2);
  for(let i = 0; i < frets; i++) {
    if(holdingKeys[lefty ? frets - 1 - i : i]) {
      ctx.fillStyle = fretPalette[colorPalette][fretColors[colorMode][frets - 1][i]];
      ctx.fillRect(x + i * w / frets, y + h * 0.9, w / frets, h * 0.1);
    }
  }
  ctx.fillStyle = '#fff';
  for(let i = 1; i <= frets - 1; i++) {
    ctx.fillRect(x + i * w / frets, y + h * 0.8, 1, h * 0.2);
  }
  ctx.font = `${(w*0.025)>>0}px Open Sans`;
  for(let i = 0; i < frets; i++) {
    button(
      x + i * w / frets - 1,
      y + h * 0.85,
      w / frets + 2,
      h * 0.1,
      a => {
        binding = lefty ? frets - 1 - i : i;
        keyBindings.notes[lefty ? frets - 1 - i : i] = -1;
      }, minus, minus);

    ctx.fillStyle = fretPalette[colorPalette][fretColors[colorMode][frets - 1][i]];

    ctx.fillRect(
      x + i * w / frets - 1,
      y + h * 0.85,
      w / frets + 2,
      h * 0.05);

    ctx.textAlign = 'center';
    ctx.fillText(binding === (lefty ? frets - 1 - i : i) ? '' : keyName(keyBindings.notes[lefty ? frets - 1 - i : i]),
      x + w * (i + 0.5) / frets,
      y + h * 0.94);
  }
}

function s1() {
  callWithinAR(0, 0, w, h, 16 / 9, drawSettings);
}
