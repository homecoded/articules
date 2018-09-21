// References to all the element we will need.
var video = document.querySelector('#camera-stream'),
    image = document.querySelector('#snap'),
    start_camera = document.querySelector('#start-camera'),
    controls = document.querySelector('.controls'),
    take_photo_btn = document.querySelector('#take-photo'),
    download_photo_btn = document.querySelector('#download-photo'),
    error_message = document.querySelector('#error-message'),
    isStreamRunning = true,
    target = document.getElementById('stage');



// The getUserMedia interface is used for handling camera input.
// Some browsers need a prefix so here we're covering all the options
navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


if(!navigator.getMedia){
    displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
}
else{

    // Request the camera.
    navigator.getMedia(
        {
            video: true
        },
        // Success Callback
        function(stream){

            // Create an object URL for the video stream and
            // set it as src of our HTLM video element.
            try {
                video.srcObject = stream;
            } catch (error) {
                video.src = window.URL.createObjectURL(stream);
            }

            // Play the video element to start the stream.
            video.play();
            video.onplay = function() {
                showVideo();
            };

        },
        // Error Callback
        function(err){
            displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
        }
    );

}



// Mobile browsers cannot play video without user input,
// so here we're using a button to start it manually.
start_camera.addEventListener("click", function(e){

    e.preventDefault();

    // Start video playback manually.
    video.play();
    showVideo();

});


take_photo_btn.addEventListener("click", function(e){

    e.preventDefault();


    isStreamRunning = !isStreamRunning;



    if (!isStreamRunning) {
        // Set the href attribute of the download button to the snap url.
        download_photo_btn.href = target.toDataURL();
        download_photo_btn.classList.remove('disabled');
    } else {
        download_photo_btn.classList.add('disabled');
    }

});


function showVideo(){
    // Display the video stream and the controls.

    hideUI();
    video.classList.add("visible");
    controls.classList.add("visible");
}


function takeSnapshot(){
    // Here we're using a trick that involves a hidden canvas element.

    var hidden_canvas = document.querySelector('#capture'),
        context = hidden_canvas.getContext('2d');

    var width = video.videoWidth,
        height = video.videoHeight;

    if (width && height) {

        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(video, 0, 0, width, height);
    }
    return hidden_canvas;
}


function displayErrorMessage(error_msg, error){
    error = error || "";
    if(error){
        console.log(error);
    }

    error_message.innerText = error_msg;

    hideUI();
    error_message.classList.add("visible");
}


function hideUI(){
    // Helper function for clearing the app UI.

    controls.classList.remove("visible");
    start_camera.classList.remove("visible");
    video.classList.remove("visible");
    snap.classList.remove("visible");
    error_message.classList.remove("visible");
}


setInterval(
    function () {
        if (isStreamRunning) {
            var canvas = takeSnapshot();
            Filter.applyFilters(
                ['mirror', 'grid', 'shapes'],
                target,
                canvas
            );

        }
    },
100);