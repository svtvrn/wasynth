var distortionNode;
var button;

//Initiating the distortion filter
function initDistortion(context){
    distortionNode = context.createWaveShaper();
    distortionNode.curve = makeDistortionCurve(0);
    button = document.getElementById('distortbutton');
    button.addEventListener("click",turnOnDistortion);
    return distortionNode;
}

//Curves the note wave to create distortion
function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 0,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
}

function getDistortionNode(){
    return distortionNode;
}

function getDistortionButton(){
    return button;
}

//Distortion button listener
function turnOnDistortion(e){
    if(button.title=='off'){
        button.setAttribute('title','on');
        button.innerHTML="ON";
        button.style.color =  'rgb(24, 255, 101)';
        button.style.backgroundColor = '#830044';
        distortionNode.curve = makeDistortionCurve(document.getElementById('distort').value*5);
    }else if(button.title =='on'){
        button.setAttribute('title','off');
        button.innerHTML = "OFF";
        button.style.color = 'whitesmoke';
        button.style.backgroundColor = '#ff006a';
        distortionNode.curve = makeDistortionCurve(0);
    }
}

//Distortion value slider
function changeDistortion(e){
    document.getElementById('distort').addEventListener("input",function(){
        if(button.title =='on'){
            distortionNode.curve = makeDistortionCurve(distort.value*5);
        }else{
            return;
        }
    });
}
