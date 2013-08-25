Modernizr.load([
    {
        // load all resource files
        load: [
            "Lib/jquery-2.0.3.min.js",
            "Lib/jquery-ui-1.10.3.custom.min.js",
            "StyleSheets/fontfaces.css",
            "StyleSheets/reset.css",
            "StyleSheets/common.css",
            "StyleSheets/style.css",
            "Scripts/dom.js",
            "Scripts/common.js",
            "Scripts/loader.js",
            "Scripts/mouse.js",
            "Scripts/game.js",
        ],
        //after loading all resources below command will be execute
        complete: function () {
            if (Modernizr.canvas && Modernizr.localstorage) {
                try {
                    //show game title
                    common.showGameTitle();
                    /*Activate all click events*/
                    //rules button click event
                    common.rulesButtonOnClick();
                    /*------------------------*/
                    game.init();
                } catch (err) {
                    console.error("Global Error (Resource): " + err.message);
                }
            } else {
                //show message yousing custom dialog...
                alert("You browser doesn't supported for this game. Please, update your browser. Thank you.");
            }
        }
    },
]);