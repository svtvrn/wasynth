var context = new (window.AudioContext || window.webkitAudioContext)();
var wave='sine'

var  gain = context.createGain();
gain.gain.value=0.5;
gain.connect(context.destination);
gainval.innerHTML = (gain.gain.value*100).toFixed(0);
document.getElementById("currwave").innerHTML = "Current wave: "+wave;

var compressor = context.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, context.currentTime);
compressor.knee.setValueAtTime(40, context.currentTime);
compressor.ratio.setValueAtTime(12, context.currentTime);
compressor.attack.setValueAtTime(0, context.currentTime);
compressor.release.setValueAtTime(0.25, context.currentTime);

compressor_on = 0

var keys = document.querySelector("#keys");
keys.addEventListener("mousedown",playNote);

var waves = document.querySelector("#waves");
waves.addEventListener("click",changeWave);

var compression = document.querySelector("#compression");
compression.addEventListener("click",compressionOn);

function createNote(hertz){
    var note = context.createOscillator();
    note.type=wave;
    note.frequency.setValueAtTime(hertz,context.currentTime);
    if(compressor_on){
        note.connect(compressor);
    }else{
        note.connect(gain);
    }
    return note;
}

function playNote(e){
    if(e.target!==e.currentTarget){
        var hertz= parseFloat(e.target.id);
    }
    var note = createNote(hertz);
    note.start();
    keys.addEventListener("mouseup",function(){
        note.stop(context.currentTime);
    });
}

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


