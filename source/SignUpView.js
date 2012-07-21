enyo.kind({
	name: "SignUpView",
	usernameValid: false,
	emailValid: false,
	passNumberValid: false,
	checkUnique: function() {
		scoreit.isUnique(this.$.username.getValue(), this.$.email.getValue(), this.$.passNumber.getValue(), enyo.bind(this, function(sender, response){
			this.log(JSON.stringify(response));
		}));
	},
	checkFirstName: function() {
		this.$.firstName.setValid(this.$.firstName.getValue() !== "");
		// this.checkProfiles();
	},
	checkLastName: function() {
		this.$.lastName.setValid(this.$.lastName.getValue() !== "");
		// this.checkProfiles();
	},
	checkProfiles: function() {
		var firstName = this.$.firstName.getValue();
		var lastName = this.$.lastName.getValue();
		scoreit.person.list([['first_name', firstName], ['last_name', lastName], ['user', true, 'isnull']], enyo.bind(this, function(sender, response) {
			this.profiles = response.objects;
			this.$.profileList.setCount(this.profiles.length);
			this.$.profileList.render();
		}));
	},
	checkUsername: function() {
		if (!this.$.username.getValue) {
			this.$.username.setValid(false);
			this.$.username.setErrorMessage("Bitte gib einen Benutzernamen ein!");
		} else {
			this.$.username.setValid(null);
			scoreit.isUnique(this.$.username.getValue(), null, null, enyo.bind(this, function(sender, response){
				if (response.user_name) {
					this.$.username.setValid(true);
				} else {
					this.$.username.setValid(false);
					this.$.username.setErrorMessage("Dieser Benutzername ist bereits vergeben.");
				}
			}));
		}
	},
	checkEmail: function() {
		var pattern = /^([\w\d\-\.]+)@{1}(([\w\d\-]{1,67})|([\w\d\-]+\.[\w\d\-]{1,67}))\.(([a-zA-Z\d]{2,4})(\.[a-zA-Z\d]{2})?)$/;
		var email = this.$.email.getValue();

		if (!email) {
			this.$.email.setValid(false);
			this.$.email.setErrorMessage("Bitte gib deine Emailadresse ein!");
		} else if (!email.match(pattern)) {
			this.$.email.setValid(false);
			this.$.email.setErrorMessage("Bitte gib eine korrekte Emailadresse ein!");
		} else {
			this.$.email.setValid(null);
			scoreit.isUnique(null, this.$.email.getValue(), null, enyo.bind(this, function(sender, response){
				if (response.email) {
					this.$.email.setValid(true);
				} else {
					this.$.email.setValid(false);
					this.$.email.setErrorMessage("Es exisistiert bereits ein Account mit dieser Emailadresse.");
				}
			}));
		}
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
			scoreit.isUnique(null, null, this.$.passNumber.getValue(), enyo.bind(this, function(sender, response){
				if (response.pass_number) {
					this.$.passNumber.setValid(true);
				} else {
					this.$.passNumber.setValid(false);
					this.$.passNumber.setErrorMessage("Es gibt bereits einen Spieler mit dieser Passnummer!");
				}
			}));
		}
	},
	checkPassword: function() {
		var same = this.$.password1.getValue() == this.$.password2.getValue();

		if (!this.$.password1.getValue()) {
			this.$.password1.setValid(false);
			this.$.password2.setValid(false);
			this.$.password1.setErrorMessage("Bitte ein Passwort eingeben!");
		} else if (this.$.password1.getValue() && this.$.password2.getValue() && !same) {
			this.$.password1.setValid(false);
			this.$.password2.setValid(false);
			this.$.password1.setErrorMessage("Passwörter stimmen nicht überein!");
		} else {
			this.$.password1.setValid(true);
			this.$.password2.setValid(true);
		}
	},
	allValid: function() {
		return usernameValid && emailValid && passNumberValid && checkPassword();
	},
	submit: function() {
		var profileId = this.profile ? this.profile.id : undefined;
		scoreit.signUp(this.$.username.getValue(), this.$.password1.getValue(), this.$.email.getValue(), this.$.firstName.getValue(),
			this.$.lastName.getValue(), profileId, enyo.bind(this, function(sender, response) {
				this.log(JSON.stringify(response));
			}), enyo.bind(this, function(sender, response) {
				this.log(JSON.stringify(response));
			}));
	},
	// setupProfiles: function(sender, event) {
	// 	var profile = this.profiles[event.index];

	// 	this.$.playerName.setContent(profile.first_name + " " + profile.last_name);
	// 	this.$.checkmark.setShowing(this.profile == profile);
	// },
	// profileTapped: function(sender, event) {
	// 	this.profile = this.profiles[event.index];
	// 	this.$.passNumber.setValue(this.profile.pass_number);
	// 	this.$.address.setValue(this.profile.address);
	// 	this.$.city.setValue(this.profile.city);
	// 	this.$.zipCode.setValue(this.profile.zip_code);
	// 	this.$.mobileNumber.setValue(this.profile.mobile_number);
	// 	this.$.profileList.render();
	// },
	components: [
		{kind: "onyx.Groupbox", components: [
			{kind: "FormField", name: "firstName", placeholder: "Vorname", required: true, onchange: "checkFirstName", errorMessage: "Bitte gib deinen Namen ein!"},
			{kind: "FormField", name: "lastName", placeholder: "Nachname", required: true, onchange: "checkLastName", errorMessage: "Bitte gib deinen Namen ein!"},
			{kind: "FormField", name: "email", placeholder: "Email", required: true, onchange: "checkEmail"},
			{kind: "FormField", name: "username", placeholder: "Benutzername", required: true, onchange: "checkUsername"},
			{kind: "FormField", name: "password1", type: "password", placeholder: "Passwort", required: true, onchange: "checkPassword"},
			{kind: "FormField", name: "password2", type: "password", placeholder: "Passwort wiederholen", required: true, onchange: "checkPassword"}
		]},
		// {kind: "onyx.Groupbox", components: [
		// 	{kind: "onyx.GroupboxHeader", content: "Bist du einer der folgenden Spieler?"},
		// 	{kind: "FlyweightRepeater", name: "profileList", onSetupItem: "setupProfiles", components: [
		// 		{kind: "onyx.Item", ontap: "profileTapped", components: [
		// 			{name: "checkmark", classes: "item-checkmark"},
		// 			{name: "playerName"}
		// 		]}
		// 	]}
		// ]},
		// {kind: "onyx.Groupbox", components: [
		// 	{kind: "onyx.GroupboxHeader", content: "Spielerprofil"},
		// 	{classes: "buttongroup", components: [
		// 		{kind: "FilteredSelector", caption: "Verein", displayProperty: "display_name", filterProperties: ["display_name"], uniqueProperty: "id",
		// 			style: "width: 90%;"},
		// 		{kind: "onyx.Button", content: "+", style: "width: 10%"}
		// 	]},
		// 	{kind: "onyx.custom.SelectDecorator", components: [
		// 		{kind: "Select", name: "gender", components: [
		// 			{content: "Männlich", value: "male"},
		// 			{content: "Weiblich", value: "female"}
		// 		]}
		// 	]},
		// 	{kind: "FormField", name: "passNumber", placeholder: "Passnummer", onchange: "checkPassNumber"},
		// 	{kind: "FormField", name: "address", placeholder: "Adresse"},
		// 	{kind: "FormField", name: "city", placeholder: "Stadt"},
		// 	{kind: "FormField", name: "zipCode", placeholder: "Postleitzahl"},
		// 	{kind: "FormField", name: "mobileNumber", placeholder: "Handynummer"}
		// ]},
		{kind: "onyx.Button", content: "Abschicken", ontap: "submit", style: "width: 100%;"}
	]
});