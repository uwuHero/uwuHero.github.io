let currentTime = -2;

function drawNoteTopDown(n, t, x, y, w, h) {
  //currentSong

}

function drawPlayChart(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  ctx.fillStyle('#000');
  ctx.fillRect(x,y,w,h);
}

function s4() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawPlayChart);
}
