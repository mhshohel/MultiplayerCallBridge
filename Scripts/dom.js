/**Cached of all dom elements, only contains variables**/
var dom;
dom = {
    gameTitle: $("#gameTitle").html("Callbridge"),
    gameSlogan: $('#subTitle').html("A multiplayer card game"),
    //gameStatus: $('#gameStatus').css({"position": "fixed", "top": "200px", "left": "180px"}),
    gameStatusScreen: $('#statusScreen'),
    statusHeaderText: $('#statusHeaderText'),
    statusFooterText: $('#statusFooterText'),
    progressbar: $("#progressbar"),
    progressLabel: $(".progress-label").html("Loading..."),
    playButton: $('#playGame').html("PLAY"),
    menu: $('#menu'),
    rulesButton: $('#gameRules').html("RULES"),
    gameCanvas: $('#gameCanvas'),
    dialogBox: $("#dialog-message"),
    dialogMessageOne: $("#dialog-messageOne"),
    dialogMessageTwo: $("#dialog-messageTwo"),
    canvas: $("#gameCanvas")
};