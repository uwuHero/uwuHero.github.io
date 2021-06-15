let AudioContextFunc = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContextFunc();
let player = new WebAudioFontPlayer();
player.loader.decodeAfterLoading(audioContext, '_tone_0010_GeneralUserGS_sf2_file');
player.loader.decodeAfterLoading(audioContext, '_tone_0270_Aspirin_sf2_file');

function playSound(pitch, duration, vol, family, name) {
  if(songs[currentSong].hasOwnProperty('add')){
    vol += songs[currentSong].add;
  }
  vol *= volume/50;
  if(songs[currentSong].hasOwnProperty('volume')){
    vol *= songs[currentSong].volume;
  }
  switch (family) {
    case 'synth lead':
      player.queueWaveTable(audioContext, audioContext.destination, _tone_0800_Aspirin_sf2_file, 0, pitch, duration, vol);
      break;
    case 'bass':
    case 'guitar':
      player.queueWaveTable(audioContext, audioContext.destination, _tone_0270_Aspirin_sf2_file, 0, pitch, duration < 0.18 ? 0.18 : duration, vol);
      break;
    case 'ensemble':
      player.queueWaveTable(audioContext, audioContext.destination, _tone_0481_GeneralUserGS_sf2_file, 0, pitch, duration < 0.18 ? 0.18 : duration, vol);
      break;
    case 'drums':
      drumSound.volume(vol*2);
      drumSound.play(pitch - 26 + '');
      break;
    default:
      player.queueWaveTable(audioContext, audioContext.destination, _tone_0010_GeneralUserGS_sf2_file, 0, pitch, duration < 0.18 ? 0.18 : duration, vol);
  }
}

let drumSound = new Howl({
  src: ['assets/drums.mp3'],
  sprite: {
    1: [0, 1000],
    2: [1000, 1000],
    3: [2000, 1000],
    4: [3000, 1000],
    5: [4000, 1000],
    6: [5000, 1000],
    7: [6000, 1000],
    8: [7000, 1000],
    9: [8000, 1000],
    10: [9000, 1000],
    11: [10000, 1000],
    12: [11000, 1000],
    13: [12000, 1000],
    14: [13000, 1000],
    15: [14000, 1000],
    16: [15000, 1000],
    17: [16000, 1000],
    18: [17000, 1000],
    19: [18000, 1000],
    20: [19000, 4000],
    21: [24000, 1000],
    22: [25000, 1000],
    23: [26000, 6000],
    24: [32000, 1000],
    25: [33000, 3000],
    26: [36000, 4000],
    27: [40000, 4000],
    28: [44000, 2000],
    29: [46000, 4000],
    30: [52000, 1000],
    31: [53000, 7000],
    32: [60000, 3000],
    33: [64000, 4000],
    34: [68000, 1000],
    35: [69000, 1000],
    36: [70000, 1000],
    37: [71000, 1000],
    38: [72000, 1000],
    39: [73000, 1000],
    40: [74000, 1000],
    41: [75000, 1000],
    42: [76000, 1000],
    43: [77000, 1000],
    44: [78000, 1000],
    45: [79000, 1000],
    46: [80000, 1000],
    47: [81000, 1000],
    48: [82000, 1000],
    49: [83000, 1000],
    50: [84000, 1000],
    51: [85000, 1000],
    52: [86000, 1000],
    53: [87000, 1000],
    54: [88000, 1000],
    55: [89000, 1000],
    56: [92000, 1000],
    57: [93000, 3000],
    58: [96000, 4000],
    59: [100000, 1000],
    60: [101000, 1000],
    61: [102000, 1000]
  }
});
