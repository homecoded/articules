Filter.GrayscaleFilter = (function () {

    function apply(target, source, options, doneCallback) {
        var pixelData = target.getContext('2d').getImageData(0, 0, source.width, source.height);
        var d = pixelData.data;
        var r,g,b;

        for (var i=0; i<d.length; i+=4) {
            r = d[i];
            g = d[i+1];
            b = d[i+2];
            // CIE luminance for the RGB
            // The human eye is bad at seeing red and blue, so we de-emphasize them.
            var v = 0.2126*r + 0.7152*g + 0.0722*b;
            d[i] = d[i+1] = d[i+2] = v
        }
        target.getContext('2d').putImageData(pixelData,0,0);
        doneCallback();
    }

    return {
        apply: apply
    }
})();

Filter.register('grayscale', Filter.GrayscaleFilter);