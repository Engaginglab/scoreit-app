enyo.kind({
    name: "ReportForm",
    classes: "scoreit-form",
    reset: function() {
        this.setupTimePicker();
        this.loadSites();
        this.loadUnions();
        this.loadPersons();
        this.loadTeams();
        this.loadGroups();
    },
    setupTimePicker: function() {
        var now = new Date();
        for (var i=1; i<=31; i++) {
            this.$.dayPicker.createComponent({
                content: i,
                active: now.getDate() == i
            });
        }
        this.$.dayPicker.render();
        for (var i=1; i<=12; i++) {
            this.$.monthPicker.createComponent({
                content: i,
                value: i,
                active: now.getMonth() == i
            });
        }
        this.$.monthPicker.render();
        for (var i=now.getFullYear()-5; i<=now.getFullYear()+5; i++) {
            this.$.yearPicker.createComponent({
                content: i,
                value: i,
                active: now.getFullYear() == i
            });
        }
        this.$.yearPicker.render();
        for (var i=0; i<=23; i++) {
            this.$.hourPicker.createComponent({
                content: i < 10 ? "0" + i : i,
                value: i,
                active: now.getHours() == i
            });
        }
        this.$.hourPicker.render();
        for (var i=0; i<=59; i++) {
            this.$.minutePicker.createComponent({
                content: i < 10 ? "0" + i : i,
                value: i,
                active: now.getMinutes() == i
            });
        }
        this.$.minutePicker.render();
    },
    loadPersons: function() {
        scoreit.handball.person.list([], enyo.bind(this, function(sender, response) {
            this.$.supervisorSelector.setItems(response.objects);
            this.$.refereeSelector.setItems(response.objects);
            this.$.secretarySelector.setItems(response.objects);
            this.$.timerSelector.setItems(response.objects);
        }));
    },
    loadSites: function() {
        scoreit.handball.site.list([], enyo.bind(this, function(sender, response) {
            this.$.siteSelector.setItems(response.objects);
        }));
    },
    loadUnions: function() {
        scoreit.handball.union.list([], enyo.bind(this, function(sender, response) {
            this.populatePicker(this.$.unionPicker, response.objects, "name");
        }));
    },
    unionSelected: function() {
        this.loadDistricts();
        this.loadGroups();
    },
    loadDistricts: function() {
        var union = this.$.unionPicker.getSelected().value;
        scoreit.handball.district.list([["union", union.id]], enyo.bind(this, function(sender, response) {
            this.populatePicker(this.$.districtPicker, response.objects, "name");
            this.$.districtPickerButton.setDisabled(false);
        }));
    },
    districtSelected: function() {
        this.loadGroups();
    },
    loadGroups: function() {
        var union = this.$.unionPicker.getSelected() ? this.$.unionPicker.getSelected().value : null;
        var district = this.$.districtPicker.getSelected() ? this.$.districtPicker.getSelected().value : null;
        var unionFilter = union ? ["union", union.id] : ["union", true, "isnull"];
        var districtFilter = district ? ["district", district.id] : ["district", true, "isnull"];
        scoreit.handball.group.list([unionFilter, districtFilter,
            ["age_group", this.$.ageGroupPicker.getSelected().value],
            ["gender", this.$.genderPicker.getActive().value]], enyo.bind(this, function(sender, response) {
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
        picker.render();
    },
    loadTeams: function() {
        // var district = this.$.districtPicker.getSelected().value;
        scoreit.handball.team.list([], enyo.bind(this, function(sender, reponse) {
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
        this.$.siteForm.siteChanged();
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
    newGroup: function() {
        this.$.groupForm.setGroup({
            name: "",
            gender: this.$.genderPicker.getActive().value,
            age_group: this.$.ageGroupPicker.getSelected().value,
            level: null,
            union: this.$.unionPicker.getSelected() ? this.$.unionPicker.getSelected().value : null,
            district: this.$.districtPicker.getSelected() ? this.$.districtPicker.getSelected().value : null
        });
        this.$.groupPopup.show();
    },
    newGroupConfirm: function() {
        this.$.groupPopup.hide();
        var group = this.$.groupForm.getData();
        this.$.groupPicker.createComponent({
            content: group.name,
            value: group,
            active: true
        });
        this.$.groupPicker.render();
    },
    getData: function() {
        var start = new Date();
        start.setDate(this.$.dayPicker.getSelected().value);
        start.setMonth(this.$.monthPicker.getSelected().value);
        start.setFullYear(this.$.yearPicker.getSelected().value);
        start.setHours(this.$.hourPicker.getSelected().value);
        start.setMinutes(this.$.minutePicker.getSelected().value);

        return {
            number: this.$.gameNumber.getValue() || null,
            start: start,
            group: this.$.groupPicker.getSelected() ? this.$.groupPicker.getSelected().value : null,
            site: this.$.siteSelector.getSelectedItem(),
            home: this.$.homeTeamSelector.getSelectedItem(),
            away: this.$.awayTeamSelector.getSelectedItem(),
            players: {
                home: this.$.homePlayerSelector.getSelectedItems(),
                away: this.$.awayPlayerSelector.getSelectedItems()
            },
            supervisor: this.$.supervisorSelector.getSelectedItem(),
            referee: this.$.refereeSelector.getSelectedItem(),
            secretary: this.$.secretarySelector.getSelectedItem(),
            timer: this.$.timerSelector.getSelectedItem()
        };
    },
    components: [
        {kind: "onyx.InputDecorator", components: [
            {kind: "onyx.Input", style: "width: 100%", name: "gameNumber", placeholder: "Spielnummer"}
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
        {kind: "onyx.RadioGroup", components: [
            {content: "Meisterschaftsspiel", value: "league", style: "width: 33.3%; height: 40px; box-sizing: border-box;", active: true},
            {content: "Freundschaftspiel", value: "friendly", style: "width: 33.3%; height: 40px; box-sizing: border-box;"},
            {content: "Pokalspiel", value: "cup", style: "width: 33.4%; height: 40px; box-sizing: border-box;"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Altersgruppe auswählen..."},
            {kind: "onyx.Picker", name: "ageGroupPicker", onChange: "ageGroupSelected", components: [
                {content: "Erwachsene", value: "adults", active: true},
                {content: "Jugend A", value: "juniors_a"},
                {content: "Jugend B", value: "juniors_b"},
                {content: "Jugend C", value: "juniors_c"},
                {content: "Jugend D", value: "juniors_d"},
                {content: "Jugend E", value: "juniors_e"}
            ]}
        ]},
        {kind: "onyx.RadioGroup", name: "genderPicker", components: [
            {content: "männlich", value: "male", style: "width: 50%; height: 40px; box-sizing: border-box;", active: true},
            {content: "weiblich", value: "female", style: "width: 50%; height: 40px; box-sizing: border-box;"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Verband auswählen..."},
            {kind: "onyx.Picker", name: "unionPicker", onChange: "unionSelected"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Bezirk auswählen...", name: "districtPickerButton", disabled: true},
            {kind: "onyx.Picker", name: "districtPicker", onChange: "districtSelected"}
        ]},
        {kind: "FittableColumns", components: [
            {kind: "onyx.PickerDecorator", fit: true, layoutKind: "FittableColumnsLayout", components: [
                {content: "Klasse auswählen...", name: "groupPickerButton", style: "display: inline-block; width: 100%; text-align: left;"},
                {kind: "onyx.Picker", name: "groupPicker", onChange: "groupSelected"}
            ]},
            {kind: "onyx.Button", content: "+", style: "font-size: 18pt; height: 40px; padding-top: 2px; style: display: inline-block; width: auto;", ontap: "newGroup"}
        ]},
        {kind: "onyx.Popup", name: "groupPopup", style: "width: 300px; right: 0;", components: [
            {kind: "LeagueForm", name: "groupForm"},
            //{kind: "onyx.Button", content: "Schließen", ontap: "clubPopupClose", style: "width: 48%; margin: 1%;"},
            {kind: "onyx.Button", content: "Speichern", ontap: "newGroupConfirm", style: "width: 100%;", classes: "onyx-affirmative"}
        ]},
        {kind: "FittableColumns", components: [
            {kind: "FilteredSelector", name: "siteSelector", placeholder: "Halle auswählen...", displayProperty: "display_name", filterProperties: ["display_name"],
                uniqueProperty: "id", style: "width: 100%; text-align: left;", fit: true},
            {kind: "onyx.Button", content: "+", style: "font-size: 18pt; height: 40px; padding-top: 2px;", ontap: "newSite"}
        ]},
        {kind: "onyx.Popup", name: "sitePopup", style: "width: 300px; right: 0;", components: [
            {kind: "SiteForm"},
            {kind: "onyx.Button", content: "Speichern", ontap: "newSiteConfirm", style: "width: 100%;", classes: "onyx-affirmative"}
        ]},
        {kind: "FilteredSelector", name: "homeTeamSelector", placeholder: "Heimmannschaft auswählen...", displayProperty: "display_name", filterProperties: ["display_name"],
            uniqueProperty: "id", style: "width: 50%; float: left;", onItemSelected: "teamChanged", side: "home", disabled: true},
        {kind: "FilteredSelector", name: "awayTeamSelector", placeholder: "Gastmannschaft auswählen...", displayProperty: "display_name", filterProperties: ["display_name"],
            uniqueProperty: "id", style: "width: 50%; float: right;", onItemSelected: "teamChanged", side: "away", disabled: true},
        {kind: "ReportPlayerSelector", name: "homePlayerSelector", hint: "Namen eingeben...", style: "width: 50%; float: left; margin: 5px 0;", allowNewItem: true, onNewItem: "newPlayerHandler"},
        {kind: "ReportPlayerSelector", name: "awayPlayerSelector", hint: "Namen eingeben...", style: "width: 50%; float: right;; margin: 5px 0;", allowNewItem: true, onNewItem: "newPlayerHandler"},
        {kind: "FilteredSelector", name: "supervisorSelector", placeholder: "Spielleitende Stelle auswählen...", displayProperty: "display_name",
            filterProperties: ["display_name"], uniqueProperty: "id"},
        {kind: "FilteredSelector", name: "refereeSelector", placeholder: "Schiedrichter auswählen...", displayProperty: "display_name",
            filterProperties: ["display_name"], uniqueProperty: "id"},
        {kind: "FilteredSelector", name: "secretarySelector", placeholder: "Sekretär auswählen...", displayProperty: "display_name",
            filterProperties: ["display_name"], uniqueProperty: "id"},
        {kind: "FilteredSelector", name: "timerSelector", placeholder: "Zeitnehmer auswählen...", displayProperty: "display_name",
            filterProperties: ["display_name"], uniqueProperty: "id"}
    ]
});