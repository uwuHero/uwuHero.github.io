function findInGroups(note) {
  for(let i = 0; i < groups.length; i++) {
    for(let j = 0; j < groups[i].length; j++) {
      if(groups[i][j] === note) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

function mergable(a, b) {
  let distinct = [];
  for(let i = 0; i < a.length; i++) {
    if(distinct.indexOf(unChartedNotes[a[i]][1]) < 0) {
      distinct.push(unChartedNotes[a[i]][1]);
    }
  }
  for(let i = 0; i < b.length; i++) {
    if(distinct.indexOf(unChartedNotes[b[i]][1]) < 0) {
      distinct.push(unChartedNotes[b[i]][1]);
    }
  }
  if(distinct.length > frets) {
    return false;
  }
  return true;
}

function getTempo(t, currentMidi) {
  let temp = 240;
  for(let i = 0; i < currentMidi.header.tempos.length; i++) {
    if(currentMidi.header.tempos[i].time <= t) {
      temp = currentMidi.header.tempos[i].bpm;
    } else {
      i = Infinity;
    }
  }
  return temp;
}

function chartSong(currentMidi, track) {
  let chart = {
    chart: [],
    ppq: currentMidi.header.ppq,
    speed: ((4 / 60) * currentMidi.header.ppq) >> 0,
    time: -0.1,
    leadingSeconds: 2,
  };

  for(let i = currentMidi.tracks.length - 1; i >= 0; i--) {
    // check if the instrument is empty
    if(currentMidi.tracks[track].notes.length == 0 ||
      currentMidi.tracks[track].instrument.percussion) {
      currentMidi.tracks.splice(i, 1);
    }
  }

  let distinctNotes = [];
  let songLength = 0;
  for(let note = 0; note < currentMidi.tracks[track].notes.length; note++) {
    let midValue = currentMidi.tracks[track].notes[note].hasOwnProperty('altmidi') ? currentMidi.tracks[track].notes[note].altmidi : currentMidi.tracks[track].notes[note].midi;
    if(distinctNotes.indexOf(midValue) < 0) {
      distinctNotes.push(midValue);
    }
    if(currentMidi.tracks[track].notes[note].ticks > songLength) {
      songLength = currentMidi.tracks[track].notes[note].ticks;
    }
  }
  distinctNotes.sort((a, b) => a - b);

  unChartedNotes = [];
  for(let note = 0; note < currentMidi.tracks[track].notes.length; note++) {
    unChartedNotes.push([
      currentMidi.tracks[track].notes[note].ticks, //0
      distinctNotes.indexOf(currentMidi.tracks[track].notes[note].hasOwnProperty('altmidi') ? currentMidi.tracks[track].notes[note].altmidi : currentMidi.tracks[track].notes[note].midi), //1
      currentMidi.tracks[track].notes[note].durationTicks / chart.ppq <= minimumSustain ? 0 : currentMidi.tracks[track].notes[note].durationTicks, //2
      currentMidi.tracks[track].notes[note].time, //3
      currentMidi.tracks[track].notes[note].name, //4
      currentMidi.tracks[track].notes[note].velocity, //5
      currentMidi.tracks[track].notes[note].duration, //6
      currentMidi.tracks[track].notes[note].durationTicks, //7
      currentMidi.tracks[track].notes[note].midi, //8
      0, //9
      note //10
    ]);
    if(currentMidi.tracks[track].notes[note].ticks > songLength) {
      songLength = currentMidi.tracks[track].notes[note].ticks;
    }
  }

  unChartedNotes.sort((a, b) => a[0] + a[8] / 128 - b[0] - b[8] / 128);
  for(let i = 1; i < unChartedNotes.length; i++) {
    if(unChartedNotes[i - 1][0] == unChartedNotes[i][0] && unChartedNotes[i - 1][8] == unChartedNotes[i][8]) {
      unChartedNotes[i - 1][2] = max(unChartedNotes[i - 1][2], unChartedNotes[i][2]);
      unChartedNotes[i - 1][5] = max(unChartedNotes[i - 1][5], unChartedNotes[i][5]);
      unChartedNotes[i - 1][6] = max(unChartedNotes[i - 1][6], unChartedNotes[i][6]);
      unChartedNotes[i - 1][7] = max(unChartedNotes[i - 1][7], unChartedNotes[i][7]);
      unChartedNotes.splice(i, 1);
      i--;
    }
  }
  if(maxBPS > 0) {
    for(let i = 1; i < unChartedNotes.length; i++) {
      if(unChartedNotes[i][3] - unChartedNotes[i - 1][3] > 0 && unChartedNotes[i][3] - unChartedNotes[i - 1][3] < 1 / maxBPS) {
        unChartedNotes.splice(i, 1);
        i--;
      }
    }
  }
  chartedNotes = [];

  for(let i = 0; i < unChartedNotes.length - 1; i++) {
    if(unChartedNotes[i][0] == unChartedNotes[i + 1][0] && unChartedNotes[i][1] == unChartedNotes[i + 1][1]) {
      if(unChartedNotes[i][1] < unChartedNotes[i + 1][1]) {
        unChartedNotes.splice(i, 1);
      } else {
        unChartedNotes.splice(i + 1, 1);
      }
      i--;
    }
  }

  for(let i = 0; i < unChartedNotes.length - 1; i++) {
    let notes = [
      [i, unChartedNotes[i][1]]
    ];
    while(i < unChartedNotes.length - 1 && unChartedNotes[i][0] == unChartedNotes[i + 1][0]) {
      i++;
      notes.push([i, unChartedNotes[i][1]]);
    }
    if(notes.length > maxNotes) {
      notes.sort((a, b) => b[1] - a[1]);
      for(let j = 0; j < maxNotes; j++) {
        notes.splice(0, 1);
      }
      notes.sort((a, b) => b[0] - a[0]);
      for(let j = 0; j < notes.length; j++) {
        unChartedNotes.splice(notes[j][0], 1);
        if(notes[j][0] <= i) {
          i--;
        }
      }
    }
  }

  /*-- Start Import --*/

  let gaps = [];
  for(let i = 1; i < unChartedNotes.length; i++) {
    gaps.push([i, unChartedNotes[i][0] - unChartedNotes[i - 1][0]]);
  }

  gaps.sort((a, b) => a[1] - b[1]);

  groups = [];

  for(let i = 0; i < gaps.length; i++) {
    let index = gaps[i][0];
    let group1 = findInGroups(index - 1)[0];
    let group2 = findInGroups(index)[0];
    if(group2 >= 0) {
      if(group1 >= 0) {
        if(mergable(groups[group1], groups[group2], frets)) {
          groups[group1] = groups[group1].concat(groups[group2]);
          groups.splice(group2, 1);
        }
      } else {
        if(mergable(groups[group2], [index - 1])) {
          groups[group2].push(index - 1);
        } else {
          groups[groups.length] = [index - 1];
        }
      }
    } else if(group1 >= 0) {
      if(mergable(groups[group1], [index])) {
        groups[group1].push(index);
      } else {
        groups[groups.length] = [index];
      }
    } else {
      groups[groups.length] = [index - 1, index];
    }
  }

  distinct = [];

  for(let g = 0; g < groups.length; g++) {
    distinct.push([]);
    for(let i = 0; i < groups[g].length; i++) {
      if(distinct[g].indexOf(unChartedNotes[groups[g][i]][1]) < 0) {
        distinct[g].push(unChartedNotes[groups[g][i]][1]);
      }
    }
  }

  /*if less than frets note range group, shift*/
  for(let g = 0; g < groups.length; g++) {
    let d = 0;
    let gd = 1;
    while(distinct[g].length < frets) {
      if(g - gd > 0 && d < groups[g - gd].length) {
        if(distinct[g].indexOf(unChartedNotes[groups[g - gd][groups[g - gd].length - 1 - d]][1]) < 0) {
          distinct[g].push(unChartedNotes[groups[g - gd][groups[g - gd].length - 1 - d]][1]);
        }
      }

      if(g + gd < groups.length - 1 && distinct[g].length < frets) {
        if(d < groups[g + gd].length) {
          if(distinct[g].indexOf(unChartedNotes[groups[g + gd][d]][1]) < 0) {
            distinct[g].push(unChartedNotes[groups[g + gd][d]][1]);
          }
        }
      }
      d++;
      if((g - gd < 0 || d >= groups[g - gd].length) && (g + gd >= groups.length - 2 || d >= groups[g + gd].length)) {
        gd++;
        d = 0;
      }
      if(g - gd < 0 && g + gd >= groups.length) {
        distinct[g].push(Infinity);
      }
    }
    distinct[g].sort((a, b) => a - b);
  }

  for(let i = 0; i < unChartedNotes.length; i++) {
    //chartedNotes.push(unChartedNotes[i][1]%5);
    let group = findInGroups(i);
    try {
      chartedNotes.push(distinct[group[0]].indexOf(unChartedNotes[groups[group[0]][group[1]]][1]));
    } catch (e) {
      console.log(e);
      console.log(i);
      console.log(group);
    }
  }

  /*-- End Import --*/

  for(let i = 0; i < groups.length; i++) {
    groups[i].sort((a, b) => a - b);
  }

  let lastTick = 0;
  for(let i = 0; i < chartedNotes.length; i++) {
    let duration = unChartedNotes[i][2];
    if(duration > 0) {
      let strip = false;
      let cTempo = getTempo(unChartedNotes[i][3] + unChartedNotes[i][6], currentMidi) / 60;
      stripAmount = 1;

      if(cTempo >= 16) {
        stripAmount = 1;
      } else if(cTempo >= 8) {
        stripAmount = 1 / 2;
      } else if(cTempo >= 5) {
        stripAmount = 1 / 4;
      } else if(cTempo >= 3) {
        stripAmount = 1 / 8;
      } else if(cTempo >= 2.5) {
        stripAmount = 1 / 12;
      } else if(cTempo >= 1.8) {
        stripAmount = 1 / 16;
      } else if(cTempo >= 0.8) {
        stripAmount = 1 / 32;
      } else if(cTempo >= 0.4) {
        stripAmount = 1 / 64;
      } else if(cTempo >= 0.2) {
        stripAmount = 1 / 128;
      } else if(cTempo >= 0.1) {
        stripAmount = 1 / 256;
      }

      stripAmount *= stripSustain;
      for(let j = 0; j < chartedNotes.length; j++) {
        if(unChartedNotes[i][0] != unChartedNotes[j][0] && unChartedNotes[j][0] - unChartedNotes[i][0] > 0 && unChartedNotes[i][0] + duration + stripAmount * chart.ppq * cTempo >= unChartedNotes[j][0]) {
          if(!extendedSustains || chartedNotes[i] == chartedNotes[j] || Math.abs(unChartedNotes[i][0] + duration - unChartedNotes[j][0]) < noteTolerance) {
            duration = unChartedNotes[j][0] - unChartedNotes[i][0];
            strip = true;
            j = chartedNotes.length;
          }
        }
      }
      if(strip) {
        duration -= stripAmount * chart.ppq * cTempo;
      }
      if(duration < minimumSustain * chart.ppq * cTempo) {
        duration = 0;
      }
      unChartedNotes[i][2] = duration;
    }
    chart.chart.push([unChartedNotes[i][0], chartedNotes[i], duration]);
  }
  return chart;
}
