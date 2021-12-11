let chartTrack = 0;

let currentTime = -Infinity;
let lastTime = -Infinity;
let lastTone = -Infinity;
const VOLUME_BUFFER = 6;
let lastVolume;
let startTime = 0;

let holdingKeys = [];

let fretPalette = [
  ['#00ff00', '#ff0000', '#ffff00', '#0088ff', '#ff8800', '#ff00ff', '#00ffff'],
  ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0088ff', '#ff00ff'],
  ['#117733', '#44AA99', '#88CCEE', '#DDCC77', '#CC6677', '#AA4499', '#882255'],
  ['#e69f00', '#56b3e9', '#009e73', '#f0e442', '#0071b2', '#d55c00', '#cc79a7']
];

let fretColors = [
  [
    [0],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2, 3],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 0, 1, 2, 3],
    [0, 1, 2, 3, 4, 0, 1, 2, 3],
    [0, 1, 2, 3, 4, 0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6],
  ],
  [
    [0],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2, 3],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 3, 2, 1, 0],
    [0, 1, 2, 3, 4, 3, 2, 1, 0],
    [0, 1, 2, 3, 4, 4, 3, 2, 1, 0],
    [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
    [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0],
    [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0],
    [0, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 0],
  ]
];

let streak;
let bestStreak;
let notesHit;
let totalNotes;
let FC;

let sustains = [];

function fretHighway(x, y, w, h) {
  for(let i = 0; i < frets; i++) {
    ctx.fillStyle = blendColors(fretPalette[colorPalette][fretColors[colorMode][frets - 1][i]], '#000000', 0.2);
    ctx.fillRect(x + w / 3 + i * w / frets / 3, y, w / frets / 3, h);
  }
}

let highways = [a => 0, fretHighway];

function startSong() {
  startTime = Date.now() + 1000 * startingWait;
  for(let i = 0; i < frets; i++) {
    holdingKeys[i] = false;
  }
  lastNoteHit = 0;
  streak = 0;
  bestStreak = 0;
  notesHit = 0;
  totalNotes = songs[currentSong][3].chart.length;
  currentTime = 0;
  sustains = [];
  FC = true;
  lastVolume = [];
  for(let i = 0; i < VOLUME_BUFFER; i++) {
    if(songs[currentSong][2].tracks[chartTrack].notes.length >= i) {
      lastVolume.push(songs[currentSong][2].tracks[chartTrack].notes[i].velocity);
    }
  }
}

function drawLinesTopDown(midi, x, y, w, h) {
  ctx.fillStyle = '#888';
  let bpm = 240;
  let ts = [4, 4];
  if(midi.header.timeSignatures.length) {
    ts = [midi.header.timeSignatures[0].timeSignature[0], midi.header.timeSignatures[0].timeSignature[1]];
  }
  if(midi.header.tempos.length) {
    bpm = midi.header.tempos[0].bpm;
  }
  let currentTS = 0;
  let currentBPM = 0;
  while(currentTS + 1 < midi.header.timeSignatures.length && midi.header.timeSignatures[currentTS + 1].ticks <= 0) {
    currentTS++;
    ts = [midi.header.timeSignatures[currentTS].timeSignature[0], midi.header.timeSignatures[currentTS].timeSignature[1]];
  }
  if(ts[0] <= 0) {
    ts[0] = 4;
  }
  if(ts[1] <= 0) {
    ts[1] = 4;
  }

  while(currentBPM + 1 < midi.header.tempos.length && midi.header.tempos[currentBPM + 1].ticks <= 0) {
    currentBPM++;
    bpm = midi.header.tempos[currentBPM].bpm;
  }
  if(bpm <= 0) {
    bpm = 1;
  }

  let beat = 0;
  let measure = 0;

  for(let yp, i = 0; i < midi.duration + 60 / bpm * (4 / ts[1]);) {
    yp = 0.9 * h - (i - currentTime / 1000) / hyperSpeed * h;
    if(yp < h && yp > 0) {
      if(beat == 0) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + w / 3, y + yp - 1, w / 3, 2);
        ctx.fillStyle = '#888';
      } else {
        ctx.fillRect(x + w / 3, y + yp - 1, w / 3, 2);
      }
      if(yp < 0) {
        i = Infinity;
        continue;
      }
    }
    beat = (beat + 1) % ts[0];
    if(beat == 0) {
      measure++;
    }

    let beatsLeft = 1;

    while(currentBPM + 1 < midi.header.tempos.length && midi.header.tempos[currentBPM + 1].time <= i + beatsLeft * (60 / bpm * (4 / ts[1]))) {
      currentBPM++;
      beatsLeft -= (midi.header.tempos[currentBPM].time - i) / (60 / bpm * (4 / ts[1]));
      i = midi.header.tempos[currentBPM].time;

      bpm = midi.header.tempos[currentBPM].bpm;
      if(bpm <= 0) {
        bpm = 1;
      }
    }

    i += beatsLeft * (60 / bpm * (4 / ts[1]));

    while(currentTS + 1 < midi.header.timeSignatures.length && midi.header.timeSignatures[currentTS + 1].measures <= measure) {
      currentTS++;
    }
    ts = midi.header.timeSignatures[currentTS] ? [midi.header.timeSignatures[currentTS].timeSignature[0], midi.header.timeSignatures[currentTS].timeSignature[1]] : [4, 4];
    if(ts[0] <= 0) {
      ts[0] = 4;
    }
    if(ts[1] <= 0) {
      ts[1] = 4;
    }
  }
}

