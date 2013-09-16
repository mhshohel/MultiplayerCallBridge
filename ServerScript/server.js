var port = process.env.port || 8000,
    util = require("util"), // Utility resources (logging, object inspection, etc)
    app = require('http').createServer(handler),
    io = require('socket.io').listen(app.listen(port)),
    Player = require("./Player").Player,
    socketTag = {
        command: {
            connection: 'connection',
            disconnect: 'disconnect'
        },
        action: {
            toClient: "toClient",
            toRoomClients: "toRoomClients",
            toAll: "toAll"
        },
        request: {
            rooms: "room_list",
            joinRoom: "join_room",
            onError: "onError",
            onCancel: "onCancel"
        },
        messageType: {
            error: "error",
            info: "info",
            pause: "pause"
        }
    },
    gameStatus = {
        empty: "empty",
        waiting: "waiting",
        starting: "starting",
        running: "running"
    },
    messageToSend = {
        nameRequired: "Please enter your name.",
        nameLength: "Name should be at least 5 character long.",
        roomNotSelected: "Please select a game room.",
        roomAlreadyJoined: "You are already in another room.",
        notInSelectedRoom: "You are not joined in the selected room.",
        maxPlayerInRoom: "Maximum player joined in the selected room.",
        default: "Please do not try to change the game contents."
    },
    socket, roomSize = 15, maxPlayerEachRoom = 4,
    /**initialize game room
     *starting: Game Starting, running: Game in Progress, waiting: Awaiting second player,empty: Open**/
        gameRooms = [];
for (var i = 0; i < roomSize; i++) {
    gameRooms.push({
        //room id or num starts from 0
        roomId: i,
        roomName: ("Game " + (i + 1) + ". "),
        isRunning: false,
        status: gameStatus.empty,
        statusMessage: "Open",
        players: [],
        requestCounter: 0,
        currentTurn: undefined,
        reset: function () {
            this.isRunning = false;
            this.status = gameStatus.empty;
            this.statusMessage = "Open";
            this.players = [];
            this.requestCounter = 0;
            this.currentTurn = undefined;
        }
    });
}

function handler(req, res) {
    res.writeHead(200);
    res.end('Socket.IO connected on port: ' + port);
    util.log('Socket.IO connected on port: ' + port);
}

/**Game Initialisation**/
function init() {
    //setup Socket.IO to listing on default port 8000
    socket = io.sockets;
    //configure Socket.IO
    io.configure(function () {
        //currently(aug. 2013) websockets is not supported by Azure
        //io.set('transports', ['websocket']);
        //others are ['xhr-polling', 'jsonp-polling', 'htmlfile']
        io.set('transports', ['xhr-polling']);
        // Restrict log output
        //The amount of detail that the server should output to the logger.
        //0 - error, 1 - warn, 2 - info, 3 - debug
        io.set("log level", 3);
        //The maximum duration of one HTTP poll, if it exceeds this limit it will be closed.
        //use if transports are: xhr-polling, jsonp-polling
        io.set("polling duration", 10);
    });

    //setup all events
    setEventHandelers();
}

function setEventHandelers() {
    try {
        // open the socket connection
        socket.on(socketTag.command.connection, function (client) {
            client.on(socketTag.command.disconnect, onClientDisconnect);
            client.on(socketTag.request.rooms, onRequestGameRoomList);
            client.on(socketTag.request.joinRoom, onClientJoinInGameRoom);
            client.on(socketTag.request.onCancel, onClientLeftGameRoom);
//        client.on('update_room', onUpdateRoom);
//        client.on('cancel_room', onClientLeftGameRoom);
//        client.on('disconnect', onClientDisconnect);
        });
    } catch (err) {
    }
}

/**return game room list**/
function onRequestGameRoomList(data) {
    try {
        //action could be "first", means it will send data to the requested clients, otherwise to all clients
        var action = (JSON.parse(data)).action;
        try {
            onUpdateRoom(action, this, false);
        } catch (e) {
        }
    } catch (err) {
    }
}

/**update all users room**/
function onUpdateRoom(action, client, reactivate, disconnectedRoomId, message) {
    try {
        if (action == socketTag.action.toClient) {
            client.emit(socketTag.request.rooms, sendGameListToClient(reactivate, disconnectedRoomId, message));
        } else if (action == socketTag.action.toRoomClients) {
            //send to rooms user...
        } else if (action == socketTag.action.toAll) {
            socket.emit(socketTag.request.rooms, sendGameListToClient(reactivate, disconnectedRoomId, message));
        }
    } catch (err) {
    }
}

