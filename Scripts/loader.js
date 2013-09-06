var loader;
loader = (function () {
    var loaded = true,
        loadedCount = 0, // assets that have been loaded so far
        totalCount = 0, // total number of assets that need to be loaded
        /** cards objects array to pre load **/
            cardsLoad = function (image) {
            //Cards Drawing Property
            var cdp = {
                "4": {c: cards.Spade, x: 0, y: 0},
                "3": {c: cards.Heart, x: 0, y: 119},
                "2": {c: cards.Dice, x: 0, y: 239},
                "1": {c: cards.Diamond, x: 0, y: 358}
            }
            var x, y, xw = 67, xh = 96;
            for (var i = 4; i > 0; i--) {
                x = cdp[i].x;
                y = cdp[i].y;
                for (var j = 0; j < 13; j++) {
                    game.allcards.push(new Card(cdp[i].c.name, cdp[i].c.svalue, cards.Values[j], cdp[i].c.sname, cdp[i].c.points[j], image, x, y, xw, xh));
                    if (j + 1 == 1 || j + 1 == 3 || j + 1 == 6 || j + 1 == 8 || j + 1 == 11) {
                        x += 102;
                        xw = 66.5;
                    } else {
                        x += 101;
                        xw = 67;
                    }
                }
            }
            game.allcards.push(new Card("Flipped", 0, 0, "Fli.0", 0, image, 203, 477, 67, 96));
        },
        /**to get information in loading screen and to make sure assets are loaded**/
            itemLoaded = function (image) {
            loadedCount++;
            if (loadedCount === totalCount) {
                loaded = true;
                cardsLoad(image);
                if (loader.onload) {
                    loader.onload();
                    loader.onload = undefined;
                }
            }
        }
    return{
        getLoadedCount: function () {
            return loadedCount;
        },
        getTotalCount: function () {
            return totalCount;
        },
        init: function () {
            loader.loadImage("Images/allcards.png");
        },
        /**load image file as new Image() by taking image file url**/
        loadImage: function (url) {
            totalCount++;
            loaded = false;
            var image = new Image();
            image.src = url;
            image.onload = itemLoaded(image);
            return image;
        }
    }
})();