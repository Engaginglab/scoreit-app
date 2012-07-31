enyo.kind({
    name: "ReportGameView",
    classes: "reportview",
    kind: "FittableRows",
    published: {
        home: null,
        away: null
    },
    events: {
        onDone: "",
        onBack: ""
    },
    score: {
        home: 0,
        away: 0
    },
    eventTypeMapping: {
        "Tor": 1,
        "Zeitstrafe": 2,
        "Verwarnung": 3,
        "Disqualifikation": 4
    },
    gameEvents: [],
    rendered: function() {
        this.inherited(arguments);
        this.homeChanged();
        this.awayChanged();
        this.updateScore();
        this.freezeGame(true);
        this.resized();
    },
    homeChanged: function() {
        this.$.homeTeamName.setContent(this.home.club.name);
        this.$.homeTeamList.setCount(this.home.players.length);
        this.$.homeTeamList.render();
    },
    awayChanged: function() {
        this.$.awayTeamName.setContent(this.away.club.name);
        this.$.awayTeamList.setCount(this.away.players.length);
        this.$.awayTeamList.render();
    },
    toggleTimer: function() {
        this.$.timer.toggle();
        this.$.toggleTimerButton.addRemoveClass("pause", this.$.timer.isRunning());
        this.freezeGame(!this.$.timer.isRunning());
    },
    resetTimer: function() {
        this.$.timer.reset();
    },
    playerClicked: function(sender, event) {
        switch (this.currentAction) {
            case "goal":
                this.goalFromItem(sender);
            break;
            case "penalty":
                this.penaltyFromItem(sender);
            break;
            case "warning":
                this.warningFromItem(sender);
            break;
            case "dis":
                this.disFromItem(sender);
            break;
            default:
                this.selectedItem = sender;
                this.$.playerContextMenu.applyStyle("top", event.clientY + "px");
                this.$.playerContextMenu.applyStyle("left", event.clientX + "px");
                this.$.playerContextMenu.show();
            break;
        }
        this.currentAction = null;
        this.highlightLists(false);
    },
    goalClicked: function() {
        this.currentAction = "goal";
        this.highlightLists(true);
    },
    penaltyClicked: function() {
        this.currentAction = "penalty";
        this.highlightLists(true);
    },
    warningClicked: function() {
        this.currentAction = "warning";
        this.highlightLists(true);
    },
    disClicked: function() {
        this.currentAction = "dis";
        this.highlightLists(true);
    },
    contextGoal: function() {
        this.goalFromItem(this.selectedItem);
        this.$.playerContextMenu.hide();
    },
    goalFromItem: function(playerItem) {
        var side = playerItem.side;
        var player = this[side].players[playerItem.index];
        playerItem.setGoals(playerItem.getGoals()+1);
        // playerItem.twin.setGoals(playerItem.twin.getGoals()+1);
        this.goal(side, player);
    },
    goal: function(side, player) {
        this.gameEvents.push({
            event_type: this.eventTypeMapping["Tor"],
            team: side == "home" ? this.home.id : this.away.id,
            person: player.id,
            time: this.$.timer.getTime()
        });
        this.score[side]++;
        this.updateScore();
    },
    contextPenalty: function() {
        this.penaltyFromItem(this.selectedItem);
        this.$.playerContextMenu.hide();
    },
    penaltyFromItem: function(playerItem) {
        var side = playerItem.side;
        var player = this[side].players[playerItem.index];
        playerItem.penalty();
        // playerItem.twin.penalty();
        this.penalty(side, player);
    },
    penalty: function(side, player) {
        this.gameEvents.push({
            event_type: this.eventTypeMapping["Zeitstrafe"],
            team: side == "home" ? this.home.id : this.away.id,
            person: player.id,
            time: this.$.timer.getTime()
        });
    },
    contextWarning: function() {
        this.warningFromItem(this.selectedItem);
        this.$.playerContextMenu.hide();
    },
    warningFromItem: function(playerItem) {
        var side = playerItem.side;
        var player = this[side].players[playerItem.index];
        playerItem.warning();
        // playerItem.twin.warning();
        this.warning(side, player);
    },
    warning: function(side, player) {
        this.gameEvents.push({
            game_type: this.eventTypeMapping["Verwarnung"],
            team: side == "home" ? this.home.id : this.away.id,
            person: player.id,
            time: this.$.timer.getTime()
        });
    },
    contextDis: function() {
        this.disFromItem(this.selectedItem);
        this.$.playerContextMenu.hide();
    },
    disFromItem: function(playerItem) {
        var side = playerItem.side;
        var player = this[side].players[playerItem.index];
        playerItem.disqualify();
        // playerItem.twin.disqualify();
        this.disqualification(side, player);
    },
    disqualification: function(side, player) {
        this.gameEvents.push({
            game_type: this.eventTypeMapping["Disqualifikation"],
            team: side == "home" ? this.home.id : this.away.id,
            person: player.id,
            time: this.$.timer.getTime()
        });
    },
    updateScore: function() {
        this.$.homeScore.setContent(this.score.home);
        this.$.awayScore.setContent(this.score.away);
    },
    highlightLists: function(highlight) {
        this.$.homeTeamListDecorator.addRemoveClass("highlighted", highlight);
        this.$.awayTeamListDecorator.addRemoveClass("highlighted", highlight);
        // this.$.scrim.setShowing(highlight);
        // this.$.listsScrim.setShowing(highlight);

        // var bounds = this.$.homeTeamListDecorator.getBounds();
        // var pos = this.getPosition(this.$.homeTeamListDecorator);
        // bounds.left = pos.left;
        // bounds.top = pos.top;
        // this.$.homeTeamListDecoratorHigh.setBounds(bounds);
        // this.$.homeTeamListDecorator.applyStyle("visibility", highlight ? "hidden" : "visible");

        // bounds = this.$.awayTeamListDecorator.getBounds();
        // pos = this.getPosition(this.$.awayTeamListDecorator);
        // bounds.left = pos.left;
        // bounds.top = pos.top;
        // this.$.awayTeamListDecoratorHigh.setBounds(bounds);
        // this.$.awayTeamListDecorator.applyStyle("visibility", highlight ? "hidden" : "visible");
        // // this.$.homeTeamListDecorator.addRemoveClass("reportview-sidecolumn-list-highlighted", highlight);
        // // this.$.awayTeamListDecorator.addRemoveClass("reportview-sidecolumn-list-highlighted", highlight);
    },
    freezeGame: function(freeze) {
        var homePlayerItems = this.$.homeTeamList.getControls();
        var awayPlayerItems = this.$.awayTeamList.getControls();

        function freezeItem(item) {
            //item.setDisabled(freeze);
            if (freeze) {
                item.pauseTimer();
                // item.twin.pauseTimer();
            } else {
                item.resumeTimer();
                // item.twin.resumeTimer();
            }
        }
        for (var j = 0; j < homePlayerItems.length; j++) {
            freezeItem(homePlayerItems[j].$.playerItem);
        }
        for (var j = 0; j < awayPlayerItems.length; j++) {
            freezeItem(awayPlayerItems[j].$.playerItem);
        }
    },
    timerTimeout: function() {
        this.$.toggleTimerButton.removeClass("pause");
        this.freezeGame(true);
        if (this.$.timer.getTime() == 1800000) {
            this.$.timer.setMaxTime(3600000);
            this.$.halfTimePopup.show();
        } else {
            this.$.doneButton.setDisabled(false);
            this.$.endPopup.show();
        }
    },
    sendButtontaped: function() {
        this.done();
    },
    done: function() {
        var players_home = [];
        for (var i=0; i<this.home.players.length; i++) {
            players_home.push(this.home.players[i]);
        }
        var players_away = [];
        for (var i=0; i<this.away.players.length; i++) {
            players_away.push(this.away.players[i]);
        }
        var game = {
            nummer: this.number,
            heim: this.home.ID,
            gast: this.away.ID,
            tore_heim: this.score.home,
            tore_gast: this.score.away,
            sieger: this.score.home > this.score.away ? this.home.ID : this.away.ID,
            verband: this.union.ID,
            klasse: this.gameClass.ID,
            spieler_heim: JSON.stringify(players_home),
            spieler_gast: JSON.stringify(players_away),
            ereignisse: JSON.stringify(this.gameEvents)
        };
        this.log(JSON.stringify(game));
        this.doDone(game);
        this.$.endPopup.hide();
    },
    secondHalfButtontaped: function() {
        this.toggleTimer();
        this.$.halfTimePopup.hide();
    },
    getPosition: function(con) {
        var Elem = con.hasNode();
        var offsetLeft = 0;
        var offsetTop = 0;

        do {
            if (!isNaN(Elem.offsetLeft)) {
                offsetLeft += Elem.offsetLeft;
                offsetTop += Elem.offsetTop;
            }
        } while (Elem = Elem.offsetParent);

        return {
            left: offsetLeft,
            top: offsetTop
        };
    },
    reset: function() {
        this.$.timer.stop();
        this.$.toggleTimerButton.removeClass("pause");
        this.$.timer.reset();
        this.score = {
            home: 0,
            away: 0
        };
        this.updateScore();
        this.gameEvents = [];
        this.setHome({Vereinsname: "Vereinsname", players: []});
        this.setAway({Vereinsname: "Vereinsname", players: []});
    },
    setupPlayerItem: function(sender, event) {
        var side = sender.side;
        event.item.$.playerItem.index = event.index;
        event.item.$.playerItem.setPlayer(this[side].players[event.index]);
    },
    components: [
        {kind: "FittableColumns", fit: true, components: [
            {kind: "FittableRows", components: [
                {classes: "header-font reportview-sidecolumn-header", name: "homeTeamName"},
                {classes: "reportview-sidecolumn-list enyo-fill", fit: true, name: "homeTeamListDecorator", components: [
                    {kind: "Scroller", classes: "enyo-fill", components: [
                        {kind: "Repeater", name: "homeTeamList", onSetupItem: "setupPlayerItem", side: "home", components: [
                            {kind: "PlayerListItem", name: "playerItem", ontap: "playerClicked", side: "home"}
                        ]}
                    ]}
                ]}
            ]},
            {classes: "reportview-centercolumn", fit: true, components: [
                {kind: "FittableColumns", name: "scoreboard", classes: "reportview-scoreboard enyo-center", components: [
                    {components: [
                        {content: "HEIM", classes: "reportview-scoreboard-header"},
                        {kind: "onyx.InputDecorator", classes: "reportview-scoreboard-field onyx-focused", components: [
                            {name: "homeScore"}
                        ]}
                    ]},
                    {classes: "reportview-scoreboard-seperator", content: ":"},
                    {components: [
                        {content: "GAST", classes: "reportview-scoreboard-header"},
                        {kind: "onyx.InputDecorator", classes: "reportview-scoreboard-field onyx-focused", components: [
                            {name: "awayScore"}
                        ]}
                    ]}
                ]},
                {kind: "Timer", name: "timer", maxTime: 1800000, classes: "reportview-timer", onTimeout: "timerTimeout"},
                {kind: "FittableColumns", classes: "reportview-timer-controls enyo-center", components: [
                    {kind: "onyx.Button", name: "toggleTimerButton", classes: "reportview-timer-controls-toggle", ontap: "toggleTimer", components: [
                        {tag: "img", attributes: {src: "assets/images/play.png"}, name: "playImage", classes: "play-image"},
                        {tag: "img", attributes: {src: "assets/images/pause.png"}, name: "pauseImage", classes: "pause-image"}
                    ]},
                    {kind: "onyx.Button", classes: "reportview-timer-controls-reset", allowHtml: true, content: "0:00", ontap: "resetTimer"}
                ]},
                {kind: "FittableColumns", classes: "enyo-center reporview-goal-button-wrapper", components: [
                    {kind: "onyx.Button", classes: "reportview-goal-button", content: "TOR!", ontap: "goalClicked", components: [
                        {tag: "img", attributes: {src: "assets/images/ball.png"}}
                    ]}
                ]},
                {kind: "FittableColumns", classes: "enyo-center reportview-penalty-controls", components: [
                    {kind: "onyx.Button", ontap: "penaltyClicked", components: [
                        {tag: "img", style: "height: 32px", attributes: {src: "assets/images/stopwatch@2x.png"}}
                    ]},
                    {kind: "onyx.Button", ontap: "warningClicked", components: [
                        {tag: "img", attributes: {src: "assets/images/yellow_card_32x32.png"}}
                    ]},
                    {kind: "onyx.Button", ontap: "disClicked", components: [
                        {tag: "img", attributes: {src: "assets/images/red_card_32x32.png"}}
                    ]}
                ]},
                {kind: "FittableColumns", classes: "enyo-center", showing: false, components: [
                    {kind: "onyx.Button", name: "doneButton", classes: "reportview-done-button", content: "Weiter", ontap: "done", disabled: true}
                ]}
            ]},
            {kind: "FittableRows", components: [
                {classes: "header-font reportview-sidecolumn-header", name: "awayTeamName"},
                {classes: "reportview-sidecolumn-list enyo-fill", fit: true, name: "awayTeamListDecorator", components: [
                    {kind: "Scroller", classes: "enyo-fill", components: [
                        {kind: "Repeater", name: "awayTeamList", onSetupItem: "setupPlayerItem", side: "away", components: [
                            {kind: "PlayerListItem", name: "playerItem", ontap: "playerClicked", side: "away"}
                        ]}
                    ]}
                ]}
            ]}
        ]},
        {kind: "onyx.Popup", classes: "onyx-menu", floating: true, name: "playerContextMenu", components: [
            {classes: "onyx-menu-item", content: "Tor!", ontap: "contextGoal"},
            {classes: "onyx-menu-item", content: "Hinausstellung", ontap: "contextPenalty"},
            {classes: "onyx-menu-item", content: "Verwarnung", ontap: "contextWarning"},
            {classes: "onyx-menu-item", content: "Disqualifikation", ontap: "contextDis"}
        ]},
        {kind: "onyx.Popup", floating: true, name: "halfTimePopup", modal: true, centered: true, components: [
            {content: "Erste Halbzeit vorbei!"},
            {kind: "onyx.Button", classes: "onyx-affirmative", content: "Weiter Gehts", ontap: "secondHalfButtontaped"}
        ]},
        {kind: "onyx.Popup", floating: true, name: "endPopup", modal: true, centered: true, autoDismiss: false, components: [
            {content: "Spiel vorbei!"},
            {kind: "onyx.Button", classes: "onyx-affirmative", content: "Bericht Abschicken", ontap: "sendButtontaped"}
        ]}
    ]
});