function drawNoteTopDown(note, x, y, w, h, grey = 0) {
  //currentSong
  let yp = 0.9 * h - (note[0] - currentTime / 1000) / hyperSpeed * h;
  //let ly = 0.9 * h - (note[0] - lastTime / 1000) / hyperSpeed * h;

  if(grey === 0 && currentTime / 1000 - hitWindow > note[0] && lastTime / 1000 - hitWindow <= note[0]) {
    sustains.push([0, note[0], note[1], note[0] + note[2]]);
    return true;
  }

  if(grey === 0 && (yp < -w / 18 / frets || yp > h + w / 18 / frets)) {
    return;
  }
  ctx.fillStyle = grey ? '#888' : fretPalette[colorPalette][fretColors[colorMode][frets - 1][(lefty ? frets - 1 - note[1] : note[1])]];
  ctx.fillRect(
    x + w / 3 + ((lefty ? frets - 1 - note[1] : note[1]) + 0.5) * w / 3 / frets - w / 6 / frets,
    y + yp - w * noteHeight / 2,
    w / 3 / frets,
    w * noteHeight);

  let dur = note[2] / hyperSpeed * h;

  ctx.fillRect(
    x + w / 3 + ((lefty ? frets - 1 - note[1] : note[1]) + 0.5) * w / 3 / frets - w / 18 / frets,
    y + yp - dur,
    w / 9 / frets,
    dur);
}

function detectNoteHit(time, fret) {
  for(let i = 0; i < songs[currentSong][3].chart.length; i++) {
    if(songs[currentSong][3].chart[i][0] > time + hitWindow) {
      return false;
    }
    if(fret == songs[currentSong][3].chart[i][1] && Math.abs(songs[currentSong][3].chart[i][0] - time) < hitWindow) {
      //console.log([time,songs[currentSong][3].chart[i][0] - time,songs[currentSong][3].chart[i][0]]);
      //if(Math.abs(songs[currentSong][3].chart[i][0] - time) < hitWindow) {
      if(songs[currentSong][3].chart[i][2] > 0) {
        sustains.push([true, currentTime / 1000, songs[currentSong][3].chart[i][1], songs[currentSong][3].chart[i][0] + songs[currentSong][3].chart[i][2]]);
      }
      songs[currentSong][3].chart.splice(i, 1);
      streak++;
      if(streak > bestStreak) {
        bestStreak = streak;
      }
      notesHit++;
      return true;
    }
  }
}

