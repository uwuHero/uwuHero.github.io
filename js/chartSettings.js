let instrumentScroll = 0.02;

function drawChartSettings(x, y, w, h) {
  let cSong = songs[currentSong][2];

  let mins = 0;
  if(cSong) {
    ctx.drawImage(background, x, y, w, h);

    for(let i = 0; i < cSong.tracks.length; i++) {
      if(cSong.tracks[i].instrument.percussion || cSong.tracks[i].notes.length === 0) {
        mins++;
        continue;
      }
      if((w * 0.1 * ((i - mins) + 1) + instrumentScroll * w) >> 0 > 0) {
        button(
          (x + w * 0.1) >> 0,
          (y + w * 0.1 * ((i - mins) + 1) + instrumentScroll * w) >> 0,
          w * 0.5,
          w * 0.08,
          a => {
            songs[currentSong][3] = chartSong(cSong, i);
            chartTrack = i;
            startSong();
            sb = 4;
            g('event', 'play_song', {
              song: songs[currentSong][1]
            });
          }, paper, paper);

        ctx.fillStyle = '#000';
        let txt = (i > 0 && cSong.tracks[i - 1].instrument.name == cSong.tracks[i].instrument.name ? (cSong.tracks[i].notes[0].midi < 60 ? 'bass ' : '') : '') + (cSong.tracks.length > 6 ? cSong.tracks[i].instrument.name : cSong.tracks[i].instrument.family);
        ctx.font = `${(txt.length>25?txt.length>33?w*0.02:w*0.03:w*0.04)>>0}px Open Sans`;
        ctx.fillText(' ' + txt,
          (x + w * 0.11) >> 0,
          (y + w * 0.1 * ((i - mins) + 0.96 * (txt.length > 25 ? txt.length > 33 ? 1.5 : 1.55 : 1.6)) + instrumentScroll * w) >> 0);

        if(!songs[currentSong].hasOwnProperty('hashes')) {
          songs[currentSong].hashes = {};
        }

        if(!songs[currentSong].hashes.hasOwnProperty(i)) {
          songs[currentSong].hashes[i] = CryptoJS.SHA1(
            JSON.stringify(songs[currentSong][2].tracks[i].notes)
          ).toString(CryptoJS.enc.Base64);
        }

        if(highScores.hasOwnProperty(songs[currentSong].hashes[i])) {
          if(!highScores[songs[currentSong].hashes[i]].hasOwnProperty(`${frets},${maxNotes}`)) {
            continue;
          }
          drawStars(i - mins, highScores[songs[currentSong].hashes[i]][`${frets},${maxNotes}`], x, y, w, h, instrumentScroll);
        }
      }
    }


    if(mouseX < x + w * 0.1) {

    } else if(mouseY - y < 0.2 * h) {
      instrumentScroll += (0.2 - (mouseY - y) / h) / 16;
    } else if(mouseY - y > 0.8 * h) {
      instrumentScroll -= ((mouseY - y) / h - 0.8) / 16;
    }
    if(instrumentScroll > 0.02) {
      instrumentScroll = 0.02;
    }
    if(instrumentScroll < 0.5 - (cSong.tracks.length - mins + 0.5) * 0.1) {
      instrumentScroll = 0.5 - (cSong.tracks.length - mins + 0.5) * 0.1;
    }
    if(cSong.tracks.length - mins < 5) {
      instrumentScroll = 0.02;
    }
  } else {
    ctx.drawImage(background, x, y, w, h);
  }


  ctx.fillStyle = colors[0];
  ctx.fillRect(0, y + h, w, h);
  ctx.drawImage(overlay, x, y, w, h);


  ctx.font = `${(w*0.025)>>0}px Open Sans`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText(songs[currentSong][1], x + w * 0.8, y + h * 0.25);
  ctx.textAlign = 'left';

  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 2, backImg, backImgb);
}

function s3() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawChartSettings);
}
