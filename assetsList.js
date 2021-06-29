const background = new Image();
background.src = 'assets/background.png';

const overlay = new Image();
overlay.src = 'assets/overlay.png';

const fullscreen = new Image();
fullscreen.src = 'assets/fullscreen.png';
const fullscreenb = new Image();
fullscreenb.src = 'assets/fullscreenb.png';

const exitFullscreen = new Image();
exitFullscreen.src = 'assets/exitFullscreen.png';
const exitFullscreenb = new Image();
exitFullscreenb.src = 'assets/exitFullscreenb.png';



const listFullCombo = new Image();
listFullCombo.src = 'assets/listFullCombo.png';

const star = new Image();
star.src = 'assets/star.png';

const halfStar = new Image();
halfStar.src = 'assets/half-star.png';

const uwu = new Image();
uwu.src = 'assets/uwu.png';

const uwu2 = new Image();
uwu2.src = 'assets/uwu2.png';
const uwu2b = new Image();
uwu2b.src = 'assets/uwu2.png';

const playImg = new Image();
playImg.src = 'assets/play.png';
const playImgb = new Image();
playImgb.src = 'assets/playb.png';

const settingsImg = new Image();
settingsImg.src = 'assets/settings.png';
const settingsImgb = new Image();
settingsImgb.src = 'assets/settingsb.png';


const backImg = new Image();
backImg.src = 'assets/back.png';
const backImgb = new Image();
backImgb.src = 'assets/backb.png';

const minus = new Image();
minus.src = 'assets/minus.png';

const plus = new Image();
plus.src = 'assets/plus.png';

const paper = new Image();
paper.src = 'assets/paper.png';


const fullComboImg = new Image();
fullComboImg.src = 'assets/fullCombo.png';

const scoreImgs = [];

const scoreNames = ['F','D-','D','D+','C-','C','C+','B-','B','B+','A-','A','A+','S'];

for(let i=0;i<14;i++){
  scoreImgs.push(new Image());
  scoreImgs[i].src = `assets/${scoreNames[i]}score.png`;
}
