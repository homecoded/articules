// References to all the element we will need.
var video = document.querySelector('#camera-stream'),
    controlMenu = document.querySelector('.controls'),
    play_btn = document.querySelector('#play'),
    pause_btn = document.querySelector('#pause'),
    download_photo_btn = document.querySelector('#download-photo'),
    error_message = document.querySelector('#error-message'),
    isStreamRunning = false,
    target = document.getElementById('stage'),
    filterId = 0,
    app = document.querySelector('.app'),
    header = document.querySelector('header')
;


// The getUserMedia interface is used for handling camera input.
// Some browsers need a prefix so here we're covering all the options
navigator.getMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


if (!navigator.getMedia) {
    displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
}
else {

    // Request the camera.
    navigator.getMedia(
        {
            video: true
        },
        // Success Callback
        function (stream) {

            // Create an object URL for the video stream and
            // set it as src of our HTLM video element.
            try {
                video.srcObject = stream;
            } catch (error) {
                video.src = window.URL.createObjectURL(stream);
            }

            video.onplay = function() {
                showVideo();
            };

        },
        // Error Callback
        function (err) {
            displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
        }
    );

}

play_btn.addEventListener("click", function (e) {
    e.preventDefault();
    isStreamRunning = true;
    video.play();
    updatePlayControls();
    filterId = 0;
    setFullScreen(true);
});

pause_btn.addEventListener("click", function (e) {
    e.preventDefault();
    isStreamRunning = false;
    video.pause();
    updatePlayControls();
    setFullScreen(false);
});

document.addEventListener('menu_open', function (e) { pause_btn.click(); }, false);


download_photo_btn.addEventListener("click", function (e) {
    // Set the href attribute of the download button to the snap url.
    download_photo_btn.href = target.toDataURL();
    download_photo_btn.download = "articules.png";
});

function showVideo() {
    video.classList.add("visible");
    controlMenu.classList.add("visible");
    download_photo_btn.classList.remove('disabled');
}

function setFullScreen(enable) {
    if (enable) {
        app.classList.add('fullscreen');
        header.classList.add('hide');
    } else {
        app.classList.remove('fullscreen');
        header.classList.remove('hide');
    }
}

function takeSnapshot() {
    // Here we're using a trick that involves a hidden canvas element.

    var hidden_canvas = document.querySelector('#capture'),
        context = hidden_canvas.getContext('2d');

    var width = 600,
        height = 600/video.videoWidth * video.videoHeight;

    if (width && height) {

        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(video,
            0, 0, video.videoWidth, video.videoHeight,
            0, 0, width, height);
    }
    return hidden_canvas;
}


function updatePlayControls() {
    if (isStreamRunning) {
        pause_btn.classList.remove('hide');
        play_btn.classList.add('hide');
        download_photo_btn.classList.add('hide');
    } else {
        pause_btn.classList.add('hide');
        play_btn.classList.remove('hide');
        download_photo_btn.classList.remove('hide');
    }
}

function displayErrorMessage(error_msg, error) {
    error = error || "";
    if (error) {
        console.log(error);
    }

    error_message.innerText = error_msg;
    error_message.classList.add("visible");
}

updatePlayControls();

function haveFilteresChanged(filters) {
    var currentFilterId = getFilterId(filters);
    return (currentFilterId !== filterId)
}

function getFilterId(filters) {
    return filters.join(',');
}

setInterval(
    function () {
        var canvas = takeSnapshot();
        if (isStreamRunning) {
            Filter.applyFilters(
                ['copy'],
                target,
                canvas
            );
        } else {
            var filters = controls.getFilterList();
            if (haveFilteresChanged(filters)) {
                Filter.applyFilters(
                    filters,
                    target,
                    canvas
                );
                filterId = getFilterId(filters);
            }
        }
    },
    100);

