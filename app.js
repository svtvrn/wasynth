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
var envelopeGain = initEnvelope(context);
setEnvelopeGain(0.5);

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
    envelopeOn(attack,decay,sustain);
    keys.addEventListener("mouseup",function(){
        envelopeOff(release,note);
    });
}

//Changes gain when the slider value is changed
function changeGain(e){
    document.getElementById('volume').addEventListener('input', function() {
        amp.gain.value=volume.value;
        gainval.innerHTML = (amp.gain.value*100).toFixed(0)+"%";
        setEnvelopeGain(volume.value);
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