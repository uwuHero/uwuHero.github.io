function drawMenu(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  button(x + w * 0.05, y + h * 0.3, w * 0.3, h * 0.15, a => sb = 2, playImg, playImgb)
  button(x + w * 0.05, y + h * 0.5, w * 0.3, h * 0.15, a => sb = 1, settingsImg, settingsImgb)

  if(window.innerHeight == screen.height) {
    button(x + 0.89 * w, y + h - 0.11 * w, 0.1 * w, 0.1 * w, () => {
      document.exitFullscreen()
    }, exitFullscreen, exitFullscreenb);
  } else {
    button(x + 0.89 * w, y + h - 0.11 * w, 0.1 * w, 0.1 * w, () => {
      document.body.requestFullscreen()
    }, fullscreen, fullscreenb);
  }
}

function s0() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawMenu);
}
