enyo.kind({
    name: "ClubForm",
    classes: "scoreit-form",
    published: {
        club: null
    },
    events: {
        onCancel: ""
    },
    clubChanged: function() {
        if (this.club) {
            this.$.clubName.setValue(this.club.name);
        } else {
            this.$.clubName.setValue("");
        }
        this.updateDistricts();
    },
    create: function() {
        this.inherited(arguments);
        this.districts = [];
        this.clubChanged();
        this.loadDistricts();
    },
    loadDistricts: function() {
        scoreit.handball.district.list([], enyo.bind(this, function(sender, response) {
            this.districts = response.objects;
            this.updateDistricts();
        }));
    },
    updateDistricts: function() {
        this.$.districtPicker.destroyClientControls();
        if (this.districts) {
            for (var i=0; i<this.districts.length; i++) {
                this.$.districtPicker.createComponent({
                    content: this.districts[i].display_name,
                    value: this.districts[i],
                    active: this.club && this.club.district.id == this.districts[i].id
                });
            }
        }
        this.$.districtPicker.render();
    },
    loadClubMembers: function() {
        scoreit.handball.person.list([["clubs", this.club.id]], enyo.bind(this, function(sender, response) {
            this.$.managerSelector.setItems(managers);
        }));
    },
    getData: function() {
        return {
            id: this.club ? this.club.id : undefined,
            name: this.$.clubName.getValue(),
            district: this.$.districtPicker.getSelected() ? this.$.districtPicker.getSelected().value : null
        };
    },
    components: [
        {kind: "onyx.InputDecorator", classes: "input-fill", components: [
            {kind: "onyx.Input", defaultFocus: true, name: "clubName", placeholder: "Name"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {style: "width: 100%; text-align: left;", content: "Bezirk auswählen..."},
            {kind: "onyx.Picker", name: "districtPicker"}
        ]}
        // {kind: "onyx.Groupbox", name: "managerSelectorGroup", components: [
        //     {kind: "onyx.GroupboxHeader", content: "Manager"},
        //     {kind: "TextFieldSelector", hint: "Namen eingeben...", displayProperty: "display_name", uniqueProperty: "id", name: "managerSelector", filterProperties: ["first_name", "last_name", "pass_number"]}
        // ]}
    ]
});