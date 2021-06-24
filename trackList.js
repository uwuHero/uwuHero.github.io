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
    ctx.font = `${(songs[i][1].length>25?songs[i][1].length>33?w*0.02:w*0.03:w*0.04)>>0}px sans-serif`;
    ctx.fillText(' ' + songs[i][1],
      (x + w * 0.11) >> 0,
      (y + w * 0.1 * (i + (songs[i][1].length > 25 ? songs[i][1].length > 33 ? 1.5 : 1.55 : 1.6)) + trackScroll * w) >> 0);
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
