// Created 2013 by wolfger@spearwolf.de
// --> https://github.com/spearwolf/motiontracker
//
(function(root){

    var api = root.MotionTracker = {}
      , tiltLRValue
      , tiltFBValue
      ;

    api.smoothing = 24.0;

    function isLandscapeOrientation() {
        return Math.abs(window.orientation) === 90;
    }

    function handleMotionEvent(e) {

        var accel = e.accelerationIncludingGravity
          , facingUp = -1
          ;

        if (typeof tiltLRValue === 'undefined') {
            tiltLRValue = api.tiltLR;
            tiltFBValue = api.tiltFB;
        }

        api.tiltLR = (accel.x / 9.81) * -90;
        if (accel.z > 0) facingUp = 1;
        api.tiltFB = ((accel.y + 9.81) / 9.81) * 90 * facingUp;

        if (typeof tiltLRValue === 'number') {

            tiltLRValue += (api.tiltLR - tiltLRValue) / api.smoothing;
            tiltFBValue += (api.tiltFB - tiltFBValue) / api.smoothing;

            api.smoothTiltLR = tiltLRValue;
            api.smoothTiltFB = tiltFBValue;
        }
    }

    api.start = function() {
        window.addEventListener("devicemotion", handleMotionEvent, true);
    };

})(this);
