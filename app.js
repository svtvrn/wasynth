//Creates the audio context and the starting wave type
var context = new (window.AudioContext || window.webkitAudioContext)();
var wave='sine'

//Master gain node
var  gain = context.createGain();
gain.gain.value=0.5;
gain.connect(context.destination);
gainval.innerHTML = (gain.gain.value*100).toFixed(0);
document.getElementById("currwave").innerHTML = "Current wave: "+wave;


//Compressor node, applies effect when the button is pressed
var compressor = context.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, context.currentTime);
compressor.knee.setValueAtTime(40, context.currentTime);
compressor.ratio.setValueAtTime(12, context.currentTime);
compressor.attack.setValueAtTime(0, context.currentTime);
compressor.release.setValueAtTime(0.25, context.currentTime);
compressor_on = 0

//Bass, Mid and Treble filters, gain aka boost changed by user.
var lowshelf = context.createBiquadFilter();
lowshelf.type = "lowshelf";
lowshelf.frequency.value = 4000;
lowshelf.gain.value = 2;

var peaking = context.createBiquadFilter();
peaking.type = "peaking";
peaking.frequency.value = 10000;
peaking.gain.value = -2;

var highself = context.createBiquadFilter();
highself.type = "highself";
highself.frequency.value = 17000;
highself.gain.value = 2;

//ASDR variables used to apply the effect
var attack = delay = release = 0.1;
var sustain = 1, envelopeMode = 1, velocity = 1;

//Assigns the "keys" elements from the HTML file
var keys = document.querySelector("#keys");
keys.addEventListener("mousedown",playNote);

//Assigns the "wave button" elements from the HTML file
var waves = document.querySelector("#waves");
waves.addEventListener("click",changeWave);

//Assigns the "compressor button" element from the HTML file
var compression = document.querySelector("#compression");
compression.addEventListener("click",compressionOn);

//Creates the note for the respective key, C4 to C5 and applies the filters (bass,mid,treb,compression)
function createNote(hertz){
    var note = context.createOscillator();
    note.type=wave;
    note.frequency.setValueAtTime(hertz,context.currentTime);
    note.connect(lowshelf);
    lowshelf.connect(peaking);
    peaking.connect(highself);
    if(compressor_on){
        highself.connect(compressor);
    }else{
        highself.connect(gain);
    }
    return note;
}

//Playes the note created in createNote(), applies ASDR accordingly
function playNote(e){
    if(e.target!==e.currentTarget){
        var hertz= parseFloat(e.target.id);
    }
    var note = createNote(hertz);
    note.start();
    //envelopeOn(gain,attack,delay,sustain);
    keys.addEventListener("mouseup",function(){
        note.stop();
    });
}

//Changes gain when the slider value is changed
function changeGain(e){
    document.getElementById('volume').addEventListener('input', function() {
        gain.gain.value=volume.value;
        gainval.innerHTML = (gain.gain.value*100).toFixed(0);
    });
}

function changeWave(e){
    if(e.target!==e.currentTarget){
        wave= e.target.id;
        document.getElementById("currwave").innerHTML = "Current wave: "+wave;
    }
}

function compressionOn(e){
    
    if(compression.title=="off"){
        compressor.connect(gain);
        compression.setAttribute('title','on');
        compression.setAttribute("style", "color: rgb(208, 255, 0); border-style:inset; background-color:  rgb(100, 0, 70);");
        compressor_on=1;
        
    }else if(compression.title=="on"){
        compressor.disconnect(gain);
        compression.setAttribute('title','off');
        compression.setAttribute("style", "color: rgb(255, 255, 255); border-style:0; background-color:  rgb(255, 0, 179);");
        compressor_on=0;
    }
}

function envelopeOn(gain,attack,delay,sustain){
    var time = context.currentTime;
    attack *= envelopeMode;
    delay *= envelopeMode;
    gain.cancelScheduledValues(0);
    gain.setValueAtTime(0,time);
    gain.linearRampToValue(1,time+attack);
    gain.linearRampToValue(1,time+attack+delay);
}

function envelopeOff(gain,release){
    var time = context.currentTime;
    release *= envelopeMode;
    gain.cancelScheduledValues(0);
    gain.setValueAtTime(gain.value,time);
    gain.linearRampToValue(0,time+release);
}
