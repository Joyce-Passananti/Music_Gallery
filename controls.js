  var ctime = new Tone.Context();
  var synth = new Tone.PolySynth({
    volume: -25, 
    oscillator: {
      type: 'sine', 
    },
    envelope: {
      attack: 0.15, 
      release: 1 
    }
  }).toMaster();
  var song = [];   

  function randomSong() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const fft = new AnalyserNode(ctx, { fftSize: 2048 })
    createWaveCanvas({ element: 'section', analyser: fft })

    function tone (type, pitch, time, duration) {
      const t = time || ctx.currentTime
      const dur = duration || 1
      const osc = new OscillatorNode(ctx, { 
        type: type || 'sine',
        frequency: pitch || 440
      })
      const lvl = new GainNode(ctx, { gain: 0.001})

      osc.connect(lvl)
      lvl.connect(ctx.destination)
      lvl.connect(fft)
      osc.start(t)
      osc.stop(t+dur)
      asdr({ 
        param: lvl.gain, 
        peak: 0.7,
        hold: 0.5,
        time: t, 
        duration: dur
      })
    }
    function asdr (opts) {
      const param = opts.param
      const peak = opts.peak || 1
      const hold = opts.hold || 0.7
      const time = opts.time || ctx.currentTime
      const dur = opts.duration || 1
      const a = opts.attack || dur * 0.2
      const d = opts.sustain || dur * 0.1
      const s = opts.sustain || dur * 0.5
      const r = opts.release || dur * 0.2

      const initVal = param.value
      param.setValueAtTime(peak, time+a)
      param.linearRampToValueAtTime(hold, time+a+d)
      param.linearRampToValueAtTime(hold, time+a+d+s)
      param.linearRampToValueAtTime(initVal, time+a+d+s+r)
    }
    function step (rootFreq, steps) {
      let tr2 = Math.pow(2, 1 / 12)
      let rnd = rootFreq * Math.pow(tr2, steps)
      return (Math.round(rnd * 100) / 100)
    }
    function r (scale) {
      return Math.floor(Math.random() * scale.length)
    }
    const major = [0, 2, 4, 5, 7, 9, 11, 12]
    const minor = [0, 2, 3, 5, 7, 8, 10, 12]

    // tone('sine')
    const delayStart = 1
    const tempo = 140 * 2
    const beat = 60 / tempo
    const bar = beat * 4
    const root = 440
    const scale = major
    const ognotes = [11,9, r(scale), 2, 4, 5, 7, r(scale),]
    const notes = ognotes

    var delayA = 0;
    var delayB = 0;

    for (let i=0; i< 4; i ++) {
      delayB = i * bar * 4
      notes[0] = r(scale)
      notes[1] = r(scale)
      notes[2] = r(scale)
      notes[6] = r(scale)
      notes[7] = r(scale)
      for (let j = 0; j < 4; j++) {
        delayA = j*bar
        for(let k=0; k < notes.length; k++) {
          var time = k * beat + delayStart + delayA + delayB 
          if(i/2 === 0 && k%2 === 0) {
            var dur = beat*4
            var pitch = step(root, ognotes[k])
          }
          else {
            var pitch = step(root, notes[k])
            var dur = beat*2
          }
          tone('sine', pitch, time, dur)
        }
      }
    }
    for(let h=0; h < notes.length; h++) {
      var time = notes.length*beat + delayStart + delayA + delayB + h*beat*1.5
      var dur = beat * 4
      var pitch = step(root, ognotes[h])
      tone('sine', pitch, time, dur)
    }
  }
  
  
  AFRAME.registerComponent("song-interact", {
    init: function () {
      var data = this.data;
      var songEl = this.el;
      console.log(songEl);
  
      songEl.addEventListener("mouseenter", function () {
        songEl.setAttribute("color", "#5F9EA0");
      });
  
      songEl.addEventListener("mouseleave", function () {
        songEl.setAttribute("color", "teal");
      });
  
      songEl.addEventListener("click", function () {
        var sceneEl = document.querySelector("a-scene");
        var entityEl = sceneEl.querySelector("#menu0");
        sceneEl.removeChild(entityEl);
        var entityE2 = sceneEl.querySelector("#menu1");
        sceneEl.removeChild(entityE2);
        var entityE3 = sceneEl.querySelector("#menu2");
        sceneEl.removeChild(entityE3);

        sceneEl.querySelector("#bg").setAttribute("src", data.track);   
        sceneEl.querySelector("#bg").object3D.visible = "true";  

        sceneEl.querySelector("#p1").setAttribute("src", data.track1);   
        sceneEl.querySelector("#p1").object3D.visible = "true";  
        sceneEl.querySelector("#p2").setAttribute("src", data.track2);   
        sceneEl.querySelector("#p2").object3D.visible = "true";
        sceneEl.querySelector("#p3").setAttribute("src", data.track3);   
        sceneEl.querySelector("#p3").object3D.visible = "true";  
        sceneEl.querySelector("#p4").setAttribute("src", data.track4);   
        sceneEl.querySelector("#p4").object3D.visible = "true";
        sceneEl.querySelector("#p5").setAttribute("src", data.track5);   
        sceneEl.querySelector("#p5").object3D.visible = "true";        

        sceneEl.querySelector("#model").object3D.visible = "true";

        sceneEl.querySelector("#play").setAttribute("src", data.tracksound);
        sceneEl.querySelector("#play").setAttribute("autoplay", true);
        console.log(data.tracksound);

      });
    }
  });

  AFRAME.registerComponent("random-interact", {
    init: function () {
      var data = this.data;
      var songEl = this.el;
  
      songEl.addEventListener("mouseenter", function () {
        songEl.setAttribute("color", "#5F9EA0");
      });
  
      songEl.addEventListener("mouseleave", function () {
        songEl.setAttribute("color", "teal");
      });
  
      songEl.addEventListener("click", function () {
        var sceneEl = document.querySelector("a-scene");
        var entityEl = sceneEl.querySelector("#menu0");
        sceneEl.removeChild(entityEl);
        var entityEl = sceneEl.querySelector("#menu1");
        sceneEl.removeChild(entityEl);
        var entityEl = sceneEl.querySelector("#menu2");
        sceneEl.removeChild(entityEl);
        var entityEl = sceneEl.querySelector("#sky");
        sceneEl.removeChild(entityEl);

        // sceneEl.querySelector("#random").object3D.visible = "true";
        randomSong();   

      });
    }
  });

  AFRAME.registerComponent("piano-interact", {
    init: function () {
      var data = this.data;
      var songEl = this.el;
  
      songEl.addEventListener("mouseenter", function () {
        songEl.setAttribute("color", "#5F9EA0");
      });
  
      songEl.addEventListener("mouseleave", function () {
        songEl.setAttribute("color", "teal");
      });
  
      songEl.addEventListener("click", function () {
        var sceneEl = document.querySelector("a-scene");
        var entityEl = sceneEl.querySelector("#menu0");
        sceneEl.removeChild(entityEl);
        var entityEl = sceneEl.querySelector("#menu1");
        sceneEl.removeChild(entityEl);
        var entityEl = sceneEl.querySelector("#menu2");
        sceneEl.removeChild(entityEl);
        
        sceneEl.querySelector("#Pianomodel").object3D.visible = "true";
        sceneEl.querySelector("#Pianomodel").setAttribute('position', '0 0 0');
        sceneEl.querySelector("#PlaySong").object3D.visible = "true";
        sceneEl.querySelector("#CreateSong").object3D.visible = "true";
      });
    }
  });

  AFRAME.registerComponent("create-interact", {
    init: function () {
      this.el.addEventListener('click', function (){
        song = [];
        var sceneEl = document.querySelector("a-scene");
        sceneEl.querySelector("#instructions").object3D.visible = "true";
      });
    }
  });
  
  AFRAME.registerComponent("play-interact", {
      init: function () {
        this.el.addEventListener('click', function (){
          for (var i = 0; i < song.length; i++) {        
            synth.triggerAttackRelease(song[i], 0.5, ctime.now() + i/2);  
          }
        });
      }
    });

  AFRAME.registerComponent('synth', {  
    init: function () {
      this.el.addEventListener('mouseenter', this.trigger.bind(this));
      this.el.addEventListener('mouseleave', this.leave.bind(this));
      this.el.addEventListener('click', this.addNote.bind(this));
    },
  
    trigger: function () {
      var key = this.el;
      key.setAttribute('visible','true');
      synth.triggerAttackRelease(this.data.note, 0.5);

    },

    leave: function () {
      var key = this.el;
      key.setAttribute('visible','false');
      key.setAttribute('opacity','.35');

    },

    addNote: function () {
      var key = this.el;
      key.setAttribute('opacity','1');
      song.push(this.data.note);
      console.log(song);
    },
  });
  