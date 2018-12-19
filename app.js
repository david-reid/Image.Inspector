var environment = "http://localhost/Image.Inspector";

// Canvas
var canvas;
var canvasContext;

// Mouse Coordinates
var mouseX;
var mouseY;

// Images
var mapPics = [];
var picsToLoad = 0;

var lion = document.createElement('img');

var gallery = [
    { image: lion, theFile: 'lion_400x400.jpg', xpos: 0, ypos: 0, description: 'A colourful lion' },
];



// Initiate the canvas and load the images
window.onload = function() {

    checkProtocol();

    // Image canvas
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    // Inspector canvas
    canvas2 = document.getElementById('canvas2');
    canvasContext2 = canvas2.getContext('2d');

    canvas.addEventListener('mousemove', mouseMoved);

    loadImages();
}


// Redirect if using the file: protocol.
function checkProtocol() {
    
    var protocol = document.location.protocol;
    
    if ( protocol === "file:" ) {
        window.location.href = "whoops.html";
    }
}


function loadImages() {

    picsToLoad = gallery.length;

    for (var i = 0; i < gallery.length; i++ ) {
        if (gallery[i].image != undefined) {
            beginLoadingImage(gallery[i].image, gallery[i].theFile);
        }
    }
}


function beginLoadingImage(imgVar, fileName) {
    
    imgVar.onload = countLoadedImagesAndLaunchIfReady;
    imgVar.src = environment + '/assets/' + fileName;
}


function countLoadedImagesAndLaunchIfReady() {
    
    picsToLoad--;
    if (picsToLoad == 0) {
        imageLoadingDone();
    }
}


function imageLoadingDone() {

    for (var i = 0; i < gallery.length; i++ ) {

        if (gallery[i].image != undefined) {

            canvasContext.drawImage(gallery[i].image, gallery[i].xpos, gallery[i].ypos);
        }
    }
}


function mouseMoved(evt) {
    
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    sampleImageDataAtCoords(mouseX, mouseY);

    document.getElementById("mouseCoords").innerHTML = ("X: " + mouseX + ", Y: " + mouseY);
}


function sampleImageDataAtCoords(x, y) {
    
    var canvasPadding = 1;
    var inspectorSize = 150;
    var inspectorX = x - canvasPadding - (inspectorSize / 2);
    var inspectorY = y - canvasPadding - (inspectorSize / 2);

    // Grab image to display on inspector window
    var inspector = canvasContext.getImageData(inspectorX,inspectorY, inspectorSize,inspectorSize);
    
    canvasContext2.scale(2.0,2.0);
    canvasContext2.putImageData(inspector, 0, 0);

    // Grab sample for RGB test
    var imageSample = canvasContext.getImageData(x-canvasPadding,y-canvasPadding, inspectorSize,inspectorSize);
    
    // Output data to screen.
    document.getElementById("sampleCoords").innerHTML = ("X: " + x + ", Y: " + y);
    document.getElementById("sampleColour").innerHTML = ("R: " + imageSample.data[0] + ", G: " + imageSample.data[1] + ", B: " + imageSample.data[2]);

    // Display color under mouse
    var cssText = "border-bottom:20px solid " + "rgb(" + imageSample.data[0] + "," + imageSample.data[1] + "," + imageSample.data[2] + ")";
    document.getElementById("sampleBar").style.cssText = cssText;
}