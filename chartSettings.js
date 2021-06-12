function drawChartSettings(x, y, w, h) {
  ctx.drawImage(background, x, y, w, h);

  button(
    x + h * 0.05,
    y + h * 0.05,
    w * 0.2, h * 0.1,
    a => sb = 2, uwu2, uwu2b);
}

function s3() {
  callWithinAR(0, 0, w, h, 1920 / 1080, drawChartSettings);
}
