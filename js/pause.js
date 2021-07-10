function drawPauseChart(x, y, w, h) {

  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 2, backImg, backImgb);

    button(
      x + w * 0.05,
      y + h * 0.3,
      w * 0.3,
      h * 0.15,
      a => {
        sb = 4;
        startTime = Date.now() - currentTime + 1e3;
      }, playImg, playImgb)
}

function s6() {
  callWithinAR(0, 0, w, h, 16 / 9, drawPauseChart);
}
