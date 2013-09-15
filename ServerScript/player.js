var Player = function (name, clientInfo, hostNum) {
    var score = 0,
        clientName = name,
        client = clientInfo,
        host = hostNum,
        id = clientInfo.id,
//        getClient = function () {
//            return client;
//        },
//        getId = function () {
//            return id;
//        },
        addScore = function (scr) {
            score += scr;
        },
        getScore = function () {
            return score;
        };
    // Define which variables and methods can be accessed
    return {
        getClientName: clientName,
        getClient: client,
        getId: id,
        host: host,
        getScore: getScore,
        addScore: addScore
    }
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;