let currentTime = -Infinity;
let lastTone = -Infinity;
let startTime = 0;

let hyperSpeed = 2;

function startSong() {
  startTime = Date.now() + 1000 * startingWait;
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

function drawNoteTopDown(chart, note, x, y, w, h) {
  //currentSong
  let yp = 0.9 * h - (note[0] - currentTime / 1000) / hyperSpeed * h;
  if(yp < -w / 18 / frets || yp > h + w / 18 / frets) {
    return;
  }
  ctx.fillRect(
    x + w / 3 + (note[1] + 0.5) * w / 3 / frets - w / 6 / frets,
    y + yp - w / 18 / frets,
    w / 3 / frets,
    w / 9 / frets);
}

function hitNotes() {
  //parse keys and detect hits & misses
}

function playSong(track) {
  for(let i = 0; i < track.notes.length; i++) {
    if(track.notes[i].time * 1000 < lastTone) {
      continue;
    }
    if(track.notes[i].time * 1000 >= currentTime) {
      return;
    }
    playSound(track.notes[i].midi, track.notes[i].duration, track.notes[i].velocity, track.instrument.family, track.instrument.name);
  }
}

function drawPlayChart(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, w, h);

  currentTime = Date.now() - startTime;

  hitNotes();

  drawLinesTopDown(songs[currentSong][2], x, y, w, h);

  for(let i = 0; i < songs[currentSong][3].chart.length; i++) {
    drawNoteTopDown(songs[currentSong][3], songs[currentSong][3].chart[i], x, y, w, h);
  }

  ctx.fillStyle = '#08f';
  ctx.fillRect(x + w / 3, y + h * 0.9 - 1, w / 3, 2);

  for(let i = 0; i < songs[currentSong][2].tracks.length; i++) {
    playSong(songs[currentSong][2].tracks[i]);
  }

  lastTone = currentTime;
}

function s4() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawPlayChart);
}
