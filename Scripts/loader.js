var loader;
loader = {
    loaded: true,
    loadedCount: 0, // assets that have been loaded so far
    totalCount: 0, // total number of assets that need to be loaded
    init: function () {
        var image = loader.loadImage("Images/allcards.png");
        game.cards = loader.cardsLoad(image);
    },
    //load image file as new Image() by taking image file url
    loadImage: function (url) {
        this.totalCount++;
        this.loaded = false;
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },
    // cards objects array to pre load
    cardsLoad: function (image) {
        var c, x, y, xw = 67, xh = 96;
        for (var i = 4; i > 0; i--) {
            switch (i) {
                case 4:
                    c = cards.Spade;
                    x = 0;
                    y = 0;
                    break;
                case 3:
                    c = cards.Heart;
                    x = 0;
                    y = 119;
                    break;
                case 2:
                    c = cards.Dice;
                    x = 0;
                    y = 239;
                    break;
                case 1:
                    c = cards.Diamond;
                    x = 0;
                    y = 358;
                    break;
            }
            for (var j = 0; j < 13; j++) {
                game.allcards.push(new Card(c.name, c.svalue, cards.Values[j], c.sname, c.points[j], image, x, y, xw, xh));
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
    // to get information in loading screen and to make sure assets are loaded
    itemLoaded: function () {
        loader.loadedCount++;
        if (loader.loadedCount === loader.totalCount) {
            loader.loaded = true;
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        }
    }
};