let trackScroll = 0;

function drawTrackList(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  button(x + h * 0.05, y + h * 0.05, w * 0.2, h * 0.1, a => sb = 0, uwu2, uwu2b);
  for(let i = 0; i < songs.length; i++) {
    ctx.drawImage(uwu,
      x + w * 0.1,
      y + w * 0.1 * (i + 1) + trackScroll,
      w * 0.5,
      w * 0.08);
  }
}

function s2() {
  //console.log(mouseY);
  if(mouseY < 0.2 * h) {
      trackScroll += (0.2 * h - mouseY)/4;
  }
  if(mouseY > 0.8 * h) {
      trackScroll -= (mouseY - h * 0.8)/4;
  }
  if(trackScroll > 0) {
    trackScroll = 0;
  }
  if(trackScroll < -(1 + songs.length) * w * 0.1 + h) {
    trackScroll = -(1 + songs.length) * w * 0.1 + h;
  }
  callWithinAR(0, 0, w, h, 1920 / 1080, drawTrackList);
}
