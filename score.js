const scoreThresholds = [
  60, 63, 67,
  70, 73, 77,
  80, 83, 87,
  90, 93, 97,
  100,
  101
];

function drawScore(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);

  let myScore = 0;
  let per = notesHit / totalNotes * 100;

  while(per >= scoreThresholds[myScore]) {
    myScore++;
  }

  ctx.drawImage(scoreImgs[myScore], x + w / 8 * 5, y + h * 0.25, h / 2, h / 2);
  if(FC) {
    ctx.drawImage(fullComboImg, x + w / 8 * 5, y + h * 0.25, h / 2, h / 2);
  }

  ctx.font = `${(w*0.04)>>0}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText(songs[currentSong][1], x + w / 2, y + h * 0.25);

  ctx.font = `${(w*0.02)>>0}px sans-serif`;
  ctx.fillText(`${notesHit}/${totalNotes} notes hit`, x + w / 4, y + h * 0.6);
  ctx.fillText(`Best streak: ${bestStreak}`, x + w / 4, y + h * 0.65);
  ctx.fillText(`Lanes: ${frets} | Chord: ${maxNotes}`, x + w / 4, y + h * 0.7);
  ctx.font = `${(w*0.08)>>0}px sans-serif`;
  ctx.fillText((per + '').slice(0, 6) + '%', x + w / 4, y + h / 2);

  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 2, backImg, backImgb);
}

function s5() {
  callWithinAR(0, 0, w, h, 16 / 9, drawScore);
}
