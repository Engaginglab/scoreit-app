enyo.kind({
    name: "ProfileForm",
    classes: "scoreit-form",
    published: {
        user: null,
        profile: null
    },
    userChanged: function() {
        if (this.user) {
            this.$.firstName.setValue(this.user.first_name);
            this.$.lastName.setValue(this.user.last_name);
            this.$.firstName.setDisabled(true);
            this.$.lastName.setDisabled(true);
        } else {
            this.$.firstName.setValue("");
            this.$.lastName.setValue("");
            this.$.firstName.setDisabled(false);
            this.$.lastName.setDisabled(false);
        }
    },
    profileChanged: function() {
        if (this.profile) {
            if (!this.user) {
                this.$.firstName.setValue(this.profile.first_name);
                this.$.lastName.setValue(this.profile.last_name);
            }
            // this.$.clubSelector.setSelectedItem(this.profile.clubs[0]);
            this.$.maleOption.setActive(this.profile.gender == "male");
            this.$.femaleOption.setActive(this.profile.gender == "female");
            this.$.passNumber.setValue(this.profile.pass_number);
            this.$.address.setValue(this.profile.address);
            this.$.city.setValue(this.profile.city);
            this.$.zipCode.setValue(this.profile.zip_code);
            this.$.mobileNumber.setValue(this.profile.mobile_number);
        } else {
            // this.$.clubSelector.setSelectedItem(null);
            this.$.maleOption.setActive(true);
            this.$.femaleOption.setActive(false);
            this.$.passNumber.setValue("");
            this.$.address.setValue("");
            this.$.city.setValue("");
            this.$.zipCode.setValue("");
            this.$.mobileNumber.setValue("");
        }
    },
    create: function() {
        this.inherited(arguments);
        // this.loadClubs();
        this.userChanged();
        this.profileChanged();
    },
    // loadClubs: function() {
    //     scoreit.handball.club.list([], enyo.bind(this, function(sender, response) {
    //         this.$.clubSelector.setItems(response.objects);
    //     }));
    // },
    checkPassNumber: function() {
        var passNumber = this.$.passNumber.getValue();

        if (!passNumber) {
            this.$.passNumber.setValid(null);
        } else if (isNaN(parseInt(passNumber, 10))) {
            this.$.passNumber.setValid(false);
            this.$.passNumber.setErrorMessage("Die Passnummer muss eine ganze Zahl sein!");
        } else {
            this.$.passNumber.setValid(null);
            scoreit.handball.person.isUnique({pass_number: this.$.passNumber.getValue()}, enyo.bind(this, function(sender, response){
                if (response.pass_number) {
                    this.$.passNumber.setValid(true);
                } else {
                    this.$.passNumber.setValid(false);
                    this.$.passNumber.setErrorMessage("Es gibt bereits einen Spieler mit dieser Passnummer!");
                }
            }));
        }
    },
    newClub: function(sender, event) {
        this.$.clubForm.setClub(null);
        var bound = sender.getBounds();
        this.$.clubPopup.show();
    },
    // clubFormConfirm: function() {
    //     this.$.clubPopup.hide();
    //     var club = this.$.clubForm.getData();
    //     this.$.clubSelector.setItems(this.$.clubSelector.getItems().concat([club]));
    //     this.$.clubSelector.setSelectedItem(club);
    // },
    getData: function() {
        return {
            id: this.profile ? this.profile.id : undefined,
            user: this.user,
            first_name: this.$.firstName.getValue(),
            last_name: this.$.lastName.getValue(),
            // clubs: [this.$.clubSelector.getSelectedItem().resource_uri || this.$.clubSelector.getSelectedItem()],
            gender: this.$.genderPicker.getSelected().value,
            pass_number: this.$.passNumber.getValue() || null,
            address: this.$.address.getValue(),
            city: this.$.city.getValue(),
            zip_code: this.$.zipCode.getValue() || null,
            mobile_number: this.$.mobileNumber.getValue()
        };
    },
    components: [
        {kind: "onyx.InputDecorator", classes: "input-fill", components: [
            {kind: "onyx.Input", name: "firstName", placeholder: "Vorname", disabled: true}
        ]},
        {kind: "onyx.InputDecorator", classes: "input-fill", components: [
            {kind: "onyx.Input", name: "lastName", placeholder: "Nachname", disabled: true}
        ]},
        // {kind: "FittableColumns", name: "clubWrapper", components: [
        //     {kind: "FilteredSelector", name: "clubSelector", placeholder: "Verein auswählen...", displayProperty: "name", filterProperties: ["name"],
        //         uniqueProperty: "id", style: "width: 100%;", fit: true},
        //     {kind: "onyx.Button", content: "+", style: "font-size: 18pt; height: 40px; padding-top: 2px;", ontap: "newClub"}
        // ]},
        // {kind: "onyx.Popup", name: "clubPopup", style: "right: 0;", components: [
        //     {kind: "ClubForm"},
        //     //{kind: "onyx.Button", content: "Schließen", ontap: "clubPopupClose", style: "width: 48%; margin: 1%;"},
        //     {kind: "onyx.Button", content: "Speichern", ontap: "clubFormConfirm", style: "width: 100%;", classes: "onyx-affirmative"}
        // ]},
        {kind: "onyx.PickerDecorator", components: [
            {style: "text-align: left;"},
            {kind: "onyx.Picker", name: "genderPicker", components: [
                {name: "maleOption", content: "männlich", value: "male", active: true},
                {name: "femaleOption", content: "weiblich", value: "female"}
            ]}
        ]},
        // {classes: "date-picker-row", components: [
        //  {content: "Geburtstag"},
        //  {kind: "onyx.PickerDecorator", components: [
        //      {},
        //      {kind: "onyx.Picker", name: "birthdayDayPicker"}
        //  ]},
        //  {kind: "onyx.PickerDecorator", components: [
        //      {},
        //      {kind: "onyx.Picker", name: "birthdayMonthPicker"}
        //  ]},
        //  {kind: "onyx.PickerDecorator", components: [
        //      {},
        //      {kind: "onyx.Picker", name: "birthdayYearPicker"}
        //  ]}
        // ]},
        {kind: "FormField", name: "passNumber", placeholder: "Passnummer", onchange: "checkPassNumber"},
        {kind: "FormField", name: "address", placeholder: "Adresse"},
        {kind: "FormField", name: "zipCode", placeholder: "Postleitzahl"},
        {kind: "FormField", name: "city", placeholder: "Stadt"},
        {kind: "FormField", name: "mobileNumber", placeholder: "Handynummer"}
    ]
});