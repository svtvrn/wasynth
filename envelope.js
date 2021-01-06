//ADSR variables used to apply the effect
var envelope;
var attack = decay = release = 0.5;
var sustain = 0.5, envelopeMode = 1;

//Envelope mode buttons
var envModeButtons = document.querySelector("#envmode");
envModeButtons.addEventListener("click",changeEnvelopeMode);
lowenv.style.color='rgb(24, 255, 101)';
lowenv.style.backgroundColor = '#830044';

//Creates the envelope gain
function initEnvelope(context){
    envelope = context.createGain();
    return envelope;
}

//ADSR value sliders
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

//Changes envelope mode
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

function setEnvelopeGain(value){
    envelope.gain.value = value;
}

//Turns on the envelope effect, from attack till sustain
function envelopeOn(attack,decay,sustain){
    var time = context.currentTime;
    attack *= envelopeMode;
    decay *= envelopeMode;
    envelope.gain.cancelScheduledValues(0);
    envelope.gain.setValueAtTime(0,time);
    envelope.gain.linearRampToValueAtTime(envelope.gain.value,time+attack);
    envelope.gain.linearRampToValueAtTime(sustain,time+attack+decay);
}

//Releases the envelope effect
function envelopeOff(release,note){
    var time = context.currentTime;
    release *= envelopeMode;
    envelope.gain.cancelScheduledValues(0);
    envelope.gain.setValueAtTime(sustain,time);
    envelope.gain.linearRampToValueAtTime(0,time+release);
    note.stop(time+release);
}