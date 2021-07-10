let trackScroll = 0.02;
let trackScrollAt = 0.02;

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

function drawStars(song, bestV, x, y, w, h, scroll) {
  if(bestV[1]) {
    ctx.drawImage(listFullCombo,
      (x + w * 0.1 + w * 0.1) >> 0,
      (y + w * 0.008 + w * 0.1 * (song + 1) + scroll * w) >> 0,
      w * 0.4,
      w * 0.064)
    return;
  }

  for(let i = 2; i <= bestV[0]; i += 2) {
    ctx.drawImage(star,
      (x + w * (0.585 - i * 0.0135)) >> 0,
      (y + w * 0.1 * (song + 1) + w * 0.025 + scroll * w) >> 0,
      w * 0.03,
      w * 0.03);
  }
  if(bestV[0] % 2 && bestV[0] < 13) {
    ctx.drawImage(halfStar,
      (x + w * (0.565 - (bestV[0] - 0.5) * 0.0135)) >> 0,
      (y + w * 0.1 * (song + 1) + w * 0.025 + scroll * w) >> 0,
      w * 0.03,
      w * 0.03);
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
  trackScroll -= scroll / 1000;
  scroll = 0;
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

  if(Math.abs(trackScroll - trackScrollAt) < 0.0005) {
    trackScrollAt = trackScroll;
  }

  trackScrollAt += (trackScroll - trackScrollAt) / 10;

  ctx.drawImage(background, x, y, w, h);
  for(let i = 0; i < songs.length; i++) {
    if(y + w * 0.1 * (i + 1) + trackScrollAt * w < y ||
      y + w * 0.1 * (i + 1) + trackScrollAt * w > y + h) {
      continue;
    }
    button(
      (x + w * 0.1) >> 0,
      (y + w * 0.1 * (i + 1) + trackScrollAt * w) >> 0,
      w * 0.5,
      w * 0.08,
      a => {
        loadMidi(i);
        currentSong = i;
        sb = 3;
      }, paper, paper);

    ctx.fillStyle = '#000';
    ctx.font = `${(songs[i][1].length > 16 ? songs[i][1].length > 24 ? w * 0.02 : w * 0.03 : w * 0.04) >> 0}px Open Sans`;
    ctx.fillText(' ' + songs[i][1],
      (x + w * 0.11) >> 0,
      (y + w * 0.1 * (i + 0.96 * (songs[i][1].length > 16 ? songs[i][1].length > 24 ? 1.5 : 1.55 : 1.6)) + trackScrollAt * w) >> 0);

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
      drawStars(i, bestV, x, y, w, h, trackScrollAt);
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
