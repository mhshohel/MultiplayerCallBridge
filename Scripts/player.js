var Player;
Player = function (name, hostNum, clientId, gameRoomNumber) {
    var cards = [];
    return{
        getCards: cards,
        emptyPlayerCards: function () {
            cards = [];
        },
        name: name

    }
}