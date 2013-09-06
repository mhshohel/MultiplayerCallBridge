var game;
game = (function () {
    var allcards = [], initialized = false, gameRunning = false, cardsOnBoard = false,
        gameCanvas, gameContext, canvasWidth, canvasHeight, boardWidth, boardHeight, padding, round = 0, cardAnimationInterval = undefined, isAnimated = false,
        /**Insert them in Player**/
            localPlayer, rightPlayer, topPlayer, leftPlayer,
        /**initialize canvas and other required game attributes.**/
            init = function () {
            if (!initialized) {
                try {
                    loader.init();
                } catch (err) {
                    throw new Error("Error in game.init()???loader.init(): " + err.message);
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
        /**reset all required game attributes and events.**/
            reset = function () {
            dom.canvas.off('click');
            gameRunning = false;
            cardsOnBoard = false;
            localPlayer = undefined;
            rightPlayer = undefined;
            topPlayer = undefined;
            leftPlayer = undefined;
            round = 0;  // take it from server
        },
        /**before play must use new game function**/
            newGame = function () {
            if (initialized) {
                //reset all values
                reset();
                //create player, local, right, top, left
                initPlayers();
            }
        },
        /**PLAY the game**/
            play = function () {
            if (initialized) {
                //game.displayAllCards();
                gameRunning = true;
                common.hideGameMenu();
                //show canvas within a sec. decide whether it will come from server or not to hide
                common.showGameStatus("Round: " + round, "shohel shamim");
                setTimeout(function () {
                    common.hideGameStatus();
                    dom.canvas.show();
                    drawScene();
                }, 1000);
                //dom.canvas.show();

                //drawScene();

                //game.displayAllCards();
            }
        },
        /**Initialize players**/
            initPlayers = function () {
            localPlayer = new Player(true);
            rightPlayer = new Player(false);
            topPlayer = new Player(false);
            leftPlayer = new Player(false);
        },
        stop = function () {
            //back to normal and reset then show main
        },
        /**Clear whole canvas before redraw**/
            clearCanvas = function () {
            gameContext.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
        },
        /**Clear board**/
            clearBoard = function () {
            //recheck it by hide it to verify whether game works without it or not
            gameContext.clearRect(0, 0, game.boardWidth, game.boardHeight);
        },
        /**draw animation, main function to create canvas elements**/
            drawScene = function () {
            clearCanvas();
            clearBoard();
            drawBoard();
            //verify cards available otherwise no, and after each click off click event, in next draw it should active, or create flag if animated
            drawCards();
            if (!isAnimated) {
                clearInterval(cardAnimationInterval);
                cardAnimationInterval = undefined;
                dom.canvas.on('click', onMouseClick);
            }
        },
        /**Draw cards according to players card list**/
            drawCards = function () {
            var translate = function (t) {
                gameContext.translate(t, 0);
                gameContext.rotate(Math.PI / 2);
            }
            var localPlayerCards = localPlayer.getCards(),
                rightPlayerCards = rightPlayer.getCards(),
                topPlayerCards = topPlayer.getCards(),
                leftPlayerCards = leftPlayer.getCards();
            for (var j = 0; j < 13; j++) {
                if (localPlayerCards.length == 0 && rightPlayerCards.length == 0 && topPlayerCards.length == 0 && leftPlayerCards.length == 0) {
                    //show message or something...
                    console.log("Empty cards...");
                    break;
                } else if (localPlayerCards[j] != undefined) {
                    localPlayerCards[j].card.draw(localPlayerCards[j].x, localPlayerCards[j].y);
                    topPlayerCards[j].card.draw(topPlayerCards[j].x, topPlayerCards[j].y);
                    gameContext.save();
                    translate(rightPlayerCards[j].t);
                    rightPlayerCards[j].card.draw(rightPlayerCards[j].x, rightPlayerCards[j].y);
                    gameContext.restore();
                    gameContext.save();
                    translate(leftPlayerCards[j].t);
                    leftPlayerCards[j].card.draw(leftPlayerCards[j].x, leftPlayerCards[j].y);
                    gameContext.restore();

                    //translate(leftPlayerCards[j].t);
                    //leftPlayerCards[j].card.draw(leftPlayerCards[j].x, leftPlayerCards[j].y);
                }
            }
        },
        /**draw essential board strucktures**/
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

            //-------------------Draw Lines----------------------//
            /* vertical lines */
            for (var x = 20; x <= 740; x += 80) {
                gameContext.moveTo(0.5 + x, 20);
                gameContext.lineTo(0.5 + x, 740);
            }

            /* horizontal lines */
            for (var y = 20; y <= 740; y += 80) {
                gameContext.moveTo(20, 0.5 + y);
                gameContext.lineTo(740, 0.5 + y);
            }

            /* draw it! */
            gameContext.strokeStyle = "#ccc";
            gameContext.stroke();
            //----------------------------------------------------//
        },
        /**Draw cards images**/
            drawImage = function (image, sx, sy, sw, sh, x, y, posX, posY) {
            if (initialized) {
                gameContext.drawImage(image, sx, sy, sw, sh, x, y, posX, posY);
            }
        },
        /**Mouse events**/
            onMouseClick = function (e) {
            var mouseX;
            var mouseY;
            if (e.pageX != undefined && e.pageY != undefined) {
                mouseX = e.pageX;
                mouseY = e.pageY;
            } else {
                mouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            mouseX -= gameCanvas.offsetLeft;
            mouseY -= gameCanvas.offsetTop;
            console.log(mouseX + "   " + mouseY);
            var cards = localPlayer.getCards();
            if (cards.length != 0 && !isAnimated && !cardsOnBoard) {
                //get values from server
                if (mouseX >= 150 && mouseX <= 618 && mouseY >= 635 && mouseY <= 705) {
                    for (var i = 0; i < cards.length; i++) {
                        if (mouseX >= cards[i].x && mouseX <= (cards[i].x + cards[i].w)) {
                            if (!cards[i].isClicked) {
                                animateLocalPlayersCard(cards[i]);
                                dom.canvas.off('click');
                                console.log("Clicked: " + cards[i].card.cname + "   " + mouseX + "   " + mouseY);
                                break;
                            }
                        }
                    }
                }
            }
        },
        /**Animate local players card til it reach to the mid points**/
            animateLocalPlayersCard = function (object) {
            isAnimated = true;
            //cardsOnBoard = true;
            var timer = function () {
                //careful to change below data, better to provide it from server
                var boardX = 355, boardY = 420, frame = 5;
                object.x = ( object.x != boardX) ? (( object.x > boardX) ? object.x -= frame : object.x += frame) : boardX;
                object.y = ( object.y != boardY) ? (( object.y > boardY) ? object.y -= frame : object.y += frame) : boardY;

                if ((object.x) == boardX && (object.y) == boardY) {
                    //cardsOnBoard = false;
                    isAnimated = false;
                    object.isClicked = true;
                    //localPlayer.removeCard(object);
                    drawScene();

                    console.log(rightPlayer.getCards());

                    moveRightPlayersCard(rightPlayer.getCards(cc));
                    cc++;

                    //replace this code to somewhaere else to make it work from server
                } else {
                    drawScene();
                }
            };
            cardAnimationInterval = setInterval(timer, 17);
        },
        cc = 0,
        /**Animate right side players card til it reach to the mid points
         * Properties of cards should control from server
         * **/
            moveRightPlayersCard = function (object) {
            //object will get the random number of right side player cards that is not undefined and card pos
            isAnimated = true;
            //cardsOnBoard = true;
            var timer = function () {
                //careful to change below data
                var boardX = 355, boardY = 450, frame = 5;
                object.x = ( object.x != boardX) ? (( object.x > boardX) ? object.x -= frame : object.x += frame) : boardX;
                object.y = ( object.y != boardY) ? (( object.y > boardY) ? object.y -= frame : object.y += frame) : boardY;

                if ((object.x) == boardX && (object.y) == boardY) {
                    //cardsOnBoard = false;
                    isAnimated = false;
                    //rightPlayer.removeCard(object);
                    drawScene();
                } else {
                    drawScene();
                }
            };
            cardAnimationInterval = setInterval(timer, 17);
        },
        /**Clear all intervals before start new game**/
            clearTriggers = function () {

        },
        /**an extra test funtion to check if all card are correct**/
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
        newGame: newGame,
        play: play,
        drawImage: drawImage,
        /**Store local players cards with verification**/
        pushLocalPlayersCards: function (x, y, w, h, arrayPos, suite, svalue, cvalue, points, cname) {
            var c = undefined;
            if (arrayPos <= allcards.length) {
                c = allcards[arrayPos];
                if (c.suite == suite && c.svalue == svalue && c.cvalue == cvalue && c.points == points && c.cname == cname) {
                    localPlayer.pushCards(x, y, w, h, c);
                    return true;
                }
                else {
                    return false;
                }
            } else {
                return false;
            }
            //localPlayer.pushCards(x, y, arrayPos, suite, svalue, cvalue, sname, points);
        },
        pushRightPlayersCards: function (x, y, w, h, card, t) {
            rightPlayer.pushCards(x, y, w, h, card, t);
        },
        pushLeftPlayersCards: function (x, y, w, h, card, t) {
            leftPlayer.pushCards(x, y, w, h, card, t);
        },
        pushTopPlayersCards: function (x, y, w, h, card, t) {
            topPlayer.pushCards(x, y, w, h, card, t);
        }
    }
})();