var Player;
Player = function (isLocal, name, hostNum, clientId, gameRoomNumber) {
    //cards will contain
    //x, y, card number, suite, svalue, cvalue, sname, points
    var cards = [], prevCards = [], countUndefinedCard = 0,
        emptyPlayerCards = function () {
            if (isLocal) {
                cards = [];
            }
        };
    return{
        isLocal: isLocal,
        name: name,
        hostNum: hostNum,
        clientId: clientId,
        gameRoomNumber: gameRoomNumber,
        getCards: function () {
            if (isLocal) {
                return cards;
            } else {
                return undefined;
            }
        },
        removeCard: function (card) {
            cards.splice(cards.indexOf(card), 1);
            cards.push();
            countUndefinedCard++;
            if (countUndefinedCard == 13) {
                emptyPlayerCards();
            }
        },
        pushCards: function (x, y, w, h, card) {
            //x: x-axis, y: y-axis, w: width, h: height
            if (isLocal) {
                cards.push(
                    {
                        x: x,
                        y: y,
                        w: w,
                        h: h,
                        card: card
                    }
                );
            }
        }
    }
}