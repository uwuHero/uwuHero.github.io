function parseMidi(file) {
  //read the file
  const reader = new FileReader()
  reader.onload = function(e) {
    const midi = new Midi(e.target.result);
    currentMidi = midi.toJSON();
    currentMidi.duration = midi.duration;
    currentMidi.durationTicks = midi.durationTicks;
    currentMidi.name = midi.name;
    for(let temp in currentMidi.header.tempos) {
      currentMidi.header.tempos[temp].time = midi.header.tempos[temp].time;
    }
    for(let track in currentMidi.tracks) {
      currentMidi.tracks[track].instrument.percussion = midi.tracks[track].instrument.percussion;
    }
    //loadHTMLcontent();
  }
  reader.readAsArrayBuffer(file)
}

async function loadMidi(index) {
  const midi = await Midi.fromUrl(songs[index][0]);
  currentMidi = midi.toJSON();
  currentMidi.duration = midi.duration;
  currentMidi.durationTicks = midi.durationTicks;
  currentMidi.name = midi.name;
  for(let temp in currentMidi.header.tempos) {
    currentMidi.header.tempos[temp].time = midi.header.tempos[temp].time;
  }
  for(let track in currentMidi.tracks) {
    currentMidi.tracks[track].instrument.percussion = midi.tracks[track].instrument.percussion;
  }
  //loadHTMLcontent();
}
