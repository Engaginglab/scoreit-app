enyo.kind({
    name: "EditClubView",
    published: {
        club: null
    },
    events: {
        onCancel: ""
    },
    clubChanged: function() {
        this.$.clubName.setValue(this.club.name);
    },
    create: function() {
        this.inherited(arguments);
        scoreit.district.list([], enyo.bind(this, function(sender, response) {
            this.updateDistricts(response.objects);
        }));
        scoreit.person.list([], enyo.bind(this, function(sender, response) {
            this.updateManagers(response.objects);
        }));
        // scoreit.union.list([], enyo.bind(this, function(sender, response) {
        //     this.$.unionSelector.setItems(response.objects);
        // }));
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
    updateManagers: function(managers) {
        this.$.managerSelector.setItems(managers);
        if (this.club) {
            this.$.managerSelector.setSelectedItems(this.club.managers);
        }
    },
    save: function() {
        var params = {
            name: this.$.clubName.getValue(),
            district: this.$.districtPicker.getSelected().district,
            managers: this.$.managerSelector.getSelectedItems()
        };
        this.log(params);
        var callback = enyo.bind(this, function(sender, response) {
            this.log(response);
        });
        if (this.club) {
            scoreit.club.put(this.club.id, params, callback);
        } else {
            scoreit.club.create(params, callback);
        }
    },
    components: [
        {kind: "onyx.Groupbox", components: [
            {kind: "onyx.InputDecorator", classes: "input-fill", components: [
                {kind: "onyx.Input", name: "clubName"},
                {classes: "label", content: "Name"}
            ]},
            {kind: "onyx.PickerDecorator", components: [
                {style: "width: 100%; text-align: left;"},
                {kind: "onyx.Picker", name: "districtPicker"}
            ]},
            {kind: "onyx.GroupboxHeader", content: "Manager"},
            {kind: "TextFieldSelector", displayProperty:"display_name", uniqueProperty: "id", name: "managerSelector", filterProperties: ["first_name", "last_name", "pass_number"]}
        ]},
        {kind: "onyx.Button", content: "Speichern", ontap: "save", style: "width: 50%;"},
        {kind: "onyx.Button", content: "Abbrechen", ontap: "doCancel", style: "width: 50%;"}
    ]
});