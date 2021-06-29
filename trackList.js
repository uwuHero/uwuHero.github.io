let trackScroll = 0.02;

let midiDisplay = false;

function toggleMidiInput(x, y, w, h) {
  midiDisplay = !midiDisplay;
  document.getElementById('FileDrop').style.display = midiDisplay ? 'block' : 'none';
  if(midiDisplay) {
    positionMidiInput(x, y, w, h);
  }
}

function positionMidiInput(x, y, w, h) {
  let fd = document.getElementById('FileDrop');
  fd.style.width = `${w * 0.3}px`;
  fd.style.height = `${h * 0.6}px`;
  fd.style.right = `${x + w * 0.045}px`;
  fd.style.top = `${y + h * 0.25}px`;
}

function drawStars(song, bestV, x, y, w, h) {
  if(bestV[1]) {
    ctx.drawImage(listFullCombo,
      (x + w * 0.1) >> 0,
      (y + w * 0.1 * (song + 1) + trackScroll * w) >> 0,
      w * 0.5,
      w * 0.08)
    return;
  }

  for(let i = 2; i <= bestV[0]; i += 2) {
    ctx.drawImage(star,
      (x + w * (0.585 - i * 0.018)) >> 0,
      (y + w * 0.1 * (song + 1) + w * 0.02 + trackScroll * w) >> 0,
      w * 0.04,
      w * 0.04);
  }
  if(bestV[0] % 2 && bestV[0] < 13) {
    ctx.drawImage(halfStar,
      (x + w * (0.565 - bestV[0] * 0.018)) >> 0,
      (y + w * 0.1 * (song + 1) + w * 0.02 + trackScroll * w) >> 0,
      w * 0.04,
      w * 0.04);
  }
}

function drawTrackList(x, y, w, h) {
  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 0);
  if(!midiDisplay) {
    toggleMidiInput(x, y, w, h);
  }
  if(mouseX < x + w * 0.1) {

  } else if(mouseY - y < 0.2 * h) {
    trackScroll += (0.2 - (mouseY - y) / h) / 16;
  } else if(mouseY - y > 0.8 * h) {
    trackScroll -= ((mouseY - y) / h - 0.8) / 16;
  }
  if(trackScroll > 0.02) {
    trackScroll = 0.02;
  }
  if(trackScroll < 0.5 - (songs.length + 0.5) * 0.1) {
    trackScroll = 0.5 - (songs.length + 0.5) * 0.1;
  }

  if(songs.length < 5) {
    trackScroll = 0.02;
  }

  ctx.drawImage(background, x, y, w, h);
  for(let i = 0; i < songs.length; i++) {
    if(y + w * 0.1 * (i + 1) + trackScroll * w < y ||
      y + w * 0.1 * (i + 1) + trackScroll * w > y + h) {
      continue;
    }
    button(
      (x + w * 0.1) >> 0,
      (y + w * 0.1 * (i + 1) + trackScroll * w) >> 0,
      w * 0.5,
      w * 0.08,
      a => {
        loadMidi(i);
        currentSong = i;
        sb = 3;
      }, paper, paper);

    ctx.fillStyle = '#000';
    ctx.font = `${(songs[i][1].length > 16 ? songs[i][1].length > 24 ? w * 0.02 : w * 0.03 : w * 0.04) >> 0}px sans-serif`;
    ctx.fillText(' ' + songs[i][1],
      (x + w * 0.11) >> 0,
      (y + w * 0.1 * (i + (songs[i][1].length > 16 ? songs[i][1].length > 24 ? 1.5 : 1.55 : 1.6)) + trackScroll * w) >> 0);

    if(songs[i].hasOwnProperty('hashes')) {
      let best = -1;
      let bestV = [];

      for(let hash in songs[i].hashes) {
        if(!highScores.hasOwnProperty(songs[i].hashes[hash]) || !highScores[songs[i].hashes[hash]].hasOwnProperty(`${frets},${maxNotes}`)) {
          continue;
        }
        let currentScore = (highScores[songs[i].hashes[hash]][`${frets},${maxNotes}`][1] ? 1 : 0) + highScores[songs[i].hashes[hash]][`${frets},${maxNotes}`][2];
        if(currentScore > best) {
          best = currentScore;
          bestV = highScores[songs[i].hashes[hash]][`${frets},${maxNotes}`];
        }
      }
      drawStars(i, bestV, x, y, w, h);
    }
  }

  ctx.fillStyle = colors[0];
  ctx.fillRect(0, y + h, w, h);
  ctx.drawImage(overlay, x, y, w, h);

  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 0, backImg, backImgb);
}

function s2() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawTrackList);
}