function hitNotes() {
  while(keys.length) {
    let key = keys.shift();
    if(keyBindings.back.indexOf(key[0]) >= 0) {
      releaseKeys();
      sb = 6;
    }
    fret = keyBindings.notes.indexOf(key[0]);
    if(fret < 0 || fret >= frets || holdingKeys[fret] === key[1]) {
      return;
    }
    holdingKeys[fret] = key[1];
    if(!key[1]) {
      if(pianoSounds.hasOwnProperty(fret)) {
        try {
          pianoSounds[fret].cancel();
          delete pianoSounds[fret];
        } catch (e) {
          console.error(`Race condition canceling note.\n${e}`);
        }
      }
      return;
    }
    if(fret < frets && !detectNoteHit((key[2] - startTime) / 1000, fret)) {
      //playSound(distinctNotes[distinct[findInGroups(totalNotes - songs[currentSong][3].chart.length)[0]][fret]], 0.4,
      //  lastVolume.reduce((a, b) => a + b) / lastVolume.length,
      //  songs[currentSong][2].tracks[chartTrack].instrument.family,
      //  songs[currentSong][2].tracks[chartTrack].instrument.name);


      pianoSounds[fret] = player.queueWaveTable(audioContext, audioContext.destination,
        soundfontVariable(songs[currentSong][2].tracks[chartTrack].instrument.family,
          songs[currentSong][2].tracks[chartTrack].instrument.name),
        0,
        distinctNotes[distinct[findInGroups(totalNotes - songs[currentSong][3].chart.length)[0]][fret]], 999,
        (lastVolume.reduce((a, b) => a + b) / lastVolume.length) * volume / 50);

      streak = 0;
      FC = false;
    }
  }
}

function releaseKeys() {
  for(let fret in holdingKeys) {
    holdingKeys[fret] = false;
    if(pianoSounds.hasOwnProperty(fret)) {
      pianoSounds[fret].cancel();
      delete pianoSounds[fret];
    }
  }
}

function playSong(track, gameTrack) {
  for(let i = 0; i < track.notes.length; i++) {
    if(track.notes[i].time * 1000 < lastTone) {
      continue;
    }
    if(track.notes[i].time * 1000 > currentTime - hitWindow * 1000) {
      return;
    }
    if(gameTrack && notesHit > 0 && streak == 0) {
      return;
    }
    if(gameTrack) {
      lastVolume.shift();
      lastVolume.push(track.notes[i].velocity);
    }
    playSound(track.notes[i].midi, track.notes[i].duration, track.notes[i].velocity, track.instrument.family, track.instrument.name);
  }
}

let streakColors = ['#888', '#ff8844', '#88ff88', '#aaccff', '#ff88ff', '#fff'];
let scoreColors = ['#f00', 'rgb(128,65,121)', 'rgb(146,76,139)', 'rgb(177,68,166)', 'rgb(163,75,184)', 'rgb(142,59,184)', 'rgb(129,48,190)', 'rgb(107,59,184)', 'rgb(65,108,218)', 'rgb(65,169,218)', 'rgb(65,218,155)', 'rgb(109,221,155)', 'rgb(109,221,112)', 'rgb(225,209,14)'];

function drawScoreTopDown(x, y, w, h) {
  //ctx.font = `${(h*0.5)>>0}px Open Sans`;
  //ctx.fillStyle = '#fff';
  //ctx.fillText(`${notesHit}\n${streak}`, x, y + h / 2, w, h)
  if(FC) {
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + w / 3 * 2, y, w / 64, h);
  }
  for(let i = 0; i < 10; i++) {
    ctx.fillStyle = streakColors[(((streak / 10 >> 0) - 1 + (i < streak % 10 ? 1 : 0)) % 5) + 1];
    ctx.fillRect(x + w / 3 * 2, y + h - h / 10 * (i + 7 / 8), w / 64, h / 40 * 3);
  }

  ctx.fillStyle = '#888';
  ctx.fillRect(
    x + w * 2 / 3 + w / 64 + w * 0.01,
    y + h / 2 + h * 0.005,
    w * 1 / 3 - w / 64 - w * 0.02,
    h * 0.02);

  ctx.fillStyle = '#00d700';
  ctx.fillRect(
    x + w * 2 / 3 + w / 64 + w * 0.01,
    y + h / 2 + h * 0.005,
    (w * 1 / 3 - w / 64 - w * 0.02) * Math.max(0, Math.min(1, currentTime / 1000 / songs[currentSong][2].duration)),
    h * 0.02);


  let myScore = 0;
  let per = notesHit / (totalNotes - songs[currentSong][3].chart.length) * 100;
  if(totalNotes === songs[currentSong][3].chart.length) {
    per = 100;
  }

  while(per >= scoreThresholds[myScore]) {
    myScore++;
  }


  ctx.fillStyle = scoreColors[Math.max(0, myScore - 1)];
  ctx.fillRect(
    x + w * 2 / 3 + w / 64 + w * 0.01,
    y + h / 2 - h * 0.025,
    w * 1 / 3 - w / 64 - w * 0.02,
    h * 0.02);

  ctx.fillStyle = scoreColors[myScore];
  ctx.fillRect(
    x + w * 2 / 3 + w / 64 + w * 0.01,
    y + h / 2 - h * 0.025,
    (w * 1 / 3 - w / 64 - w * 0.02) * (per === 100 ? 1 : (per - scoreThresholds[myScore - 1]) / (scoreThresholds[myScore] - scoreThresholds[myScore - 1])),
    h * 0.02);


  ctx.fillStyle = '#000';

  ctx.fillRect(
    x - 1 + w * 2 / 3 + w / 64 + w * 0.01 + (w * 1 / 3 - w / 64 - w * 0.02) * ((per - scoreThresholds[myScore - 1]) / (scoreThresholds[myScore] - scoreThresholds[myScore - 1])),
    y + h / 2 - h * 0.025,
    3,
    h * 0.02);


  ctx.drawImage(scoreImgs[myScore], x + w * 2 / 3 + w / 64 + w * 0.01, y + h * 0.35, h / 8, h / 8);
  if(FC) {

    ctx.drawImage(listFullCombo, x + w * 1.15 / 3 + w / 64, y + h * 0.35, h / 6 * 6.25, h / 6);
  }
}

