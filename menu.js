function drawMenu(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  button(x + w * 0.05, y + h * 0.3, w * 0.3, h * 0.15, a => sb = 2, playImg, playImgb)
  button(x + w * 0.05, y + h * 0.5, w * 0.3, h * 0.15, a => sb = 1, settingsImg, settingsImgb)
}

function s0() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawMenu);
}
