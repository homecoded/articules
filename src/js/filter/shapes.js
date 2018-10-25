Filter.ShapesFilter = (function () {

    /**
     * Code for RGB TO lab conversion, and dE76 implementation by Zachary Schuessler
     * http://zschuessler.github.io/DeltaE/demos/de76-chroma-key/
     *
     */

    var pow = Math.pow;
    function dE76(a, b, c, d, e, f) {
        return Math.sqrt(pow(d - a, 2) + pow(e - b, 2) + pow(f - c, 2))
    };

    /**
     * Color conversion formulas. Previously I used the d3.js library since they
     * have a fantastic API for this. My first profile showed that d3 had the
     * biggest performance hit on my code, so I moved the code to local functions.
     *
     * I didn't test if the d3 functions were optimized by the JiT compiler. I did,
     * however, verify the functions below were optimized properly by the compiler.
     */
    function rgbToLab(r, g, b) {
        var xyz = rgbToXyz(r, g, b);
        return xyzToLab(xyz[0], xyz[1], xyz[2]);
    }
    function rgbToXyz(r, g, b) {
        var _r = (r / 255);
        var _g = (g / 255);
        var _b = (b / 255);

        if (_r > 0.04045) {
            _r = Math.pow(((_r + 0.055) / 1.055), 2.4);
        }
        else {
            _r = _r / 12.92;
        }

        if (_g > 0.04045) {
            _g = Math.pow(((_g + 0.055) / 1.055), 2.4);
        }
        else {
            _g = _g / 12.92;
        }

        if (_b > 0.04045) {
            _b = Math.pow(((_b + 0.055) / 1.055), 2.4);
        }
        else {
            _b = _b / 12.92;
        }

        _r = _r * 100;
        _g = _g * 100;
        _b = _b * 100;

        X = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
        Y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
        Z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;

        return [X, Y, Z];
    }
    function xyzToLab(x, y, z) {
        var ref_X = 95.047;
        var ref_Y = 100.000;
        var ref_Z = 108.883;

        var _X = x / ref_X;
        var _Y = y / ref_Y;
        var _Z = z / ref_Z;

        if (_X > 0.008856) {
            _X = Math.pow(_X, (1 / 3));
        }
        else {
            _X = (7.787 * _X) + (16 / 116);
        }

        if (_Y > 0.008856) {
            _Y = Math.pow(_Y, (1 / 3));
        }
        else {
            _Y = (7.787 * _Y) + (16 / 116);
        }

        if (_Z > 0.008856) {
            _Z = Math.pow(_Z, (1 / 3));
        }
        else {
            _Z = (7.787 * _Z) + (16 / 116);
        }

        var CIE_L = (116 * _Y) - 16;
        var CIE_a = 500 * (_X - _Y);
        var CIE_b = 200 * (_Y - _Z);

        return [CIE_L, CIE_a, CIE_b];
    }


    function apply(target, source, options, doneCallback) {

        var numColors = 64;
        if (options) {
            numColors = options['numColors'];
        }

        var colorThief = new ColorThief();
        var palette = colorThief.getPalette(source, numColors);
        var context = target.getContext('2d');
        var colorData = context.getImageData(0,0,target.width, target.height);

        if (!palette) {
            return;
        }

        var paletteLab = [];
        for (var i = 0; i < palette.length; i++) {
            var paletteColor = palette[i];
            paletteLab.push(rgbToLab(paletteColor[0], paletteColor [1], paletteColor[2]));
        }

        var pixelData = colorData.data;

        for (var i = 0; i < pixelData.length; i+=4) {
            var lab = rgbToLab(pixelData[i], pixelData[i+1], pixelData[i+2]);
            var minDist = Number.MAX_SAFE_INTEGER;
            var bestColor;
            for (var j = 0; j < paletteLab.length; j++) {

                var dist = dE76(paletteLab[j][0], paletteLab[j][1], paletteLab[j][2], lab[0], lab[1], lab[2]);
                if (dist < minDist) {
                    minDist = dist;
                    bestColor = j
                }
            }
            pixelData[i] = palette[bestColor][0];
            pixelData[i+1] = palette[bestColor][1];
            pixelData[i+2] = palette[bestColor][2];
        }

        context.putImageData(colorData, 0, 0);

        doneCallback();
    }

    return {
        apply: apply
    }
})();

Filter.register('shapes_1', Filter.ShapesFilter, { numColors: 64 });
Filter.register('shapes_2', Filter.ShapesFilter, { numColors: 32 });
Filter.register('shapes_3', Filter.ShapesFilter, { numColors: 16 });