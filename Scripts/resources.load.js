Modernizr.load([
    {
        // load all resource files
        load: [
            "StyleSheets/fontfaces.css",
            "StyleSheets/reset.css",
            "StyleSheets/style.css",
            "Lib/jquery-2.0.3.min.js",
            "Lib/jquery-ui-1.10.3.custom.min.js",
            "Scripts/common.js",
            "Scripts/loader.js",
            "Scripts/mouse.js",
            "Scripts/game.js",
        ],
        //after loading all resources below command will be execute
        complete: function () {
            if (Modernizr.canvas && Modernizr.localstorage) {
                game.init();
            } else {
                //show message yousing custom dialog...
                alert("You browser doesn't supported for this game. Please, update your browser. Thank you.");
            }
        }
    },
]);