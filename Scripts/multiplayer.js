var multiPlayer = {
    socket: undefined,
    start: function () {

    },
    startGame: function () {

    },
    statusScreen: function (title, subTitle, buttonText) {

    },
    play: function () {

    },
    join: function () {

    },
    cancel: function () {

    },
//Receive message from server according to message
    receiveSocketMessage: function (message) {
        multiPlayer.socket.on(message, function (data) {
            multiPlayer.handleSocketMessage(data);
        });
    },
//send message to server
    sendSocketMessage: function (data) {
        multiPlayer.socket.emit(data.type, JSON.stringify(data));
    },
//handle game request
    handleSocketMessage: function (message) {
        var messageObject = JSON.parse(message);
        switch (messageObject.type) {
            case "getScore":
                break;
            case "room_list":
                break;
            case 'init_game':
                break;
            case 'timer':
                break;
            case 'gameover':
                break;
        }
    },
    statusMessages: {
        'starting': 'Game Starting',
        'running': 'Game in Progress',
        'waiting': 'Awaiting second player',
        'empty': 'Open'
    },
    updateRoomStatus: function (messageObject) {

    },
    endGame: function (cause, onOk, onClose) {

    },
    levelCompleteScreen: function () {

    },
    //Game over screen
    gameOverScreen: function () {

    }
}