function drawPlayChart(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, w, h);

  highways[highway](x, y, w, h);

  ctx.fillStyle = '#fff';
  for(let i = 0; i <= frets; i++) {
    ctx.fillRect(x + w / 3 + i * w / frets / 3, y, 1, h);
  }

  lastTime = currentTime;
  currentTime = Date.now() - startTime;

  hitNotes();

  drawLinesTopDown(songs[currentSong][2], x, y, w, h);

  //[true, currentTime, song.chart[i][1], song.chart[i][0] + song.chart[i][2]]);
  for(let i = 0; i < sustains.length; i++) {
    if(!holdingKeys[sustains[i][2]]) {
      sustains[i][0] = false;
    } else if(sustains[i][0]) {
      sustains[i][1] = currentTime / 1000;
    }
    if(sustains[i][3] - sustains[i][1] < 0 || sustains[i][3] + hyperSpeed / 10 < currentTime / 1000) {
      sustains.splice(i, 1);
      i--;
      continue;
    }
    drawNoteTopDown([sustains[i][1], sustains[i][2], sustains[i][3] - sustains[i][1]], x, y, w, h, !sustains[i][0]);
  }

  for(let i = 0; i < songs[currentSong][3].chart.length; i++) {
    if(drawNoteTopDown(songs[currentSong][3].chart[i], x, y, w, h)) {
      songs[currentSong][3].chart.splice(i, 1);
      i--;
      streak = 0;
      FC = false;
    }
  }

  ctx.fillStyle = '#08f';
  ctx.fillRect(x + w / 3, y + h * 0.9 - 1, w / 3, 2);

  for(let i = 0; i < frets; i++) {
    if(holdingKeys[lefty ? frets - 1 - i : i]) {
      ctx.fillStyle = fretPalette[colorPalette][fretColors[colorMode][frets - 1][i]];
      ctx.fillRect(
        x + w / 3 + (i + 0.5) * w / 3 / frets - w / 6 / frets,
        y + 0.9 * h - w / 200,
        w / 3 / frets,
        w / 100);
    }
  }

  for(let i = 0; i < songs[currentSong][2].tracks.length; i++) {
    playSong(songs[currentSong][2].tracks[i], i === chartTrack);
  }

  lastTone = currentTime - hitWindow * 1000;

  if(currentTime / 1000 > songs[currentSong][2].duration + 1) {
    releaseKeys();
    sb = 5;
    g('event', notesHit / totalNotes > 0.6 ? 'beat_song' : 'lost_song', {
      song: songs[currentSong][1],
      score: (notesHit / totalNotes * 1000 >> 0) / 10
    });
    if(FC) {
      g('event', 'Full_combo', {
        song: songs[currentSong][1]
      });
    }
    addHighScore();
    saveCookie();
  }

  drawScoreTopDown(x, y, w, h);


  ctx.fillStyle = colors[0];
  ctx.fillRect(x, 0, w, y);
  ctx.fillRect(x, y + h, w, y);
}

function s4() {
  callWithinAR(0, 0, w, h, 16 / 9, drawPlayChart);
}
