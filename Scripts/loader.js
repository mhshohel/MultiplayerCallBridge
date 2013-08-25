var loader = {
    loaded: true,
    loadedCount: 0, // assets that have been loaded so far
    totalCount: 0, // total number of assets that need to be loaded
    init: function () {
        game.cards = loader.cardsLoad('allcards', ".png");
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
    cardsLoad: function (imgName, ext) {
        var img = loader.loadImage("Images/" + imgName + ext);

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
}