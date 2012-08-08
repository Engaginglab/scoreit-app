enyo.kind({
    name: "LightweightPersonForm",
    classes: "scoreit-form",
    published: {
        person: null
    },
    profileChanged: function() {
        if (this.profile) {
            this.$.firstName.setValue(this.profile.first_name);
            this.$.lastName.setValue(this.profile.last_name);
            this.$.maleOption.setActive(this.profile.gender == "male");
            this.$.femaleOption.setActive(this.profile.gender == "female");
            this.$.passNumber.setValue(this.profile.pass_number);
        } else {
            this.$.firstName.setValue("");
            this.$.lastName.setValue("");
            this.$.maleOption.setActive(true);
            this.$.femaleOption.setActive(false);
            this.$.passNumber.setValue("");
        }
    },
    create: function() {
        this.inherited(arguments);
        this.profileChanged();
    },
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
    getData: function() {
        return {
            id: this.person ? this.person.id : undefined,
            first_name: this.$.firstName.getValue(),
            last_name: this.$.lastName.getValue(),
            gender: this.$.genderPicker.getSelected().value,
            pass_number: this.$.passNumber.getValue() || null
        };
    },
    components: [
        {kind: "onyx.InputDecorator", classes: "input-fill", components: [
            {kind: "onyx.Input", name: "firstName", placeholder: "Vorname"}
        ]},
        {kind: "onyx.InputDecorator", classes: "input-fill", components: [
            {kind: "onyx.Input", name: "lastName", placeholder: "Nachname"}
        ]},
        {kind: "onyx.PickerDecorator", components: [
            {style: "text-align: left;"},
            {kind: "onyx.Picker", name: "genderPicker", components: [
                {name: "maleOption", content: "männlich", value: "male", active: true},
                {name: "femaleOption", content: "weiblich", value: "female"}
            ]}
        ]},
        {kind: "FormField", name: "passNumber", placeholder: "Passnummer", onchange: "checkPassNumber"}
    ]
});