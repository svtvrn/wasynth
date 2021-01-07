//Creates the audio context and the starting wave type
var context = new (window.AudioContext || window.webkitAudioContext)();
var wave='sine'
sine.style.color ='rgb(24, 255, 101)';
sine.style.backgroundColor = 'rgb(32, 10, 46)';

//Master gain node
var amp = context.createGain();
amp.gain.value=0.5;
gainval.innerHTML = (amp.gain.value*100).toFixed(0)+"%";

//Biquad filters for Bass and Treble
var filters = initFilters(context);
var lowshelf = initLowshelf(context);
var highshelf = initHighshelf(context);

//ADSR Envelope filter
var envelopeGain = initEnvelope(context);
setEnvelopeGain(0.5);

//Distortion filter
var distortion = initDistortion(context);

//LFO connected to the amp gain for tremolo effect
var tremolo = context.createOscillator();
tremolo.frequency.value = 5;
tremolo.type = wave;
tremolo.start();

//LFO connected to a gain node for vibrato effect
var vibrato = context.createGain();
vibrato.gain.value=100;
var vibratoLfo = context.createOscillator();
vibratoLfo.frequency.value=3;
vibratoLfo.start();

//Connecting the nodes and the oscilloscope
filters.connect(lowshelf);
lowshelf.connect(highshelf);
highshelf.connect(envelopeGain);
envelopeGain.connect(distortion);
distortion.connect(amp);
amp.connect(context.destination);
connectScope(context,amp);

//Assigns the "keys" elements from the HTML file
var keys = document.querySelector("#keys");
keys.addEventListener('mousedown',playNote);

//Assigns the "wave button" elements from the HTML file
var waves = document.querySelector("#waves");
waves.addEventListener('click',changeWave);

var trem = document.getElementById('trem');
trem.addEventListener('click',turnOnTremolo);

var vibr = document.getElementById('vibr');
vibr.addEventListener('click',turnOnVibrato);

//Creates the note for the respective key, C4 to C5
function createNote(hertz){
    var note = context.createOscillator();
    note.type=wave;
    note.frequency.setValueAtTime(hertz,context.currentTime);
    return note;
}

//Plays the note created in createNote(), applies ADSR accordingly
function playNote(e){
    if(e.target!==e.currentTarget){
        var hertz = parseFloat(e.target.id);
    }
    var note = createNote(hertz);
    note.connect(filters);
    vibrato.connect(note.detune);
    note.start();
    envelopeOn(attack,decay,sustain,context.currentTime);
    keys.addEventListener('mouseup',function(){
        envelopeOff(release,note,context.currentTime);
    });
}

//Changes the amp gain when the slider value is changed
function changeGain(e){
    document.getElementById('volume').addEventListener('input', function() {
        amp.gain.value=volume.value;
        gainval.innerHTML = (amp.gain.value*100).toFixed(0)+"%";
        setEnvelopeGain(volume.value);
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

function turnOnTremolo(e){
    if(trem.value=='off'){
        trem.setAttribute('value','on');
        trem.style.color =  'rgb(24, 255, 101)';
        trem.style.backgroundColor = '#830044';
        tremolo.connect(amp.gain);
    }else if(trem.value =='on'){
        trem.setAttribute('value','off');
        trem.style.color = 'whitesmoke';
        trem.style.backgroundColor = '#ff006a';
        tremolo.disconnect();
    }
}

function turnOnVibrato(e){
    if(vibr.value=='off'){
        vibr.setAttribute('value','on');
        vibr.style.color =  'rgb(24, 255, 101)';
        vibr.style.backgroundColor = '#830044';
        vibratoLfo.connect(vibrato);
    }else if(vibr.value =='on'){
        vibr.setAttribute('value','off');
        vibr.style.color = 'whitesmoke';
        vibr.style.backgroundColor = '#ff006a';
        vibratoLfo.disconnect();
    }
}