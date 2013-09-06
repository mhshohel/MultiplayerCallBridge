var multiPlayer = {
    socket: undefined,
    /**Init before play game**/
    start: function () {
        this.play();
    },
    startGame: function () {

    },
    statusScreen: function (title, subTitle, buttonText) {

    },
    play: function () {
        game.newGame();

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
            game.pushLeftPlayersCards(lx, 374, w, h, game.allcards[game.allcards.length - 1], 500);
            rx += w;
            tx += w;
            lx += w;
        }

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