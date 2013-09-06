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
        //return cards by index
        getCards: function (index) {
            if (index != undefined) {
                if (index >= cards.length) {
                    return undefined;
                } else {
                    return cards[index];
                }
            } else {
                return cards;
            }
        },
        emptyCards: function () {
            cards = [];
        },
        removeCard: function (card) {
            cards.splice(cards.indexOf(card), 1);
            cards.push(undefined);
            countUndefinedCard++;
            if (countUndefinedCard == 13) {
                emptyPlayerCards();
            }
        },
        pushCards: function (x, y, w, h, card, t) {
            //x: x-axis, y: y-axis, w: width, h: height
//            if (isLocal) {
            console.log("Adding");
            cards.push(
                {
                    x: x,
                    y: y,
                    w: w,
                    h: h,
                    t: (t == undefined) ? undefined : t,
                    card: card
                }
            );
//            }
        }
    }
}