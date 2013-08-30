var Card;
/**
 * suite: Spade, Heart, Diamond, Dice;
 * svalue: Spade=4, Heart=3, Dice=2, Diamond=1;
 * cvalue: A,2,3,4,5,6,7,8,9,10,J,Q,K;
 * cname: Spa.A...., Hea.A...., Dia.A..., Dic.A
 * points: 52,51,50,49.........1; Highest rank has highest value.
 * sx: source x-axis
 * sy: source y-axis
 * sw: source width
 * sh: source height
 * image: original image
 */

Card = function (suite, svalue, cvalue, sname, points, image, sx, sy, sw, sh) {
    return{
        draw: function (x, y) {
            game.drawImage(image, sx, sy, sw, sh, x, y, 48, 70);
        },
        suite: suite, //Suite name
        svalue: svalue, //Suite value
        cvalue: cvalue, // Card value
        cname: sname + cvalue, //Card value with suite name
        points: points //Card point or Rank
    }
};

//List of Cards with name, face value and points
var cards;
cards = {
    Spade: {
        name: "Spade",
        sname: "Spa.",
        svalue: 4,
        points: [52, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
    },
    Heart: {
        name: "Heart",
        sname: "Hea.",
        svalue: 3,
        points: [39, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]
    },
    Dice: {
        name: "Dice",
        sname: "Dic.",
        svalue: 2,
        points: [13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    Diamond: {
        name: "Diamond",
        sname: "Dia.",
        svalue: 1,
        points: [26, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
    },
    Values: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
};