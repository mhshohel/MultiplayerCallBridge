var multiPlayer = {
    socket: undefined,
    start: function () {
        this.play();
    },
    startGame: function () {

    },
    statusScreen: function (title, subTitle, buttonText) {

    },
    play: function () {
        game.newGame();
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

        if (isAvailable) {
            game.play();
        } else {
            //show error message as don't change code...
        }
    },
    join: function () {

    },
    cancel: function () {

    }
}