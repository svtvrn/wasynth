//Creates the audio context and the starting wave type
var context = new (window.AudioContext || window.webkitAudioContext)();
var wave='sine'

//Master gain node
var  amp = context.createGain();
amp.gain.value=0.5;
amp.connect(context.destination);
gainval.innerHTML = (amp.gain.value*100).toFixed(0)+"%";
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
lowshelf.frequency.value = 330;
lowshelf.gain.value = 0.5;

var peaking = context.createBiquadFilter();
peaking.type = "peaking";
peaking.frequency.value = 400;
peaking.gain.value = 0.5;

var highself = context.createBiquadFilter();
highself.type = "highself";
highself.frequency.value = 440;
highself.gain.value = 0.5;

//ADSR variables used to apply the effect
var envelopeGain = context.createGain();


var attack = decay = release = 0.5;
var sustain = 0.5, envelopeMode = 1;

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
    highself.connect(envelopeGain);
    envelopeGain.connect(amp);
    return note;
}

//Playes the note created in createNote(), applies ADSR accordingly
function playNote(e){
    if(e.target!==e.currentTarget){
        var hertz= parseFloat(e.target.id);
    }
    var note = createNote(hertz);
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
    });
}

function changeBass(e){
    document.getElementById('bass').addEventListener("input",function(){
        lowshelf.gain.value = bass.value;
    });
}

function changeMid(e){
    document.getElementById('mid').addEventListener("input",function(){
        peaking.gain.value = mid.value;
    });
}

function changeTreble(e){
    document.getElementById('treble').addEventListener("input",function(){
        highself.gain.value = treble.value;
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



function changeWave(e){
    if(e.target!==e.currentTarget){
        wave= e.target.id;
        document.getElementById("currwave").innerHTML = "Current wave: "+wave;
    }
}

function compressionOn(e){
    
    if(compression.title=="off"){
        compressor.connect(amp);
        compression.setAttribute('title','on');
        compression.setAttribute("style", "color: rgb(208, 255, 0); border-style:inset; background-color:  rgb(100, 0, 70);");
        compressor_on=1;
        
    }else if(compression.title=="on"){
        compressor.disconnect(amp);
        compression.setAttribute('title','off');
        compression.setAttribute("style", "color: rgb(255, 255, 255); border-style:0; background-color:  rgb(255, 0, 179);");
        compressor_on=0;
    }
}

function envelopeOn(gain,attack,decay,sustain){
    var time = context.currentTime;
    attack *= envelopeMode;
    decay *= envelopeMode;
    gain.cancelScheduledValues(0);
    gain.setValueAtTime(0,time);
    gain.linearRampToValueAtTime(amp.gain.value,time+attack);
    gain.linearRampToValueAtTime(sustain,time+attack+decay);
}

function envelopeOff(gain,release,note){
    var time = context.currentTime;
    release *= envelopeMode;
    gain.cancelScheduledValues(0);
    gain.setValueAtTime(sustain,time);
    gain.linearRampToValueAtTime(0,time+release);
    note.stop(time+release);
}
