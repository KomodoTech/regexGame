$(document).ready(function() {
    var _intervalId;

    function fadeInLastImg()
    {
        var backImg = $('.avatarLeft:first');
        backImg.hide();
        backImg.remove();
        $('.avatarLeft' ).append( backImg );
        backImg.fadeIn()
    };

    _intervalId = setInterval( function() {
        fadeInLastImg();
    }, 1000 );

});
