var game;
game = (function () {
    var allcards = [], initialized = false, gameCanvas, gameContext, canvasWidth, canvasHeight, boardWidth, boardHeight, padding,
    //initialize canvas and other required game attributes.
        init = function () {
            if (!initialized) {
                try {
                    loader.init();
                } catch (err) {
                    throw new Error(err);
                }
                gameCanvas = document.getElementById("gameCanvas");
                gameContext = gameCanvas.getContext("2d");
                //initialize canvas width and height
                canvasWidth = 1020;
                canvasHeight = 760;
                gameCanvas.width = canvasWidth;
                gameCanvas.height = canvasHeight;
                boardWidth = boardHeight = 720;
                padding = 20;
            }
            initialized = true;
        },
        play = function () {
            if (initialized) {
                //game.displayAllCards();
                common.hideGameMenu();
                dom.canvas.show();
                //setInterval(function () {
                drawScene();
                //}, 30);
                //reset everything
                //game.displayAllCards();
            }
        }      ,
        stop = function () {
            //back to normal and reset then show main
        },
    //reset all required game attributes and events.
        reset = function () {
            dom.canvas.off('click');
        },
        clearCanvas = function () {
            gameContext.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
        },
        clearBoard = function () {
            gameContext.clearRect(0, 0, game.boardWidth, game.boardHeight);
        },
    //draw animation, main function to create canvas elements
        drawScene = function () {
            clearCanvas();
            clearBoard();
            drawBoard();
            //verify cards available otherwise no, and after each click off click event, in next draw it should active, or create flag if animated
            dom.canvas.on('click', onMouseClick);
            //Players Cards On Board
            var pcob = {
                "0": {x: 150, y: 635, t: 0},//local user
                "1": {x: 140, y: 235, t: 939},//right
                "2": {x: 150, y: 55, t: 0},//top
                "3": {x: 140, y: 374, t: 500}//left
            }
            for (var i = 0; i < 4; i++) {
                var translate = function () {
                    gameContext.translate(pcob[i].t, 0);
                    gameContext.rotate(Math.PI / 2);
                }
                if (i == 1 || i == 3) {
                    gameContext.save();
                    translate();
                } else if (i == 2) {
                    gameContext.restore();
                }
                for (var j = 0; j < 13; j++) {
                    if (i == 0) {
                        allcards[j].draw(pcob[i].x, pcob[i].y);
                    } else {
                        allcards[allcards.length - 1].draw(pcob[i].x, pcob[i].y);
                    }
                    pcob[i].x += 35; //overlap card on another
                }
            }
            gameContext.restore();
        },
    //draw essential board strucktures
        drawBoard = function () {
            gameContext.fillStyle = "#339966";
            gameContext.fillRect(padding, padding, boardWidth, boardHeight);
            gameContext.save();
            //Draw lines
            (function () {
                var linePos = {
                    "0": {move: {x: 148, y: 705}, line: {x: 619, y: 705}},//buttom
                    "1": {move: {x: 705, y: 140}, line: {x: 705, y: 608}},//right
                    "2": {move: {x: 619, y: 55}, line: {x: 148, y: 55}},//top
                    "3": {move: {x: 55, y: 140}, line: {x: 55, y: 608}}//left
                }
                gameContext.lineWidth = 5;
                gameContext.strokeStyle = '#FFCC00';
                gameContext.lineCap = 'round';
                for (var i = 0; i < 4; i++) {
                    gameContext.beginPath();
                    gameContext.moveTo(linePos[i].move.x, linePos[i].move.y);
                    gameContext.lineTo(linePos[i].line.x, linePos[i].line.y);
                    gameContext.stroke();
                }
            })();
            gameContext.restore();
        },
        drawImage = function (image, sx, sy, sw, sh, x, y, posX, posY) {
            if (initialized) {
                gameContext.drawImage(image, sx, sy, sw, sh, x, y, posX, posY);
            }
        },
        onMouseClick = function (e) {
            var mouseX = e.layerX || 0;
            var mouseY = e.layerY || 0;
            //for updated jquery version: 1.7+
            if (e.originalEvent.layerX) {
                mouseX = e.originalEvent.layerX;
                mouseY = e.originalEvent.layerY;
            }
            console.log(mouseX + "   " + mouseY);
        },
        clearTriggers = function () {

        },
    //an extra test funtion to check if all card are correct
        displayAllCards = function () {
            console.log(allcards);
            //reset everything
            common.hideGameMenu();
            dom.canvas.show();
            var x, y = 120, c = 0;
            for (var i = 1; i <= 1; i++) {
                x = 0;
                for (var j = 0; j < 13; j++) {
                    allcards[c].draw(x, y);
                    x += 52;
                    c++;
                }
                y += 100;
            }
            allcards[52].draw(0, 10);
        }
    return {
        allcards: allcards,
        init: init,
        play: play,
        drawImage: drawImage
    }
})
    ();