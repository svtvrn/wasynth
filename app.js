//Creates the audio context and the starting wave type
var context = new (window.AudioContext || window.webkitAudioContext)();
var wave='sine'
sine.style.color ='rgb(24, 255, 101)';
sine.style.backgroundColor = 'rgb(32, 10, 46)';

//Master gain node
var amp = context.createGain();
amp.gain.value=0.5;
gainval.innerHTML = (amp.gain.value*100).toFixed(0)+"%";

//Distortion filter
var distortion = initDistortion(context);

//Bass and Treble filters, gain aka boost changed by user.
var filters = context.createBiquadFilter();
filters.type = "peaking";
filters.frequency.value = 10370;
filters.Q.value = 10000;
filters.gain.value = 20;

var lowshelf = context.createBiquadFilter();
lowshelf.type = "lowshelf";
lowshelf.frequency.value = 330;
lowshelf.gain.value = 0;

var highshelf = context.createBiquadFilter();
highshelf.type = "highshelf";
highshelf.frequency.value = 410;
highshelf.gain.value = 0;

//ADSR variables used to apply the effect
var envelopeGain = context.createGain();
var attack = decay = release = 0.5;
var sustain = 0.5, envelopeMode = 1;
lowenv.style.color='rgb(24, 255, 101)';
lowenv.style.backgroundColor = '#830044';

var tremolo = context.createOscillator();
tremolo.frequency.value = 10;
tremolo.type = wave;
tremolo.connect(amp.gain);
tremolo.start();

filters.connect(lowshelf);
lowshelf.connect(highshelf);
highshelf.connect(envelopeGain);
envelopeGain.connect(distortion);
distortion.connect(amp);
amp.connect(context.destination);
connectScope(context,amp);

//Assigns the "keys" elements from the HTML file
var keys = document.querySelector("#keys");
keys.addEventListener("mousedown",playNote);

//Assigns the "wave button" elements from the HTML file
var waves = document.querySelector("#waves");
waves.addEventListener("click",changeWave);

var envModeButtons = document.querySelector("#envmode");
envModeButtons.addEventListener("click",changeEnvelopeMode);

//Creates the note for the respective key, C4 to C5 and applies the filters (bass,mid,treb,compression)
function createNote(hertz){
    var note = context.createOscillator();
    note.type=wave;
    note.frequency.setValueAtTime(hertz,context.currentTime);
    return note;
}

//Playes the note created in createNote(), applies ADSR accordingly
function playNote(e){
    if(e.target!==e.currentTarget){
        var hertz = parseFloat(e.target.id);
    }
    var note = createNote(hertz);
    note.connect(filters);
    note.start();
    envelopeOn(envelopeGain.gain,attack,decay,sustain);
    keys.addEventListener("mouseup",function(){
        envelopeOff(envelopeGain.gain,release,note);
    });
}

//Changes gain when the slider value is changed
function changeGain(e){
    document.getElementById('volume').addEventListener('input', function() {
        amp.gain.value=volume.value;
        gainval.innerHTML = (amp.gain.value*100).toFixed(0)+"%";
        if(amp.gain.value<0.01){
            tremolo.disconnect();
        }else{
            if(tremolo.disconnect()==undefined){
                tremolo.connect(amp.gain);
            }
        }
    });
}

function changeBass(e){
    document.getElementById('bass').addEventListener("input",function(){
        lowshelf.gain.value = bass.value;
    });
}

function changeTreble(e){
    document.getElementById('treble').addEventListener("input",function(){
        highshelf.gain.value = treble.value;
    });
}

function changeAttack(e){
    document.getElementById('att').addEventListener("input",function(){
        attack = att.value;
    });
}
function changeDecay(e){
    document.getElementById('dec').addEventListener("input",function(){
        decay = dec.value;
    });
}
function changeSustain(e){
    document.getElementById('sus').addEventListener("input",function(){
        sustain = sus.value;
    });
}
function changeRelease(e){
    document.getElementById('rel').addEventListener("input",function(){
        release = rel.value;
    });
}

//Changes the oscillator wave type
function changeWave(e){
    if(e.target!==e.currentTarget){
        wave= e.target.id;
        [].slice.call(document.getElementsByClassName('wavebutton'), 0).forEach(function(element){
            element.style.color='whitesmoke';
            element.style.backgroundColor = 'rgb(62, 10, 66)';
        });
        e.target.style.color ='rgb(24, 255, 101)';
        e.target.style.backgroundColor = 'rgb(32, 10, 46)';
    }
}

function changeEnvelopeMode(e){
    if(e.target!==e.currentTarget){
        envelopeMode = parseInt(e.target.value);
        [].slice.call(document.getElementsByClassName('envelopebutton'), 0).forEach(function(element){
            element.style.color='whitesmoke';
            element.style.backgroundColor = '#ff006a';
        });
        e.target.style.color='rgb(24, 255, 101)';
        e.target.style.backgroundColor = '#830044';
    }
}

//Turns on the envelope effect, from attack till sustain
function envelopeOn(gain,attack,decay,sustain){
    var time = context.currentTime;
    attack *= envelopeMode;
    decay *= envelopeMode;
    gain.cancelScheduledValues(0);
    gain.setValueAtTime(0,time);
    gain.linearRampToValueAtTime(amp.gain.value,time+attack);
    gain.linearRampToValueAtTime(sustain,time+attack+decay);
}

//Releases the envelope effect
function envelopeOff(gain,release,note){
    var time = context.currentTime;
    release *= envelopeMode;
    gain.cancelScheduledValues(0);
    gain.setValueAtTime(sustain,time);
    gain.linearRampToValueAtTime(0,time+release);
    note.stop(time+release);
}