function drawSettings(x, y, w, h){
  ctx.drawImage(background,x,y,w,h);
  button(x+w*0.05, y+h*0.2, w*0.3, h*0.15, a=>sb=0, uwu2, uwu2b)
}

function s1(){
  callWithinAR(0, 0, w, h, 1920/1080, drawSettings);
}
