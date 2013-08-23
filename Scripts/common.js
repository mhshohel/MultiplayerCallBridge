// Setup requestAnimationFrame and cancelAnimationFrame for use in the game code
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

//Show message
(function () {
    //change the html attributes and the css to make it work
    var messageBoxOkCallback = undefined;
    var messageBoxCancelCallback = undefined;

    showMessageBox = function (title, message, onOK, onCancel) {
        $('#messageboxtext').html(message);
        (!onOK) ? messageBoxOkCallback = undefined : messageBoxOkCallback = onOK;

        if (!onCancel) {
            messageBoxCancelCallback = undefined;
            $("#messageboxcancel").hide();
        } else {
            messageBoxCancelCallback = onCancel;
            $("#messageboxcancel").show();
        }

        $('#messageboxscreen').show();
    }

    messageBoxOK = function () {
        $('#messageboxscreen').hide();
        if (messageBoxOkCallback) {
            messageBoxOkCallback()
        }
    }

    messageBoxCancel = function () {
        $('#messageboxscreen').hide();
        if (messageBoxCancelCallback) {
            messageBoxCancelCallback();
        }
    }

//    $('#messageboxok').val("OK").on('click', function () {
//        messageBoxOK();
//    });
//
//    $('#messageboxcancel').val("Cancel").on('click', function () {
//        messageBoxCancel();
//    });
})();


