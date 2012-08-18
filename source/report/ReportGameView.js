enyo.kind({
    name: "ReportGameView",
    classes: "reportgameview",
    kind: "FittableRows",
    published: {
        home: null,
        away: null,
        players: null,
        running: false
    },
    events: {
        onDone: "",
        onBack: ""
    },
    score: {
        home: 0,
        away: 0
    },
    gameEvents: [],
    rendered: function() {
        this.homeChanged();
        this.awayChanged();
        this.playersChanged();
        this.updateScore();
    },
    homeChanged: function() {
        if (this.home && this.home.club) {
            this.$.homeTeamName.setContent(this.home.club.name);
        }
    },
    awayChanged: function() {
        if (this.away && this.away.club) {
            this.$.awayTeamName.setContent(this.away.club.name);
        }
    },
    playersChanged: function() {
        if (this.players && this.players.home) {
            this.$.homeTeamList.setCount(this.players.home.length);
            this.$.homeTeamList.render();
        }
        if (this.players && this.players.away) {
            this.$.awayTeamList.setCount(this.players.away.length);
            this.$.awayTeamList.render();
        }
    },
    toggleTimer: function() {
        this.setRunning(!this.running);
    },
    runningChanged: function() {
        this.$.timer.setRunning(this.running);
        this.$.toggleTimerButton.addRemoveClass("pause", this.running);
        var homePlayerItems = this.$.homeTeamList.getControls();
        var awayPlayerItems = this.$.awayTeamList.getControls();

        var toggleItem = enyo.bind(this, function(item) {
            if (!this.running) {
                item.pauseTimer();
            } else {
                item.resumeTimer();
            }
        });

        for (var j = 0; j < homePlayerItems.length; j++) {
            toggleItem(homePlayerItems[j].$.playerItem);
        }
        for (var j = 0; j < awayPlayerItems.length; j++) {
            toggleItem(awayPlayerItems[j].$.playerItem);
        }
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
        var player = this.players[side][playerItem.index];
        playerItem.setGoals(playerItem.getGoals()+1);
        // playerItem.twin.setGoals(playerItem.twin.getGoals()+1);
        this.goal(side, player);
    },
    goal: function(side, player) {
        this.gameEvents.push({
            event_type: "goal",
            team: side == "home" ? this.home.resource_uri : this.away.resource_uri,
            person: player.resource_uri || player,
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
        var player = this.players[side][playerItem.index];
        playerItem.penalty();
        // playerItem.twin.penalty();
        this.penalty(side, player);
    },
    penalty: function(side, player) {
        this.gameEvents.push({
            event_type: "time_penalty",
            team: side == "home" ? this.home.resource_uri : this.away.resource_uri,
            person: player.resource_uri || player,
            time: this.$.timer.getTime()
        });
    },
    contextWarning: function() {
        this.warningFromItem(this.selectedItem);
        this.$.playerContextMenu.hide();
    },
    warningFromItem: function(playerItem) {
        var side = playerItem.side;
        var player = this.players[side][playerItem.index];
        playerItem.warning();
        // playerItem.twin.warning();
        this.warning(side, player);
    },
    warning: function(side, player) {
        this.gameEvents.push({
            game_type: "warning",
            team: side == "home" ? this.home.resource_uri : this.away.resource_uri,
            person: player.resource_uri || player,
            time: this.$.timer.getTime()
        });
    },
    contextDis: function() {
        this.disFromItem(this.selectedItem);
        this.$.playerContextMenu.hide();
    },
    disFromItem: function(playerItem) {
        var side = playerItem.side;
        var player = this.players[side][playerItem.index];
        playerItem.disqualify();
        // playerItem.twin.disqualify();
        this.disqualification(side, player);
    },
    disqualification: function(side, player) {
        this.gameEvents.push({
            game_type: "disqualification",
            team: side == "home" ? this.home.resource_uri : this.away.resource_uri,
            person: player.resource_uri || player,
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
        // // this.$.homeTeamListDecorator.addRemoveClass("sidecolumn-list-highlighted", highlight);
        // // this.$.awayTeamListDecorator.addRemoveClass("sidecolumn-list-highlighted", highlight);
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
    getData: function() {
        return {
            score_home: this.score.home,
            score_away: this.score.away,
            events: this.gameEvents
        };
    },
    // getPosition: function(con) {
    //     var Elem = con.hasNode();
    //     var offsetLeft = 0;
    //     var offsetTop = 0;

    //     do {
    //         if (!isNaN(Elem.offsetLeft)) {
    //             offsetLeft += Elem.offsetLeft;
    //             offsetTop += Elem.offsetTop;
    //         }
    //     } while (Elem = Elem.offsetParent);

    //     return {
    //         left: offsetLeft,
    //         top: offsetTop
    //     };
    // },
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
    },
    setupPlayerItem: function(sender, event) {
        var side = sender.side;
        event.item.$.playerItem.index = event.index;
        event.item.$.playerItem.setPlayer(this.players[side][event.index]);
    },
    components: [
        {kind: "FittableColumns", fit: true, components: [
            {kind: "FittableRows", components: [
                {classes: "header-font sidecolumn-header", name: "homeTeamName"},
                {classes: "sidecolumn-list enyo-fill", fit: true, name: "homeTeamListDecorator", components: [
                    {kind: "Scroller", classes: "enyo-fill", components: [
                        {kind: "Repeater", name: "homeTeamList", onSetupItem: "setupPlayerItem", side: "home", components: [
                            {kind: "PlayerListItem", name: "playerItem", ontap: "playerClicked", side: "home", tapHighlight: true}
                        ]}
                    ]}
                ]}
            ]},
            {classes: "centercolumn", fit: true, components: [
                {kind: "Timer", name: "timer", maxTime: 1800000, blinking: true, classes: "timer", onTimeout: "timerTimeout"},
                {classes: "timer-controls enyo-center", components: [
                    {kind: "onyx.Button", name: "toggleTimerButton", classes: "timer-controls-toggle", ontap: "toggleTimer", components: [
                        {kind: "Image", src: "../assets/images/play.png", name: "playImage", classes: "play-image"},
                        {kind: "Image", src: "../assets/images/pause.png", name: "pauseImage", classes: "pause-image"}
                    ]},
                    {kind: "onyx.Button", classes: "timer-controls-reset", allowHtml: true, content: "0:00", ontap: "resetTimer"}
                ]},
                {name: "scoreboard", classes: "scoreboard enyo-center", components: [
                    {components: [
                        {content: "HEIM", classes: "scoreboard-header"},
                        {kind: "onyx.InputDecorator", classes: "scoreboard-field onyx-focused", components: [
                            {name: "homeScore"}
                        ]}
                    ]},
                    {classes: "scoreboard-seperator", content: ":"},
                    {components: [
                        {content: "GAST", classes: "scoreboard-header"},
                        {kind: "onyx.InputDecorator", classes: "scoreboard-field onyx-focused", components: [
                            {name: "awayScore"}
                        ]}
                    ]}
                ]},
                {kind: "onyx.Button", classes: "goal-button enyo-center", content: "TOR!", ontap: "goalClicked", components: [
                    {kind: "Image", src: "../assets/images/ball.png"}
                ]},
                {classes: "penalty-controls", components: [
                    {kind: "onyx.Button", ontap: "penaltyClicked", components: [
                        {kind: "Image", style: "height: 32px", src: "../assets/images/stopwatch@2x.png"}
                    ]},
                    {kind: "onyx.Button", ontap: "warningClicked", components: [
                        {kind: "Image", src: "../assets/images/yellow_card_32x32.png"}
                    ]},
                    {kind: "onyx.Button", ontap: "disClicked", components: [
                        {kind: "Image", src: "../assets/images/red_card_32x32.png"}
                    ]}
                ]}
            ]},
            {kind: "FittableRows", components: [
                {classes: "header-font sidecolumn-header", name: "awayTeamName"},
                {classes: "sidecolumn-list enyo-fill", fit: true, name: "awayTeamListDecorator", components: [
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
        {kind: "onyx.Popup", floating: false, name: "halfTimePopup", classes: "notification-popup", centered: true, components: [
            {content: "Erste Halbzeit vorbei!"}
        ]},
        {kind: "onyx.Popup", floating: false, name: "endPopup", classes: "notification-popup", centered: true, components: [
            {content: "Spiel vorbei!"}
        ]}
    ]
});