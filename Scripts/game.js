var game;
game = {
    allcards: [],
    init: function () {
        loader.init();
        mouse.init();
        game.gameCanvas = document.getElementById("gameCanvas");
        game.gameContext = game.gameCanvas.getContext("2d");
        //initialize canvas width and height
        game.canvasWidth = 1020;
        game.canvasHeight = 760;
        game.gameCanvas.width = game.canvasWidth;
        game.gameCanvas.height = game.canvasHeight;
        game.boardWidth = game.boardHeight = 600;
    },
    play: function () {
        //reset everything
        game.displayAllCards();

    },
    stop: function () {
        //back to normal and reset then show main
    },
    reset: function () {

    },
    clearCanvas: function () {

    },
    clearBoard: function () {

    },
    drawScene: function () {

    },
    setEventHandlers: function () {

    },
    clearTriggers: function () {

    },
    //an extra test funtion to check if all card are correct
    displayAllCards: function () {
        console.log(game.allcards);
        //reset everything
        $("#gameCanvas").show('fast');
        var x, y = 120, c = 0;
        for (var i = 1; i <= 4; i++) {
            x = 0;
            for (var j = 0; j < 13; j++) {
                game.allcards[c].draw(x, y);
                x += 70;
                c++;
            }
            y += 100;
        }
        game.allcards[52].draw(0, 10);
    }
};