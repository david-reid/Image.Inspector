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

var background = document.createElement('img');
var elbows = document.createElement('img');
var hands = document.createElement('img');
var lowerArms = document.createElement('img');
var shoulders = document.createElement('img');
var upperArms = document.createElement('img');
var wrists = document.createElement('img');

var gallery = [
    { image: background, theFile: 'lion_400x400.jpg', xpos: 0, ypos: 0, description: 'A colourful lion' },
];


// Initiate the canvas and load the images
window.onload = function() {

    console.log("IMAGE HIGHLIGHTER");

    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    canvas2 = document.getElementById('canvas2');
    canvasContext2 = canvas2.getContext('2d');

    canvas.addEventListener('mousemove', mouseMoved);

    loadImages();
}


function loadImages() {

    picsToLoad = gallery.length;

    for (var i = 0; i < gallery.length; i++ ) {
        if (gallery[i].image != undefined) {
            beginLoadingImage(gallery[i].image, gallery[i].theFile);
        }
    }
}


function countLoadedImagesAndLaunchIfReady() {
    
    picsToLoad--;
    if (picsToLoad == 0) {
        imageLoadingDone();
    }
}


function beginLoadingImage(imgVar, fileName) {
    
    imgVar.onload = countLoadedImagesAndLaunchIfReady;
    imgVar.src = environment + '/assets/' + fileName;
}


function imageLoadingDone() {

    console.log('A total of ' + gallery.length + ' Image(s) Loaded');

    for (var i = 0; i < gallery.length; i++ ) {

        if (gallery[i].image != undefined) {

            console.log(gallery[i].description);
            
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

    var cssText = "border-bottom:20px solid " + "rgb(" + imageSample.data[0] + "," + imageSample.data[1] + "," + imageSample.data[2] + ")";
    document.getElementById("sampleBar").style.cssText = cssText;

}