/**add client information to the room**/
function onClientJoinInGameRoom(data) {
    try {
        var message = JSON.parse(data);
        if (message.name == undefined || message.name == "") {
            onError(this, messageToSend.nameRequired, messageToSend.default, socketTag.messageType.error);
        } else if (message.name.trim().length < 5) {
            onError(this, messageToSend.nameLength, messageToSend.default, socketTag.messageType.error);
        } else if (message.roomId == undefined) {
            onError(this, messageToSend.roomNotSelected, messageToSend.default, socketTag.messageType.error);
        } else {
            var hasPlayer = alreadyInGameRoom(this.id);
            if (gameRooms[message.roomId].players.length != maxPlayerEachRoom && !hasPlayer) {
                handleRoom(message, this);
                try {
                    onUpdateRoom(socketTag.action.toAll, this, false);
                } catch (e) {
                }
            } else {
                if (hasPlayer) {
                    try {
                        onError(this, messageToSend.roomAlreadyJoined, messageToSend.default, socketTag.messageType.error);
                    } catch (e) {
                    }
                } else {
                    try {
                        onError(this, messageToSend.maxPlayerInRoom, messageToSend.default, socketTag.messageType.error);
                    } catch (e) {
                    }
                }
            }
        }
//    var room = gameRooms[message.roomId];
//    if (room.foodLength == 0 && room.boardHeight == 0 && room.boardWidth == 0 && room.contentSize == 0 && room.space == 0) {
//        room.foodLength = message.foodLength;
//        room.boardHeight = message.boardHeight;
//        room.boardWidth = message.boardWidth;
//        room.contentSize = message.contentSize;
//        room.space = message.space;
//    } else {
//        if (room.foodLength != message.foodLength || room.boardHeight != message.boardHeight || room.boardWidth != message.boardWidth || room.contentSize != message.contentSize || room.space != message.space) {
//            resetGameRoom(message.roomId);
//            onError(message.roomId);
//        }
//    }
        //if two players join in the room then game will start
//    if (gameRooms[message.roomId].players.length == maxPlayerEachRoom) {
//        initGame(message.roomId);
//    }
    } catch (err) {
    }
}

/**return tru or false if client id is already in the room**/
function alreadyInGameRoom(id) {
    try {
        for (var i = 0; i < gameRooms.length; i++) {
            var players = gameRooms[i].players;
            for (var j = 0; j < players.length; j++) {
                if (players[j].getId == id) {
                    return true;
                }
            }
        }
        return false;
    } catch (err) {
    }
}

/**send error message if someone try to change game**/
function onError(client, messageOne, messageTwo, messageType) {
    try {
        var message = JSON.stringify({type: socketTag.request.onError, messageOne: messageOne, messageTwo: messageTwo, messageType: messageType});
        if (client != undefined) {
            client.emit(socketTag.request.onError, message);
        }
        else {
            socket.emit(socketTag.request.onError, message);
        }
    } catch (err) {
    }
}

/**initialize game**/
function initGame(id) {
//    gameRooms[id].status = gameStatus.running;
//    for (var i = 0; i < gameRooms[id].players.length; i++) {
//        gameRooms[id].players[i].getClient().emit("init_game", JSON.stringify({type: 'init_game', roomId: id}));
//    }
}

/**add client information to the room**/
function onClientLeftGameRoom(data) {
    try {
        var message = JSON.parse(data),
            room = gameRooms[message.roomId];
        if (room != undefined) {
            onClientDisconnect(this, room);
        } else {
            onError(this, messageToSend.notInSelectedRoom, messageToSend.default, socketTag.messageType.error);
        }
    } catch (err) {
    }
}

/**client disconnect
 * use io.connect('http://localhost:8000', {'sync disconnect on unload': true, 'sync disconnect on pagehide ': true}
 * in client side to detect disconnect immediately, otherwise have to wait till heartbeat time (pagehide os for IOS support);
 * WARNING: The solution is probably to fix socket.io-client to listen for both unload and pagehide events, because the unload event may not work as expected for back and forward optimization (IOS)**/
