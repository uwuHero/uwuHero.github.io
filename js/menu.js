function drawMenu(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);
  button(x + w * 0.05, y + h * 0.3, w * 0.3, h * 0.15, a => {
    sb = 2;
    g('event', 'play')
  }, playImg, playImgb)
  button(x + w * 0.05, y + h * 0.5, w * 0.3, h * 0.15, a => {
    sb = 1;
    g('event', 'settings')
  }, settingsImg, settingsImgb)

  if(window.innerHeight == screen.height) {
    button(x + 0.89 * w, y + h - 0.11 * w, 0.1 * w, 0.1 * w, () => {
      try {
        document.exitFullscreen()
      } catch (e) {}
    }, exitFullscreen, exitFullscreenb);
  } else {
    button(x + 0.89 * w, y + h - 0.11 * w, 0.1 * w, 0.1 * w, () => {
      document.body.requestFullscreen()
    }, fullscreen, fullscreenb);
  }

  ctx.fillStyle = '#fff';
  ctx.font = `${(h*0.05)>>0}px Open Sans`;
  ctx.fillText(`v ${version}`, x + h * 0.025, y + h * 0.975);
}

function s0() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawMenu);
}
