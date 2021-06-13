let instrumentScroll = 0.02;

function drawChartSettings(x, y, w, h) {
  let cSong = songs[currentSong][2];

  if(cSong) {
    if(mouseX < x + w * 0.1) {

    } else if(mouseY - y < 0.2 * h) {
      instrumentScroll += (0.2 - (mouseY - y) / h) / 16;
    } else if(mouseY - y > 0.8 * h) {
      instrumentScroll -= ((mouseY - y) / h - 0.8) / 16;
    }
    if(instrumentScroll > 0.02) {
      instrumentScroll = 0.02;
    }
    if(instrumentScroll < 0.5 - (cSong.tracks.length + 0.5) * 0.1) {
      instrumentScroll = 0.5 - (cSong.tracks.length + 0.5) * 0.1;
    }
    if(cSong.tracks.length < 5) {
      instrumentScroll = 0.02;
    }

    ctx.drawImage(background, x, y, w, h);

    for(let i = 0; i < cSong.tracks.length; i++) {
      button(
        (x + w * 0.1) >> 0,
        (y + w * 0.1 * (i + 1) + instrumentScroll * w) >> 0,
        w * 0.5,
        w * 0.08,
        a => {
          songs[currentSong][3] = chartSong(cSong, i);
          chartTrack = i;
          startSong();
          sb = 4;
        }, paper, paper);
        /*
      ctx.fillStyle = '#fffa';
      ctx.fillRect(
        (x + w * 0.1) >> 0,
        (y + w * 0.1 * (i + 1) + instrumentScroll * w) >> 0,
        w * 0.5,
        w * 0.08);
        */
      ctx.fillStyle = '#000';
      let txt = (i > 0 && cSong.tracks[i - 1].instrument.name == cSong.tracks[i].instrument.name ? (cSong.tracks[i].notes[0].midi < 60 ? 'bass ' : '') : '') + (cSong.tracks.length > 6 ? cSong.tracks[i].instrument.name : cSong.tracks[i].instrument.family);
      ctx.font = `${(txt.length>25?txt.length>33?w*0.02:w*0.03:w*0.04)>>0}px sans-serif`;
      ctx.fillText(' '+txt,
        (x + w * 0.11) >> 0,
        (y + w * 0.1 * (i + (txt.length > 25 ? txt.length > 33 ? 1.5 : 1.55 : 1.6)) + instrumentScroll * w) >> 0);
    }
  } else {
    ctx.drawImage(background, x, y, w, h);
  }

  ctx.fillStyle = colors[0];
  ctx.fillRect(0, y + h, w, h);
  ctx.drawImage(overlay, x, y, w, h);

  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 2, backImg, backImgb);
}

function s3() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawChartSettings);
}