function onClientDisconnect(object, room) {
    try {
        //if game status is not running then remove player otherwise keep cards info only change client
        //send as disconnection and if game is running then pause game otherwise hold
        var players = undefined,
            haveTo = [
                {update: false, pause: false}
            ],//make sure everything is going perfect without crash
        //true if client id and players in the room's id matched with each other
            matched = false,
            disconnected = function (room) {
                //if game is running then send message to all clients of that room to pause game
                if (players.length == 1) {
                    room.reset();
                    haveTo.update = true;
                } else if (players.length < maxPlayerEachRoom) {
                    players.splice(j, 1);
                    haveTo.update = true;
                    setGameRoomStatus(room);
                } else if (players.length == maxPlayerEachRoom) {
                    players.splice(j, 1);
                    haveTo.update = true;
                    setGameRoomStatus(room);
                }
                haveTo.pause = (room.isRunning) ? true : false;
                if (haveTo.update) {
                    try {
                        onUpdateRoom(socketTag.action.toAll, this);
                    } catch (e) {
                    }
                }
                if (haveTo.pause) {
                    //pause other players
                    try {
                        onUpdateRoom(socketTag.action.toRoomClients, room);
                        onError(room, messageToSend.maxPlayerInRoom, messageToSend.default, socketTag.messageType.pause);
                    } catch (e) {
                    }
                } else {
                    try {
                        onError(this, messageToSend.maxPlayerInRoom, messageToSend.default, socketTag.messageType.info);
                    } catch (e) {
                    }
                }
            }
        //if room pram is in first place then it contains "booted" if undefined, though this function has data as first param
        if (room == undefined || room == "booted") {
            for (var i = 0; i < gameRooms.length; i++) {
                players = gameRooms[i].players;
                for (var j = 0; j < players.length; j++) {
                    if (players[j].getId == this.id) {
                        matched = true;
                        object = this;
                        disconnected(gameRooms[i]);
                        break;
                    }
                }
            }
        } else {
            //use below code if player left the room
            players = room.players;
            for (var j = 0; j < players.length; j++) {
                if (players[j].getId == object.id) {
                    matched = true;
                    disconnected(room);
                    break;
                }
            }
        }
        if (!matched) {
            onError(object, messageToSend.notInSelectedRoom, messageToSend.default, socketTag.messageType.error);
        }
    } catch (err) {
    }
}

/**Handle game room according to the current room status**/
function handleRoom(message, clientObject) {
    try {
        var gameRoom = gameRooms[message.roomId],
            name = message.name;
        for (var i = 0; i < gameRoom.players.length; i++) {
            if (name == gameRoom.players[i].getClientName) {
                //add extra value if duplicate name found
                name = name + "_" + gameRoom.players.length;
                break;
            }
        }
        switch (gameRoom.status) {
            //both player slots are empty
            case gameStatus.empty:
                gameRoom.players.push(new Player(name, clientObject, 1));
                gameRoom.status = gameStatus.waiting;
                setGameRoomStatus(gameRoom);
                break;
            //at least one player slot is empty, mostly playerOne
            case gameStatus.waiting:
                if (gameRoom.players.length != maxPlayerEachRoom) {
                    gameRoom.players.push(new Player(name, clientObject, 2));
                    setGameRoomStatus(gameRoom);
                } else {
                    try {
                        onError(clientObject, messageToSend.maxPlayerInRoom, messageToSend.default, socketTag.messageType.error);
                    } catch (e) {
                    }
                }
                break;
            //waiting to run
            case gameStatus.starting:
                if (gameRoom.players.length == maxPlayerEachRoom) {
                    gameRoom.status = gameStatus.running;
                    gameRoom.statusMessage = "Game is running";
                }
                break;
            //run game
            case gameStatus.running:
                break;
        }
    } catch (err) {
    }
}

/**Set status message of game room**/
function setGameRoomStatus(gameRoom) {
    try {
        if (gameRoom.players.length == 1) {
            gameRoom.statusMessage = "Awaiting for second player";
        } else if (gameRoom.players.length == 2) {
            gameRoom.statusMessage = "Awaiting for third player";
        } else if (gameRoom.players.length == 3) {
            gameRoom.statusMessage = "Awaiting for forth player";
        } else if (gameRoom.players.length == maxPlayerEachRoom) {
            gameRoom.status = gameStatus.starting;
            gameRoom.statusMessage = "Game starting";
        }
    } catch (err) {
    }
}

/**send room list to the client**/
function sendGameListToClient(reactivate, disconnectedRoomId, errorMessage) {
    try {
        var roomList = [];
        var hasMaxPlayer = false;
        for (var i = 0; i < gameRooms.length; i++) {
            roomList.push({roomId: gameRooms[i].roomId, roomName: gameRooms[i].roomName, roomStatus: gameRooms[i].status, roomStatusMessage: gameRooms[i].statusMessage});
            if (gameRooms[i].players.length == 4) {
                hasMaxPlayer = true;
            }
        }
        return JSON.stringify({type: socketTag.request.rooms, roomList: roomList, reactivate: reactivate, disconnectedRoomId: disconnectedRoomId, joinedMaxPlayer: hasMaxPlayer, errorMessage: errorMessage});
    } catch (err) {
    }
}

init();