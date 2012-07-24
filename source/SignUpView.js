enyo.kind({
	name: "SignUpView",
	classes: "scoreit-form",
	usernameValid: false,
	emailValid: false,
	passNumberValid: false,
	checkFirstName: function() {
		this.$.firstName.setValid(this.$.firstName.getValue() !== "");
	},
	checkLastName: function() {
		this.$.lastName.setValid(this.$.lastName.getValue() !== "");
	},
	// checkProfiles: function() {
	// 	var firstName = this.$.firstName.getValue();
	// 	var lastName = this.$.lastName.getValue();
	// 	scoreit.handball.person.list([['first_name', firstName], ['last_name', lastName], ['user', true, 'isnull']], enyo.bind(this, function(sender, response) {
	// 		this.profiles = response.objects;
	// 		this.$.profileList.setCount(this.profiles.length);
	// 		this.$.profileList.render();
	// 	}));
	// },
	checkUsername: function() {
		if (!this.$.username.getValue) {
			this.$.username.setValid(false);
			this.$.username.setErrorMessage("Bitte gib einen Benutzernamen ein!");
		} else {
			this.$.username.setValid(null);
			scoreit.auth.user.isUnique({user_name: this.$.username.getValue()}, enyo.bind(this, function(sender, response){
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
			scoreit.auth.user.isUnique({email: this.$.email.getValue()}, enyo.bind(this, function(sender, response){
				if (response.email) {
					this.$.email.setValid(true);
				} else {
					this.$.email.setValid(false);
					this.$.email.setErrorMessage("Es exisistiert bereits ein Account mit dieser Emailadresse.");
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
		scoreit.signUp(this.$.username.getValue(), this.$.password1.getValue(), this.$.email.getValue(), this.$.firstName.getValue(),
			this.$.lastName.getValue(), enyo.bind(this, function(sender, response) {
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
		// {kind: "onyx.Groupbox", components: [
			{kind: "FormField", name: "firstName", placeholder: "Vorname", required: true, onchange: "checkFirstName", errorMessage: "Bitte gib deinen Namen ein!"},
			{kind: "FormField", name: "lastName", placeholder: "Nachname", required: true, onchange: "checkLastName", errorMessage: "Bitte gib deinen Namen ein!"},
			{kind: "FormField", name: "email", placeholder: "Email", required: true, onchange: "checkEmail"},
			{kind: "FormField", name: "username", placeholder: "Benutzername", required: true, onchange: "checkUsername"},
			{kind: "FormField", name: "password1", type: "password", placeholder: "Passwort", required: true, onchange: "checkPassword"},
			{kind: "FormField", name: "password2", type: "password", placeholder: "Passwort wiederholen", required: true, onchange: "checkPassword"},
		// ]},
		// {kind: "onyx.Groupbox", components: [
		// 	{kind: "onyx.GroupboxHeader", content: "Bist du einer der folgenden Spieler?"},
		// 	{kind: "FlyweightRepeater", name: "profileList", onSetupItem: "setupProfiles", components: [
		// 		{kind: "onyx.Item", ontap: "profileTapped", components: [
		// 			{name: "checkmark", classes: "item-checkmark"},
		// 			{name: "playerName"}
		// 		]}
		// 	]}
		// ]},
		{kind: "onyx.Button", content: "Abschicken", ontap: "submit", classes: "onyx-affirmative", style: "width: 100%;"}
	]
});