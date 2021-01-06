//Oscilloscope node and variables
var analyser;
var oscilloscopeContext = document.getElementById("oscilloscope").getContext("2d");

//Connects the synth amp to the oscilloscope
function connectScope(context,amp){
    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    amp.connect(analyser);
    oscilloscope();
}

//Starting the oscilloscope
function oscilloscope(){
    drawOscilloscope();
    requestAnimationFrame(oscilloscope);
}

//Draws the oscillator canvas
function drawOscilloscope(){

    var height = oscilloscopeContext.canvas.height;
    var width = oscilloscopeContext.canvas.width;
    var timeData = new Uint8Array(analyser.frequencyBinCount);
    var scaling = height / 256;
    var risingEdge = 0;
    var edgeThreshold = 5;
    analyser.getByteTimeDomainData(timeData);

    oscilloscopeContext.fillStyle = 'rgb(19, 18, 19)';
    oscilloscopeContext.fillRect(0, 0, width, height);
    oscilloscopeContext.lineWidth = 3;
    oscilloscopeContext.strokeStyle = 'rgb(24, 255, 101)';
    oscilloscopeContext.beginPath();

    while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
        if (risingEdge >= width) risingEdge = 0;

    while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
        if (risingEdge >= width) risingEdge = 0;

    for (var x = risingEdge; x < timeData.length && x - risingEdge < width; x++)
        oscilloscopeContext.lineTo(x - risingEdge, height - timeData[x] * scaling);

    oscilloscopeContext.stroke();
}