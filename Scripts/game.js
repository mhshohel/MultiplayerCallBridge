var game;
game = {
    allcards: [],
    //initialize canvas and other required game attributes.
    init: function () {
        loader.init();
        game.gameCanvas = document.getElementById("gameCanvas");
        game.gameContext = game.gameCanvas.getContext("2d");
        //initialize canvas width and height
        game.canvasWidth = 1020;
        game.canvasHeight = 760;
        game.gameCanvas.width = game.canvasWidth;
        game.gameCanvas.height = game.canvasHeight;
        game.boardWidth = game.boardHeight = 720;
        game.padding = 20;
        //space between background canvas and board in Top,Right,Bottom,Left
        game.reset();
    },
    play: function () {
        //game.displayAllCards();
        common.hideGameMenu();
        $("#gameCanvas").show();
        //setInterval(function () {
            game.drawScene();
        //}, 30);
        //reset everything
        //game.displayAllCards();

    },
    stop: function () {
        //back to normal and reset then show main
    },
    //reset all required game attributes and events.
    reset: function () {
        dom.canvas.off('click');
    },
    clearCanvas: function () {
        game.gameContext.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
    },
    clearBoard: function () {
        game.gameContext.clearRect(0, 0, game.boardWidth, game.boardHeight);
    },
    //draw animation, main function to create canvas elements
    drawScene: function () {
        game.clearCanvas();
        game.clearBoard();
        game.drawBoard();
        //verify cards available otherwise no, and after each click off click event, in next draw it should active, or create flag if animated
        dom.canvas.on('click', game.onMouseClick);
        //user cards
        (function () {
            var x, y = 635, c = 0;
            x = 55;
            for (var j = 0; j < 13; j++) {
                game.allcards[c].draw(x, y);
                x += 49;
                c++;
            }
        }());
        game.gameContext.save();
        //right user cards
        (function () {
            var x, y = 235, c = 0;
            x = 140;
            game.gameContext.translate(939, 0);
            game.gameContext.rotate(Math.PI / 2);
            for (var j = 0; j < 13; j++) {
                game.allcards[game.allcards.length - 1].draw(x, y);
                x += 35;
                c++;
            }
        }());

        game.gameContext.restore();
        //top user cards
        (function () {
            var x, y = 55, c = 0;
            x = 150;
            for (var j = 0; j < 13; j++) {
                game.allcards[game.allcards.length - 1].draw(x, y);
                x += 35;
                c++;
            }
        }());

        game.gameContext.save();
        //left user cards
        (function () {
            var x, y = 374, c = 0;
            x = 140;
            game.gameContext.translate(500, 0);
            game.gameContext.rotate(Math.PI / 2);
            for (var j = 0; j < 13; j++) {
                game.allcards[game.allcards.length - 1].draw(x, y);
                x += 35;
                c++;
            }
        }());
        game.gameContext.restore();
    },
    //draw essential board strucktures
    drawBoard: function () {
        game.gameContext.fillStyle = "#339966";
        game.gameContext.fillRect(game.padding, game.padding, game.boardWidth, game.boardHeight);
        //Local User
        game.gameContext.beginPath();
        game.gameContext.moveTo(55, 705);
        game.gameContext.lineTo(691, 705);
        game.gameContext.lineWidth = 5;
        game.gameContext.strokeStyle = '#FFCC00';
        game.gameContext.lineCap = 'round';
        game.gameContext.stroke();
        //Right side user
        game.gameContext.beginPath();
        game.gameContext.moveTo(705, 140);
        game.gameContext.lineTo(705, 608);
        game.gameContext.lineWidth = 5;
        game.gameContext.strokeStyle = '#FFCC00';
        game.gameContext.lineCap = 'round';
        game.gameContext.stroke();

        //top side user
        game.gameContext.beginPath();
        game.gameContext.moveTo(618, 55);
        game.gameContext.lineTo(148, 55);
        game.gameContext.lineWidth = 5;
        game.gameContext.strokeStyle = '#FFCC00';
        game.gameContext.lineCap = 'round';
        game.gameContext.stroke();

        //left side user
        game.gameContext.beginPath();
        game.gameContext.moveTo(55, 140);
        game.gameContext.lineTo(55, 608);
        game.gameContext.lineWidth = 5;
        game.gameContext.strokeStyle = '#FFCC00';
        game.gameContext.lineCap = 'round';
        game.gameContext.stroke();
    },
    onMouseClick: function (e) {
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;
        //for updated jquery version: 1.7+
        if (e.originalEvent.layerX) {
            mouseX = e.originalEvent.layerX;
            mouseY = e.originalEvent.layerY;
        }
        console.log(mouseX + "   " + mouseY);
    },
    clearTriggers: function () {

    },
    //an extra test funtion to check if all card are correct
    displayAllCards: function () {
        console.log(game.allcards);
        //reset everything
        common.hideGameMenu();
        $("#gameCanvas").show();
        var x, y = 120, c = 0;
        for (var i = 1; i <= 1; i++) {
            x = 0;
            for (var j = 0; j < 13; j++) {
                game.allcards[c].draw(x, y);
                x += 52;
                c++;
            }
            y += 100;
        }
        game.allcards[52].draw(0, 10);
    }
};