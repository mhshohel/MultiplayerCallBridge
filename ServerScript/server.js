var port = process.env.port || 8000,
    util = require("util"), // Utility resources (logging, object inspection, etc)
    app = require('http').createServer(handler),
    io = require('socket.io').listen(app.listen(port)),
    Player = require("./Player").Player,
    socketTag = {
        command: {
            connection: "connection"
        },
        action: {
            toClient: "toClient",
            toAll: "toAll"
        },
        request: {
            rooms: "room_list",
            joinRoom: "join_room"
        }
    },
    gameStatus = {
        empty: "empty",
        waiting: "waiting",
        starting: "starting",
        running: "running"
    },
    socket, roomSize = 15, maxPlayerEachRoom = 4,
//initialize game room
//starting: Game Starting, running: Game in Progress, waiting: Awaiting second player,
//empty: Open
    gameRooms = [];
for (var i = 0; i < roomSize; i++) {
    gameRooms.push({
        //room id or num starts from 0
        roomId: i,
        roomName: ("Game " + (i + 1) + ". "),
        status: gameStatus.empty,
        players: [],
        requestCounter: 0,
        currentTurn: undefined,
        reset: function () {
            this.status = gameStatus.empty;
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

//Game Initialisation
function init() {
    //setup Socket.IO to listing on default port 8000
    socket = io.sockets;
    //configure Socket.IO
    io.configure(function () {
        //only websockets not supported by Azure
        //io.set('transports', ['websocket']);
        //others
        io.set('transports', ['xhr-polling', 'jsonp-polling', 'htmlfile']);
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
    // open the socket connection
    socket.on(socketTag.command.connection, function (client) {
        //send user game room information
//        onUpdateRoom(false);
        client.on(socketTag.request.rooms, onRequestGameRoomList);
//        client.on(socketTag.joinRoom, onClientJoinInGameRoom);
//        client.on('update_room', onUpdateRoom);
//        client.on('cancel_room', onClientLeftGameRoom);
//        client.on('disconnect', onClientDisconnect);
    });
}

//return game room list
function onRequestGameRoomList(data) {
    //action could be "first", means it will send data to the requested clients, otherwise to all clients
    var action = (JSON.parse(data)).action;
    onUpdateRoom(action, this, false);
}

//update all users room
function onUpdateRoom(action, client, reactivate, disconnectedRoomId, message) {
    if (action == socketTag.action.toClient) {
        client.emit(socketTag.request.rooms, sendGameListToClient(reactivate, disconnectedRoomId, message));
    } else if (action == socketTag.action.toAll) {
        socket.emit(socketTag.request.rooms, sendGameListToClient(reactivate, disconnectedRoomId, message));
    }
}

//add client information to the room
function onClientJoinInGameRoom(data) {
    var message = JSON.parse(data);
//    handleRoom(message, this);
//    onUpdateRoom(false);
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
}

//send error message if someone try to change game
function onError(id) {
    onUpdateRoom(true, id, "Connection Error! Do no try to modify game content until you change the code for both players.");
}

//initialize game
function initGame(id) {
//    gameRooms[id].status = gameStatus.running;
//    for (var i = 0; i < gameRooms[id].players.length; i++) {
//        gameRooms[id].players[i].getClient().emit("init_game", JSON.stringify({type: 'init_game', roomId: id}));
//    }
}

//add client information to the room
function onClientLeftGameRoom(data) {
//    var message = JSON.parse(data);
//    var room = gameRooms[message.roomId];
//    if (message.flag == 'gameover') {
//        room.requestCounter++;
//        //if game over then get request from both player to remove game from server
//        if (room.requestCounter == 2) {
//            resetGameRoom(message.roomId);
//            onUpdateRoom(true);
//        }
//    } else {
//        resetGameRoom(message.roomId);
//        onUpdateRoom(true);
//    }
}

//client disconnect
function onClientDisconnect() {
//    var players;
//    for (var i = 0; i < gameRooms.length; i++) {
//        players = gameRooms[i].players;
//        for (var j = 0; j < players.length; j++) {
//            if (players[j].getId() == this.id) {
//                resetGameRoom(i);
//                onUpdateRoom(true, gameRooms[i].roomId - 1, "Connection Error! Your opponent disconnected from server.");
//                break;
//            }
//        }
//    }
}

function handleRoom(message, clientObject) {
    var gameRoom = gameRooms[message.roomId];
    switch (gameRoom.status) {
        //both player slots are empty
        case gameStatus.empty:
            gameRoom.players.push(new Player(clientObject, 1));
            gameRoom.status = gameStatus.waiting;
            break;
        //at least one player slot is empty, mostly playerOne
        case gameStatus.waiting:
            gameRoom.players.push(new Player(clientObject, 2));
            if (gameRoom.players.length == 2) {
                gameRoom.status = gameStatus.starting;
            }
            break;
        //waiting to run
        case gameStatus.starting:
            if (gameRoom.players.length == maxPlayerEachRoom) {
                gameRoom.status = gameStatus.running;
            }
            break;
        //run game
        case gameStatus.running:
            break;
    }
}

//send room list to the client
function sendGameListToClient(reactivate, disconnectedRoomId, errorMessage) {
    var roomList = [];
    var hasMaxPlayer = false;
    for (var i = 0; i < gameRooms.length; i++) {
        roomList.push({roomId: gameRooms[i].roomId, roomName: gameRooms[i].roomName, roomStatus: gameRooms[i].status});
        if (gameRooms[i].players.length == 4) {
            hasMaxPlayer = true;
        }
    }
    return JSON.stringify({type: socketTag.request.rooms, roomList: roomList, reactivate: reactivate, disconnectedRoomId: disconnectedRoomId, joinedMaxPlayer: hasMaxPlayer, errorMessage: errorMessage});
}

init();