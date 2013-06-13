/*global MotionTracker */

var SignalVisualizer = { make: function(el, count, width, height, color){

    var $el = $(el), api = {};

    // ===============================================
    // STATE
    // ===============================================

    var values = new Float32Array(count)
      , pos = 0
      , canvas = null
      , ctx = null
      ;

    api.y_max = 1;
    api.y_min = -1;
    api.y_range = api.y_max - api.y_min;

    //api.frame = 0;  //DEBUG

    // ===============================================
    // METHODS
    // ===============================================

    function createCanvas() {
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        $el.append(canvas);
        ctx = canvas.getContext('2d');
    }

    api.pushValue = function(val) {
        if (typeof val !== 'number') return;

        //val = Math.sin(api.frame++ * (Math.PI / 180.0)) * 100.0;  //DEBUG
        values[pos] = val;

        if (--pos < 0) pos += count;

        if (val < api.y_min) api.y_min = val;
        if (val > api.y_max) api.y_max = val;
        api.y_range = api.y_max - api.y_min;

        //if (api.frame < 100) console.log(values);
    };

    api.onRender = function() {
        var i, v, x, y, p, sx, sy;

        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = color || '#F00070';

        sx = width / count;
        sy = (height - 1) / api.y_range;

        ctx.beginPath();
        for (i= 0; i < values.length - 1; i++) {

            p = pos - i;
            while (p >= count) p -= count;
            while (p < 0) p += count;

            v = values[p] - api.y_min;

            y = v * sy;
            y = (height - y)|0;

            if (i === 0) {
                x = width;
                ctx.moveTo(x, y);
            } else {
                x = width - (i * sx);
                x = x|0;
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    };

    // ===============================================
    // INITIALIZE
    // ===============================================

    createCanvas();

    return api;
}};


$(document).ready(function(){
    var s0, s1;

    MotionTracker.start();

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    }

    function onFrame() {
        window.requestAnimationFrame(onFrame);

        if (s0 && s1) {
            s0.pushValue(MotionTracker.tiltLR);
            s1.pushValue(MotionTracker.smoothTiltLR);
            s0.onRender();
            s1.onRender();

            $('#mt-debug-info').html('tiltLR:'+(MotionTracker.tiltLR|0)+' '+(MotionTracker.smoothTiltLR|0)+
                                     '<br>tiltFB:'+(MotionTracker.tiltFB|0)+
                                     '<br>y_range:'+(s0.y_range|0)+' '+(s1.y_range|0)+
                                     '<br>y_min:'+(s0.y_min|0)+' '+(s1.y_min|0)+
                                     '<br>y_max:'+(s0.y_max|0)+' '+(s1.y_max|0)
                                     );
        }
    }

    window.requestAnimationFrame(onFrame);

    window.addEventListener('touchstart', function(e){ e.preventDefault(); }, false);

    s0 = SignalVisualizer.make($('#signals'), 120, 320, 200);
    s1 = SignalVisualizer.make($('#signals'), 120, 320, 200, '#f0f000');
});
