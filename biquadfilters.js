//Bass and Treble filters, decibel boost by user input
var filters;
var lowshelf;
var highshelf;

//Initiating the biquad filters
function initFilters(context){
    filters = context.createBiquadFilter();
    filters.type = "peaking";
    filters.frequency.value = 10370;
    filters.Q.value = 10000;
    filters.gain.value = 20;
    return filters;
}

function initLowshelf(context){
    lowshelf = context.createBiquadFilter();
    lowshelf.type = "lowshelf";
    lowshelf.frequency.value = 330;
    lowshelf.gain.value = 0;
    return lowshelf;
}

function initHighshelf(context){
    highshelf = context.createBiquadFilter();
    highshelf.type = "highshelf";
    highshelf.frequency.value = 410;
    highshelf.gain.value = 0;
    return highshelf;
}

//Biquad filter sliders
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
