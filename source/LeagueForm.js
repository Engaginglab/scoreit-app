enyo.kind({
    name: "LeagueForm",
    classes: "scoreit-form",
    published: {
        group: null
    },
    create: function() {
        this.inherited(arguments);
        this.loadDistricts();
        this.loadUnions();
        this.loadLeagueLevels();
    },
    clear: function() {
        this.setGroup(null);
        this.groupChanged();
    },
    groupChanged: function() {
        if (this.group) {
            this.$.name.setValue(this.group.name);
            this.$[this.group.gender + "Button"].setActive(true);
            this.$[this.group.age_group + "Button"].setActive(true);
        } else {
            this.$.name.setValue("");
            this.$.maleButton.setActive(true);
            this.$.adultsButton.setActive(true);
        }
        this.updateUnions();
        this.updateDistricts();
        this.updateLeagueLevels();
    },
    loadUnions: function() {
        scoreit.handball.union.list([], enyo.bind(this, function(sender, response) {
            this.unions = response.objects;
            this.updateUnions();
        }));
    },
    updateUnions: function() {
        this.$.unionPicker.destroyClientControls();
        if (this.unions) {
            for (var i=0; i<this.unions.length; i++) {
                this.$.unionPicker.createComponent({
                    content: this.unions[i].name,
                    value: this.unions[i],
                    active: this.group && this.group.union && this.group.union.id == this.unions[i].id
                });
            }
        }
        this.$.unionPicker.render();
    },
    unionSelected: function() {
        this.loadDistricts();
    },
    loadDistricts: function() {
        var union = this.$.unionPicker.getSelected() ? this.$.unionPicker.getSelected().value : null;
        scoreit.handball.district.list(union ? [["union", union.id]] : [], enyo.bind(this, function(sender, response) {
            this.districts = response.objects;
            this.updateDistricts();
        }));
    },
    updateDistricts: function() {
        this.$.districtPicker.destroyClientControls();
        if (this.districts) {
            for (var i=0; i<this.districts.length; i++) {
                this.$.districtPicker.createComponent({
                    content: this.districts[i].name,
                    value: this.districts[i],
                    active: this.group && this.group.district && this.group.district.id == this.districts[i].id
                });
            }
        }
        this.$.districtPicker.render();
    },
    loadLeagueLevels: function() {
        scoreit.handball.leaguelevel.list([], enyo.bind(this, function(sender, response) {
            this.leagueLevels = response.objects;
            this.updateLeagueLevels();
        }));
    },
    updateLeagueLevels: function() {
        this.$.leagueLevelPicker.destroyClientControls();
        if (this.leagueLevels) {
            for (var i=0; i<this.leagueLevels.length; i++) {
                this.$.leagueLevelPicker.createComponent({
                    content: this.leagueLevels[i].name,
                    value: this.leagueLevels[i],
                    active: this.group && this.group.level && this.group.level.id == this.leagueLevels[i].id
                });
            }
        }
        this.$.leagueLevelPicker.render();
    },
    leagueLevelSelected: function() {
        var leaguelevel = this.$.leagueLevelPicker.getSelected().value;
        this.$.unionPickerButton.setDisabled(!leaguelevel.union_specific);
        this.$.districtPickerButton.setDisabled(!leaguelevel.district_specific);
    },
    getData: function() {
        var level = this.$.leagueLevelPicker.getSelected() ? this.$.leagueLevelPicker.getSelected().value : null;
        var union = level && level.union_specific && this.$.unionPicker.getSelected() ? this.$.unionPicker.getSelected().value : null;
        var district = level && level.district_specific && this.$.districtPicker.getSelected() ? this.$.districtPicker.getSelected().value : null;

        return {
            name: this.$.name.getValue(),
            gender: this.$.genderPicker.getActive().value,
            age_group: this.$.ageGroupPicker.getSelected() ? this.$.ageGroupPicker.getSelected().value : null,
            level: level,
            union: union,
            district: district
        };
    },
    components: [
        {kind: "onyx.InputDecorator", components: [
            {kind: "onyx.Input", name: "name", placeholder: "Name", style: "width: 100%;"}
        ]},
        {kind: "onyx.RadioGroup", name: "genderPicker", components: [
            {content: "männlich", value: "male", style: "width: 50%; height: 40px; box-sizing: border-box;", active: true, name: "maleButton"},
            {content: "weiblich", value: "female", style: "width: 50%; height: 40px; box-sizing: border-box;", name: "femaleButton"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Altersgruppe auswählen..."},
            {kind: "onyx.Picker", name: "ageGroupPicker", onChange: "ageGroupSelected", components: [
                {content: "Erwachsene", value: "adults", name: "adultsButton", active: true},
                {content: "Jugend A", value: "juniors_a", name: "juniors_aButton"},
                {content: "Jugend B", value: "juniors_b", name: "juniors_bButton"},
                {content: "Jugend C", value: "juniors_c", name: "juniors_cButton"},
                {content: "Jugend D", value: "juniors_d", name: "juniors_dButton"},
                {content: "Jugend E", value: "juniors_e", name: "juniors_eButton"}
            ]}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Ligahöhe auswählen..."},
            {kind: "onyx.Picker", name: "leagueLevelPicker", onChange: "leagueLevelSelected"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Verband auswählen...", name: "unionPickerButton"},
            {kind: "onyx.Picker", name: "unionPicker", onChange: "unionSelected"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {content: "Bezirk auswählen...", name: "districtPickerButton"},
            {kind: "onyx.Picker", name: "districtPicker", onChange: "districtSelected"}
        ]}
    ]
});