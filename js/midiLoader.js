if(!(window.File && window.FileReader && window.FileList && window.Blob)) {
  document.querySelector("#FileDrop #Text").textContent = "Reading files not supported by this browser";
} else {
  const fileDrop = document.querySelector("#FileDrop")
  fileDrop.addEventListener("dragenter", () => fileDrop.classList.add("Hover"))
  fileDrop.addEventListener("dragleave", () => fileDrop.classList.remove("Hover"))
  fileDrop.addEventListener("drop", () => fileDrop.classList.remove("Hover"))
  document.querySelector("#FileDrop input").addEventListener("change", e => {
    //get the files
    const files = e.target.files;
    if(files.length > 0) {
      const file = files[0];
      g('event', 'load_song', {
        file: file.name
      });
      parseMidi(file, file.name.replace(/\..+/,'').replace(/_/g,' '));
    }
  })
}

var md;

function parseMidi(file, name) {
  //read the file
  const reader = new FileReader()
  reader.onload = function(e) {
    songs.unshift([]);
    index = 0;
    const midi = new Midi(e.target.result);
    songs[index][1] = name;
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

    currentSong = 0;
    sb = 3;
  }
  reader.readAsArrayBuffer(file)
}

async function loadMidi(index, track) {
  if(!songs[index][2]) {
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

    for(let i = songs[index][2].tracks.length - 1; i >= 0; i--) {
      if(songs[index][2].tracks[i].notes.length === 0) {
        songs[index][2].tracks.splice(i, 1);
      }
    }
  }
}
