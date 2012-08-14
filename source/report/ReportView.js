enyo.kind({
    name: "ReportView",
    kind: "FittableRows",
    showDetailsView: function() {
        this.$.panels.setIndex(0);
    },
    showGameView: function() {
        var data = this.$.reportForm.getData();
        this.$.reportGameView.setHome(data.home);
        this.$.reportGameView.setAway(data.away);
        this.$.reportGameView.setPlayers(data.players);
        this.$.panels.setIndex(1);
        this.$.gameButton.setActive(true);
        this.$.reportGameView.resized();
    },
    send: function() {
        var data = enyo.clone(this.$.reportForm.getData());
        var gameData = this.$.reportGameView.getData();
        enyo.mixin(data, gameData);
        if (data.score_home == data.score_away) {
            data.winner = null;
        } else if (data.score_home > data.score_away) {
            data.winner = data.home;
        } else {
            data.winner = data.away;
        }
        var players = data.players;
        delete data.players;
        enyo.forEach(players.home, function(player) {
            delete player.display_name;
        });
        enyo.forEach(players.away, function(player) {
            delete player.display_name;
        });

        for (var x in data) {
            if (data[x]) {
                data[x] = data[x].resource_uri || data[x];
            }
        }

        this.log(data);
        var events = data.events;
        data.events = [];
        scoreit.handball.game.create(data, enyo.bind(this, function(sender, response) {
            this.addGamePlayerRelations(players, response);
            this.addEvents(events, response);
        }));
    },
    addGamePlayerRelations: function(players, game) {
        objects = [];

        var addObject = function(player) {
            objects.push({
                player: player.resource_uri || player,
                game: game.resource_uri,
                shirt_number: player.shirtNumber,
                team: game.home
            });
            delete player.shirtNumber;
        };
        enyo.forEach(players.home, addObject, this);
        enyo.forEach(players.away, addObject, this);

        scoreit.handball.gameplayerrelation.bulk(objects, null, enyo.bind(this, function(sender, response) {
            this.log(response);
        }));
    },
    addEvents: function(events, game) {
        enyo.forEach(events, function(event) {
            event.game = game.resource_uri;
        });
        scoreit.handball.event.bulk(events, null, enyo.bind(this, function(sender, response) {
            this.log(response);
        }));
    },
    components: [
        {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
            {kind: "FittableRows", classes: "enyo-fill", components: [
                {kind: "Scroller", fit: true, components: [
                    {classes: "centered-content", components: [
                        {kind: "ReportForm"},
                        {kind: "onyx.Button", classes: "onyx-affirmative", style: "width: 100%", content: "Weiter", ontap: "showGameView"},
                        {style: "height: 200px"}
                    ]}
                ]}
            ]},
            {classes: "enyo-fill", components: [
                {kind: "ReportGameView", style: "margin: 0 auto;"}
            ]},
            {}
        ]},
        {kind: "onyx.Toolbar", components: [
            {kind: "onyx.RadioGroup", components: [
                {content: "Details", name: "detailsButton", active: true, ontap: "showDetailsView"},
                {content: "Spiel", name: "gameButton", ontap: "showGameView"},
                {content: "Vorschau", name: "previewButton", ontap: "showPreview"}
            ]},
            {kind: "onyx.Button", content: "Abschicken", ontap: "send", classes: "onyx-affirmative align-right"}
        ]}
    ]
});