/*global io */
$(function(){

    function transformLogo(tiltLR, tiltFB) {
        $('#html5-logo').css({
            transform: "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + tiltFB + "deg)"
        });
    }

    window.transformLogo = transformLogo;

    transformLogo(0, 0);

    var socket = io.connect();

    socket.on('tilt', function(tilt) {
        //console.log('tilt:', tilt);
        transformLogo(-tilt.LR, -tilt.FB);
    });
});
