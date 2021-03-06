/**Setup requestAnimationFrame and cancelAnimationFrame for use in the game code**/
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

/**Progressbar
 * -----------------------**/
$(function () {
    dom.progressbar.progressbar({
        value: false,
        change: function () {
            dom.progressLabel.text(dom.progressbar.progressbar("value") + "%");
        },
        complete: function () {
            if (loader.getLoadedCount() === loader.getTotalCount()) {
                dom.progressLabel.text("Complete!");
                setTimeout(function () {
                    dom.progressbar.hide();
                    common.showGameMenu();
                }, 1000);
            }
        }
    });

    function progress() {
        var val = dom.progressbar.progressbar("value") || 0;
        dom.progressbar.progressbar("value", val + 10);
        if (val < 99) {
            setTimeout(progress, 10);
        }
    }

    setTimeout(progress, 1000);
});

/**Some important functions**/
var common = {
    onOkCallback: undefined,
    showGameTitle: function () {
        dom.gameTitle.show();
        dom.gameSlogan.show();
    },
    hideGameTitle: function () {
        dom.gameTitle.hide();
        dom.gameSlogan.hide();
    },
    showGameMenu: function () {
        dom.menu.fadeIn();
    },
    hideGameMenu: function () {
        dom.menu.hide();
    },
    showLobby: function () {
        dom.lobby.html("<input id='clientName' type='text' maxlength='15' placeholder='Enter your name.'><br/><select id='multiPlayerGamesList' size='10'></select><input type='button' id='multiPlayerJoin' onclick='multiPlayer.join()' value='Join'/><input type='button' id='multiPlayerCancel' onclick='multiPlayer.cancel()' value='Cancel'/>");
        dom.clientName = $("#clientName");
        dom.multiPlayerGamesList = $("#multiPlayerGamesList");
        dom.multiPlayerJoin = $("#multiPlayerJoin");
        dom.multiPlayerCancel = $("#multiPlayerCancel");
        /**Store selected item index on keyUp or onClick**/
        dom.multiPlayerGamesList.keyup(function (e) {
            if (e.keyCode == 38 || e.keyCode == 40) {
                multiPlayer.selectedRomNum = dom.multiPlayerGamesList.val();
            }
        });
        dom.multiPlayerGamesList.on('click', function () {
            multiPlayer.selectedRomNum = dom.multiPlayerGamesList.val();
        });
        dom.multiplayerLobby.show();
    },
    disableLobby: function () {
        dom.clientName.prop('disabled', true);
        dom.multiPlayerGamesList.prop('disabled', true);
        dom.multiPlayerJoin.prop('disabled', true);
    },
    enableLobby: function () {
        dom.clientName.prop('disabled', false);
        dom.multiPlayerGamesList.prop('disabled', false);
        dom.multiPlayerJoin.prop('disabled', false);
    },
    hideLobby: function () {
        dom.clientName = undefined;
        dom.multiPlayerGamesList.off;
        dom.multiPlayerGamesList = undefined;
        dom.lobby.html("");
        dom.multiplayerLobby.hide();
        common.showGameMenu();
    },
    showGameStatus: function (header, footer) {
        dom.statusHeaderText.html((header == undefined) ? "" : header);
        dom.statusFooterText.html((footer == undefined) ? "" : footer);
        dom.gameStatusScreen.show();
    },
    hideGameStatus: function () {
        dom.statusHeaderText.html("");
        dom.statusFooterText.html("");
        dom.gameStatusScreen.hide('slow');
    },
    //click event for Rules, Play
    rulesButtonOnClick: function () {
        dom.rulesButton.on('click', function () {
            common.onInfoMessage("Will be describe soon, please come back soon", "By: Shohel Shamim");
        });
    },
    playButtonOnClick: function () {
        dom.playButton.on('click', function () {
            multiPlayer.start();
        });
    },
    /**Dialog box functions
     --------------------------**/
    onInfoMessage: function (messageOne, messageTwo, onOk) {
        dom.dialogMessageOne.append("<span id='dialog-messageIcon' class='ui-icon ui-icon-info'></span>");
        common.dialogMessageContainer(messageOne, messageTwo, onOk);
    },
    onAlertMessage: function (messageOne, messageTwo, onOk) {
        dom.dialogMessageOne.append("<span id='dialog-messageIcon' class='ui-icon ui-icon-alert'></span>");
        common.dialogMessageContainer(messageOne, messageTwo, onOk);
    },
    dialogMessageContainer: function (messageOne, messageTwo, onOk) {
        common.onOkCallback = onOk;
        dom.dialogMessageOne.append(messageOne);
        dom.dialogMessageTwo.html(messageTwo);
        common.dialog();
    }
    /**-----------------------------------**/
}

/**Dialogbox, use it to show message to the user**/
common.dialog = function () {
    dom.dialogBox.dialog({
        title: "Callbridge",
        autoOpen: false,
        resizable: false,
        draggable: true,
        position: ['center', 250],
        closeOnEscape: false,
        show: 'fast',
        hide: 'fast',
        margin: '0 auto',
        maxWidth: 500,
        maxHeight: 250,
        width: 'auto',
        height: 'auto',
        modal: true,
        buttons: {
            Ok: function () {
                if (common.onOkCallback != undefined) {
                    common.onOkCallback();
                }
                dom.dialogMessageOne.html("");
                dom.dialogMessageTwo.html("");
                dom.dialogBox.dialog("close");
                common.onOkCallback = undefined;
            }
        }
    });
    dom.dialogBox.dialog('open');
}

/**Socket tag**/
var socketTag = {
    rooms: "room_list",
    joinRoom: "join_room",
    onError: "onError",
    onCancel: "onCancel"
}

/**Some Global functions
 ---------------------------------------**/
/**Resize window**/
$(window).resize(function () {
    //Resize dialog box on resize window
    try {
        dom.dialogBox.dialog("option", "position", ['center', 250]);
    } catch (err) {
    }
});