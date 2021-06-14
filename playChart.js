let chartTrack = 0;

let currentTime = -Infinity;
let lastTime = -Infinity;
let lastTone = -Infinity;
let startTime = 0;

let holdingKeys = [];

let fretColors = ['#00ff00', '#ff0000', '#ffff00', '#0088ff', '#ff8800', '#ff00ff', '#00ffff', '#ff00ff', '#ff8800', '#0088ff', '#ffff00', '#ff0000', '#00ff00'];

let streak;
let notesHit;
let FC;

let sustains = [];

function startSong() {
  startTime = Date.now() + 1000 * startingWait;
  for(let i = 0; i < frets; i++) {
    holdingKeys[i] = false;
  }
  lastNoteHit = 0;
  streak = 0;
  notesHit = 0;
  currentTime = 0;
  sustains = [];
  FC = true;
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
  ctx.fillStyle = grey ? '#888' : fretColors[note[1]];
  ctx.fillRect(
    x + w / 3 + (note[1] + 0.5) * w / 3 / frets - w / 6 / frets,
    y + yp - w / 200,
    w / 3 / frets,
    w / 100);

  let dur = note[2] / hyperSpeed * h;

  ctx.fillRect(
    x + w / 3 + (note[1] + 0.5) * w / 3 / frets - w / 18 / frets,
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
      notesHit++;
      return true;
    }
  }
}

function hitNotes() {
  while(keys.length) {
    let key = keys.shift();
    if(keyBindings.back.indexOf(key[0]) >= 0) {
      sb = 2;
    }
    fret = keyBindings.notes.indexOf(key[0]);
    if(fret < 0 || fret >= frets || holdingKeys[fret] === key[1]) {
      return;
    }
    holdingKeys[fret] = key[1];
    if(!key[1]) {
      return;
    }
    if(fret < frets && !detectNoteHit((key[2] - startTime) / 1000, fret)) {
      playSound((Math.random() * 32 >> 0) + 44, 0.2, 1, songs[currentSong][2].tracks[chartTrack].instrument.family, songs[currentSong][2].tracks[chartTrack].instrument.name);
      streak = 0;
      FC = false;
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
    playSound(track.notes[i].midi, track.notes[i].duration, track.notes[i].velocity, track.instrument.family, track.instrument.name);
  }
}

let streakColors = ['#888', '#ff8844', '#88ff88', '#aaccff', '#ff88ff', '#fff'];

function drawScoreTopDown(x, y, w, h) {
  //ctx.font = `${(h*0.5)>>0}px sans-serif`;
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
}

function drawPlayChart(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, w, h);

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
    if(holdingKeys[i]) {
      ctx.fillStyle = fretColors[i];
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

  if(currentTime / 1000 > songs[currentSong][2].duration) {
    sb = 2;
  }

  drawScoreTopDown(x, y, w, h);


  ctx.fillStyle = colors[0];
  ctx.fillRect(x, 0, w, y);
  ctx.fillRect(x, y + h, w, y);
}

function s4() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawPlayChart);
}
