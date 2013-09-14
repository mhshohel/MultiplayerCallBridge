var multiPlayer = {
    socket: undefined,
    statusMessages: {
        'starting': 'Game Starting',
        'running': 'Game in Progress',
        'waiting': 'Awaiting second player',
        'empty': 'Open'
    },
    /**Init before play game**/
    start: function () {
        multiPlayer.roomList = undefined;
        //add 1 with roomId of server to get options val
        multiPlayer.selectedRomNum = 0;
        try {
            multiPlayer.socket = io.connect('http://localhost:8000');
            if (multiPlayer.socket == undefined) {
                common.onAlertMessage("Error connecting to the server.");
            } else {
                common.hideGameMenu();
                //send request to get room list, get room list first time, not update to others
                multiPlayer.sendSocketMessage({type: socketTag.rooms, action: "toClient"});
                //initialize game room list
                multiPlayer.receiveSocketMessage(socketTag.rooms);
                common.showLobby();
                //dom.multiplayerLobby.show();
                //dom.multiplayerLobby.show();
                //this.play();
            }
        } catch (err) {
            common.onAlertMessage("Error connecting to the server.");
        }
    },
    startGame: function () {

    },
    statusScreen: function (title, subTitle, buttonText) {

    },
    play: function () {
        var playersInfo = {
            local: new Player(true, "Shohel Shamim"),
            right: new Player(false, "Faruk Amin"),
            top: new Player(false, "Rony"),
            left: new Player(false, "Robin")
        };

        game.newGame(playersInfo);

        /**below codes values will be provided from server**/
        var c, x = 150, y = 635, w = 35, h = 70, pos = 0, isAvailable = true;
        //(suite, svalue, cvalue, sname, points)

        for (var i = 0; i < 12; i++) {
            pos = Math.floor(Math.random() * 52);
            c = game.allcards[pos];
            isAvailable = (isAvailable == true) ? game.pushLocalPlayersCards(x, y, w, h, pos, c.suite, c.svalue, c.cvalue, c.points, c.cname) : false;
            x += w;
        }
        pos = Math.floor(Math.random() * 52);
        c = game.allcards[pos];
        isAvailable = (isAvailable == true) ? game.pushLocalPlayersCards(x, y, 48, 70, pos, c.suite, c.svalue, c.cvalue, c.points, c.cname) : false;

        //other players cards
        var rx = 140, tx = 150, lx = 140;
        for (var i = 0; i < 13; i++) {
            //stop adding cards when card is animate.....using some flag
            game.pushRightPlayersCards(rx, 235, w, h, game.allcards[game.allcards.length - 1], 939);
            game.pushTopPlayersCards(tx, 55, w, h, game.allcards[game.allcards.length - 1], 0);
            game.pushLeftPlayersCards(lx, 375, w, h, game.allcards[game.allcards.length - 1], 500);
            rx += w;
            tx += w;
            lx += w;
        }

        if (isAvailable) {
            game.play(100);
        } else {
            //show error message as don't change code...
        }

        console.log(playersInfo.local.getCards());
    },
    join: function () {
        var name = dom.clientName.val();
        if (name == undefined || name == "") {
            common.onInfoMessage("Please enter your name.");
        } else if (name.length < 5) {
            common.onInfoMessage("Name should be at least 5 character long.");
        } else {
            var selectedRoom = dom.multiPlayerGamesList.val();
            if (selectedRoom) {
//                multiPlayer.sendSocketMessage({type: socketTag.joinRoom, roomId: selectedRoom - 1, foodLength: game.foods.length, boardHeight: game.boardHeight, boardWidth: game.boardWidth, contentSize: game.size, space: game.space});
//                $('#multiPlayerGamesList').prop('disabled', true);
//                $('#multiPlayerJoin').prop('disabled', true);
//            } else {
//                game.showMessageBox("Please select a game room to join.");
            }
        }
    },
    cancel: function () {

    },
    updateRoomStatus: function (messageObject) {
        var roomList = messageObject.roomList;
//        if (multiPlayer.roomId != undefined && messageObject.disconnectedRoomId != undefined) {
//            if (multiPlayer.roomId == messageObject.disconnectedRoomId) {
//                game.running = false;
//                game.pause();
//                multiPlayer.endGame(messageObject.errorMessage, function () {
//                    $('#gameCanvas').hide();
//                    $('#multiPlayerLobbyScreen').show();
//                })
//            }
//        }
        var $list = dom.multiPlayerGamesList;
        $list.empty(); // remove old options
        var isDisabled = false;
        for (var i = 0; i < roomList.length; i++) {
            if (roomList[i].roomStatus == "running" || roomList[i].roomStatus == "starting") {
                isDisabled = true;
                if (multiPlayer.selectedRomNum == i) {
                    multiPlayer.selectedRomNum = 0;
                }
            } else {
                isDisabled = false;
            }
            var key = roomList[i].roomName + this.statusMessages[roomList[i].roomStatus];
            $list.append($("<option></option>").prop("disabled", roomList[i].roomStatus == "running" || roomList[i].roomStatus == "starting").prop("value", (i + 1)).text(key).addClass(roomList[i].roomStatus).prop("selected", false));
        }
        //keep selected, must verify by server as room number
        if (multiPlayer.selectedRomNum != 0) {
            dom.multiPlayerGamesList.val(multiPlayer.selectedRomNum).prop('selected', true);
        }
    },
    /*************--Socket Handling--*******************/
    /**send message to server**/
    sendSocketMessage: function (data) {
        multiPlayer.socket.emit(data.type, JSON.stringify(data));
    },
    /**Receive message from server according to message**/
    receiveSocketMessage: function (message) {
        multiPlayer.socket.on(message, function (data) {
            multiPlayer.handleSocketMessage(data);
        });
    },
    /**handle game request**/
    handleSocketMessage: function (message) {
        var messageObject = JSON.parse(message);
        switch (messageObject.type) {
            case socketTag.rooms:
                multiPlayer.updateRoomStatus(messageObject);
                multiPlayer.joinedMaxPlayer = messageObject.joinedMaxPlayer;
//                if (messageObject.reactivate) {
//                    document.getElementById('multiPlayerGamesList').removeAttribute('disabled');
//                    document.getElementById('multiPlayerJoin').removeAttribute('disabled');
//                }
                break;
        }
    }
}