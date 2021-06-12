let trackScroll = 0;

function drawTrackList(x, y, w, h) {
  if(mouseX < x + w * 0.1) {

  }
  if(mouseY - y < 0.2 * h) {
    trackScroll += (0.2 - (mouseY - y) / h) / 8;
  }
  if(mouseY - y > 0.8 * h) {
    trackScroll -= ((mouseY - y) / h - 0.8) / 8;
  }
  if(trackScroll > 0) {
    trackScroll = 0;
  }
  if(trackScroll < -(songs.length - 0.5) * 0.1) {
    trackScroll = -(songs.length - 0.5) * 0.1;
  }

  ctx.drawImage(background, x, y, w, h);
  for(let i = 0; i < songs.length; i++) {
    if(y + w * 0.1 * (i + 1) + trackScroll * h < y ||
      y + w * 0.1 * (i + 1) + trackScroll * h > y + h) {
      continue;
    }
    button(
      x + w * 0.1,
      y + w * 0.1 * (i + 1) + trackScroll * h,
      w * 0.5,
      w * 0.08,
      a => {
        currentSong = i;
        sb = 3
      }, uwu2, uwu2b);
  }
  ctx.fillRect(0, y + h, w, h);
  ctx.drawImage(overlay, x, y, w, h);
  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 0, uwu2, uwu2b);
}

function s2() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawTrackList);
}
