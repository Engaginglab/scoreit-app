enyo.kind({
	name: "SignUpForm",
	classes: "scoreit-form",
	events: {
		onSubmit: ""
	},
	create: function() {
		this.inherited(arguments);
		this.usernameValid = false;
		this.emailValid = false;
		this.passNumberValid = false;
	},
	checkFirstName: function() {
		this.$.firstName.setValid(this.$.firstName.getValue() !== "");
	},
	checkLastName: function() {
		this.$.lastName.setValid(this.$.lastName.getValue() !== "");
	},
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
		var data = {
			username: this.$.username.getValue(),
			password: this.$.password1.getValue(),
			email: this.$.email.getValue(),
			first_name: this.$.firstName.getValue(),
			last_name: this.$.lastName.getValue()
		};
		this.doSubmit({data: data});
	},
	components: [
		{kind: "FormField", name: "firstName", placeholder: "Vorname", required: true, onchange: "checkFirstName", errorMessage: "Bitte gib deinen Namen ein!"},
		{kind: "FormField", name: "lastName", placeholder: "Nachname", required: true, onchange: "checkLastName", errorMessage: "Bitte gib deinen Namen ein!"},
		{kind: "FormField", name: "email", placeholder: "Email", required: true, onchange: "checkEmail"},
		{kind: "FormField", name: "username", placeholder: "Benutzername", required: true, onchange: "checkUsername"},
		{kind: "FormField", name: "password1", type: "password", placeholder: "Passwort", required: true, onchange: "checkPassword"},
		{kind: "FormField", name: "password2", type: "password", placeholder: "Passwort wiederholen", required: true, onchange: "checkPassword"},
		{kind: "onyx.Button", content: "Abschicken", ontap: "submit", classes: "onyx-affirmative", style: "width: 100%;"}
	]
});