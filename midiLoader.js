function parseMidi(file) {
  //read the file
  const reader = new FileReader()
  reader.onload = function(e) {
    songs.push([]);
    index = songs.length-1;
    const midi = new Midi(e.target.result);
    songs[index][2] = midi.toJSON();
    songs[index][2].duration = midi.duration;
    songs[index][2].durationTicks = midi.durationTicks;
    songs[index][2].name = midi.name;
    songs[index][1] = midi.target.fileName;
    for(let temp in songs[index][2].header.tempos) {
      songs[index][2].header.tempos[temp].time = midi.header.tempos[temp].time;
    }
    for(let track in songs[index][2].tracks) {
      songs[index][2].tracks[track].instrument.percussion = midi.tracks[track].instrument.percussion;
    }
    //loadHTMLcontent();
  }
  reader.readAsArrayBuffer(file)
}

async function loadMidi(index) {
  const midi = await Midi.fromUrl(songs[index][0]);
  songs[index][2] = midi.toJSON();
  songs[index][2].duration = midi.duration;
  songs[index][2].durationTicks = midi.durationTicks;
  songs[index][2].name = midi.name;
  for(let temp in songs[index][2].header.tempos) {
    songs[index][2].header.tempos[temp].time = midi.header.tempos[temp].time;
  }
  for(let track in songs[index][2].tracks) {
    songs[index][2].tracks[track].instrument.percussion = midi.tracks[track].instrument.percussion;
  }
  //loadHTMLcontent();
}
