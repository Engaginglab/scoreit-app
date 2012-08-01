enyo.kind({
    name: "ReportForm",
    classes: "scoreit-form",
    create: function() {
        this.inherited(arguments);
        this.setupTimePicker();
        this.loadSites();
        this.loadGameTypes();
        this.loadUnions();
    },
    setupTimePicker: function() {
        var now = new Date();
        for (var i=1; i<=31; i++) {
            this.$.dayPicker.createComponent({
                content: i,
                active: now.getDate() == i
            });
        }
        for (var i=1; i<=12; i++) {
            this.$.monthPicker.createComponent({
                content: i,
                value: i,
                active: now.getMonth() == i
            });
        }
        for (var i=now.getFullYear()-5; i<=now.getFullYear()+5; i++) {
            this.$.yearPicker.createComponent({
                content: i,
                value: i,
                active: now.getFullYear() == i
            });
        }
        for (var i=0; i<=23; i++) {
            this.$.hourPicker.createComponent({
                content: i < 10 ? "0" + i : i,
                value: i,
                active: now.getHours() == i
            });
        }
        for (var i=0; i<=59; i++) {
            this.$.minutePicker.createComponent({
                content: i < 10 ? "0" + i : i,
                value: i,
                active: now.getMinutes() == i
            });
        }
    },
    loadSites: function() {
        scoreit.handball.site.list([], enyo.bind(this, function(sender, response) {
            this.$.siteSelector.setItems(response.objects);
        }));
    },
    loadGameTypes: function() {
        scoreit.handball.gametype.list([], enyo.bind(this, function(sender, response) {
            this.populatePicker(this.$.gameTypePicker, response.objects, "name");
        }));
    },
    loadUnions: function() {
        scoreit.handball.union.list([], enyo.bind(this, function(sender, response) {
            this.populatePicker(this.$.unionPicker, response.objects, "name");
        }));
    },
    unionSelected: function() {
        this.loadDistricts();
    },
    loadDistricts: function() {
        var union = this.$.unionPicker.getSelected().value;
        scoreit.handball.district.list([["union", union.id]], enyo.bind(this, function(sender, response) {
            this.populatePicker(this.$.districtPicker, response.objects, "name");
            this.$.districtPickerButton.setDisabled(false);
        }));
    },
    districtSelected: function() {
        this.loadLeagues();
        this.loadTeams();
    },
    loadLeagues: function() {
        var district = this.$.districtPicker.getSelected().value;
        scoreit.handball.league.list([["district", district.id]], enyo.bind(this, function(sender, response) {
            this.populatePicker(this.$.leaguePicker, response.objects, "display_name");
            this.$.leaguePickerButton.setDisabled(false);
        }));
    },
    leagueSelected: function() {
        this.loadGroups();
    },
    loadGroups: function() {
        var league = this.$.leaguePicker.getSelected().value;
        scoreit.handball.group.list([["league", league.id]], enyo.bind(this, function(sender, response) {
            this.populatePicker(this.$.groupPicker, response.objects, "name");
            this.$.groupPickerButton.setDisabled(false);
        }));
    },
    populatePicker: function(picker, items, displayProperty) {
        picker.destroyClientControls();
        for (var i=0; i<items.length; i++) {
            picker.createComponent({
                content: items[i][displayProperty],
                value: items[i]
            });
        }
    },
    loadTeams: function() {
        var district = this.$.districtPicker.getSelected().value;
        scoreit.handball.team.list([['club__district', district.id]], enyo.bind(this, function(sender, reponse) {
            this.$.homeTeamSelector.setItems(reponse.objects);
            this.$.awayTeamSelector.setItems(reponse.objects);
            this.$.homeTeamSelector.setDisabled(false);
            this.$.awayTeamSelector.setDisabled(false);
        }));
    },
    teamChanged: function(sender, event) {
        var side = sender.side;
        var team = this.$[side + "TeamSelector"].getSelectedItem();

        this.$[side + "PlayerSelector"].setItems(team.players);
        this.$[side + "PlayerSelector"].setSelectedItems(team.players);
    },
    newSite: function() {
        this.$.siteForm.setSite(null);
        this.$.sitePopup.show();
    },
    newSiteConfirm: function() {
        var site = this.$.siteForm.getData();
        this.$.siteSelector.setSelectedItem(site);
    },
    newPlayerHandler: function(sender, event) {
        var cut = event.item.display_name.lastIndexOf(" ");
        event.item.first_name = event.item.display_name.substring(0, cut);
        event.item.last_name = event.item.display_name.substring(cut+1);
    },
    getData: function() {
        var start = new Date();
        start.setDate(this.$.dayPicker.getSelected().value);
        start.setMonth(this.$.monthPicker.getSelected().value);
        start.setFullYear(this.$.yearPicker.getSelected().value);
        start.setHours(this.$.hourPicker.getSelected().value);
        start.setMinutes(this.$.minutePicker.getSelected().value);

        return {
            number: this.$.gameNumber.getValue(),
            start: start,
            group: this.$.groupPicker.getSelected() ? this.$.groupPicker.getSelected().value : null,
            game_type: this.$.gameTypePicker.getSelected() ? this.$.gameTypePicker.getSelected().value : null,
            site: this.$.siteSelector.getSelectedItem(),
            home: this.$.homeTeamSelector.getSelectedItem(),
            away: this.$.awayTeamSelector.getSelectedItem(),
            players: {
                home: this.$.homePlayerSelector.getSelectedItems(),
                away: this.$.awayPlayerSelector.getSelectedItems()
            }
        };
    },
    components: [
        {kind: "onyx.InputDecorator", components: [
            {kind: "onyx.Input", name: "gameNumber", placeholder: "Spielnummer"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Spielart auswählen...", style: "text-align: left;"},
            {kind: "onyx.Picker", name: "gameTypePicker"}
        ]},
        {classes: "time-picker-row", components: [
            {classes: "time-picker-label", content: "Spielbeginn"},
            {kind: "onyx.PickerDecorator", components: [
                {},
                {kind: "onyx.Picker", name: "dayPicker"}
            ]},
            {content: "."},
            {kind: "onyx.PickerDecorator", components: [
                {},
                {kind: "onyx.Picker", name: "monthPicker"}
            ]},
            {content: "."},
            {kind: "onyx.PickerDecorator", components: [
                {},
                {kind: "onyx.Picker", name: "yearPicker"}
            ]},
            {content: " "},
            {kind: "onyx.PickerDecorator", components: [
                {},
                {kind: "onyx.Picker", name: "hourPicker"}
            ]},
            {content: ":"},
            {kind: "onyx.PickerDecorator", components: [
                {},
                {kind: "onyx.Picker", name: "minutePicker"}
            ]}
        ]},
        {kind: "FittableColumns", components: [
            {kind: "FilteredSelector", name: "siteSelector", placeholder: "Halle auswählen...", displayProperty: "display_name", filterProperties: ["display_name"],
                uniqueProperty: "id", style: "width: 100%;", fit: true},
            {kind: "onyx.Button", content: "+", style: "font-size: 18pt; height: 40px; padding-top: 2px;", ontap: "newSite"}
        ]},
        {kind: "onyx.Popup", name: "sitePopup", style: "right: 0;", components: [
            {kind: "SiteForm"},
            //{kind: "onyx.Button", content: "Schließen", ontap: "clubPopupClose", style: "width: 48%; margin: 1%;"},
            {kind: "onyx.Button", content: "Speichern", ontap: "newSiteConfirm", style: "width: 100%;", classes: "onyx-affirmative"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Verband auswählen...", style: "text-align: left;"},
            {kind: "onyx.Picker", name: "unionPicker", onChange: "unionSelected"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Bezirk auswählen...", style: "text-align: left;", name: "districtPickerButton", disabled: true},
            {kind: "onyx.Picker", name: "districtPicker", onChange: "districtSelected"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Klasse auswählen...", style: "text-align: left;", name: "leaguePickerButton", disabled: true},
            {kind: "onyx.Picker", name: "leaguePicker", onChange: "leagueSelected"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Staffel auswählen...", style: "text-align: left;", name: "groupPickerButton", disabled: true},
            {kind: "onyx.Picker", name: "groupPicker", onChange: "groupSelected"}
        ]},
        {kind: "FilteredSelector", name: "homeTeamSelector", placeholder: "Heimmannschaft auswählen...", displayProperty: "display_name", filterProperties: ["display_name"],
            uniqueProperty: "id", style: "width: 50%; float: left;", onItemSelected: "teamChanged", side: "home", disabled: true},
        {kind: "FilteredSelector", name: "awayTeamSelector", placeholder: "Gastmannschaft auswählen...", displayProperty: "display_name", filterProperties: ["display_name"],
            uniqueProperty: "id", style: "width: 50%; float: right;", onItemSelected: "teamChanged", side: "away", disabled: true},
        {kind: "ReportPlayerSelector", name: "homePlayerSelector", hint: "Namen eingeben...", style: "width: 50%; float: left;", allowNewItem: true, onNewItem: "newPlayerHandler"},
        {kind: "ReportPlayerSelector", name: "awayPlayerSelector", hint: "Namen eingeben...", style: "width: 50%; float: right;", allowNewItem: true, onNewItem: "newPlayerHandler"},
        {style: "height: 200px;"}
    ]
});