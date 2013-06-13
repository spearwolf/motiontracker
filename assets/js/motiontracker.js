// Created 2013 by wolfger@spearwolf.de
(function(root){

    var api = root.MotionTracker = {};

    api.smoothing = 24.0;

    function handleMotionEvent(e) {

        var accel = e.accelerationIncludingGravity
          , facingUp = -1
          , currentValue
          , firstValue
          ;

        if (accel.z > 0) facingUp = 1;

        if (typeof api.tiltLRValue === 'undefined') {
            api.tiltLRValue = api.tiltLR;
            api.tiltFBValue = api.tiltFB;
        }

        api.tiltLR = ((accel.x) / 9.81) * -90;
        api.tiltFB = ((accel.y + 9.81) / 9.81) * 90 * facingUp;

        if (typeof api.tiltLRValue === 'number') {
            currentValue = api.tiltLR;
            api.tiltLRValue += (currentValue - api.tiltLRValue) / api.smoothing;
            api.smoothTiltLR = api.tiltLRValue;
        }
    }

    api.start = function() {
        window.addEventListener("devicemotion", handleMotionEvent, true);
    };

})(this);
