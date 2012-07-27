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
            this.$.managerSelector.setSelectedItems(this.club.managers);
            this.loadClubMembers();
            this.$.managerSelectorGroup.show();
        } else {
            this.$.managerSelectorGroup.hide();
        }
    },
    create: function() {
        this.inherited(arguments);
        this.clubChanged();
        this.loadDistricts();
    },
    loadDistricts: function() {
        scoreit.handball.district.list([], enyo.bind(this, function(sender, response) {
            this.updateDistricts(response.objects);
        }));
    },
    updateDistricts: function(districts) {
        this.districts = districts;
        this.$.districtPicker.destroyClientControls();
        for (var i=0; i<this.districts.length; i++) {
            this.$.districtPicker.createComponent({
                content: this.districts[i].display_name,
                district: this.districts[i],
                active: this.club && this.club.district.id == this.districts[i].id
            });
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
            district: this.$.districtPicker.getSelected().district,
            managers: this.$.managerSelector.getSelectedItems()
        };
    },
    components: [
        {kind: "onyx.InputDecorator", classes: "input-fill", components: [
            {kind: "onyx.Input", defaultFocus: true, name: "clubName", placeholder: "Name"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {style: "width: 100%; text-align: left;", content: "Bezirk auswählen..."},
            {kind: "onyx.Picker", name: "districtPicker"}
        ]},
        {kind: "onyx.Groupbox", name: "managerSelectorGroup", components: [
            {kind: "onyx.GroupboxHeader", content: "Manager"},
            {kind: "TextFieldSelector", hint: "Namen eingeben...", displayProperty: "display_name", uniqueProperty: "id", name: "managerSelector", filterProperties: ["first_name", "last_name", "pass_number"]}
        ]}
    ]
});