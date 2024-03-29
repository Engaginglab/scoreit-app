/**
	Form for signup info
*/
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
	/**
		Clear form
	*/
	clear: function() {
		this.$.username.setValue("");
		this.$.username.setValid(null);
		this.$.firstName.setValue("");
		this.$.firstName.setValid(null);
		this.$.lastName.setValue("");
		this.$.lastName.setValid(null);
		this.$.email.setValue("");
		this.$.email.setValid(null);
		this.$.password1.setValue("");
		this.$.password1.setValid(null);
		this.$.password2.setValue("");
		this.$.password2.setValid(null);
	},
	/**
		Check if first name is valid
	*/
	checkFirstName: function() {
		this.$.firstName.setValid(this.$.firstName.getValue() !== "");
	},
	/**
		Check if last name is valid
	*/
	checkLastName: function() {
		this.$.lastName.setValid(this.$.lastName.getValue() !== "");
	},
	/**
		Check if username is valid
	*/
	checkUsername: function() {
		if (!this.$.username.getValue()) {
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
	/**
		Check if email is valid
	*/
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
			scoreit.auth.user.isUnique({email: this.$.email.getValue()}, enyo.bind(this, function(sender, response) {
				if (response.email) {
					this.$.email.setValid(true);
				} else {
					this.$.email.setValid(false);
					this.$.email.setErrorMessage("Es exisistiert bereits ein Account mit dieser Emailadresse.");
				}
			}));
		}
	},
	/**
		Check if password is valid
	*/
	checkPassword: function() {
		if (!this.$.password.getValue()) {
			this.$.password.setValid(false);
			this.$.password.setErrorMessage("Bitte gib ein Passwort ein!");
		} else if (this.$.password.getValue().length < 6) {
			this.$.password.setValid(false);
			this.$.password.setErrorMessage("Das Passwort muss mindestens 6 Zeichen lang sein!");
		} else {
			this.$.password.setValid(true);
		}
		// var same = this.$.password1.getValue() == this.$.password2.getValue();

		// if (!this.$.password1.getValue()) {
		// 	this.$.password1.setValid(false);
		// 	this.$.password2.setValid(false);
		// 	this.$.password1.setErrorMessage("Bitte ein Passwort eingeben!");
		// } else if (this.$.password1.getValue() && this.$.password2.getValue() && !same) {
		// 	this.$.password1.setValid(false);
		// 	this.$.password2.setValid(false);
		// 	this.$.password1.setErrorMessage("Passwörter stimmen nicht überein!");
		// } else {
		// 	this.$.password1.setValid(true);
		// 	this.$.password2.setValid(true);
		// }
	},
	/**
		Perfom validation on all fields return true if all fields are valid, false otherwise.
	*/
	allValid: function() {
		this.checkFirstName();
		this.checkLastName();
		this.checkUsername();
		this.checkEmail();
		this.checkPassword();
		return this.$.firstName.getValid() && this.$.lastName.getValid() && this.$.email.getValid() && this.$.username.getValid() && this.$.password1.getValid();
	},
	/**
		Check if all fields are valid. If so, fire submit event with form data and clear form
	*/
	submit: function() {
		if (this.allValid()) {
			var data = {
				username: this.$.username.getValue(),
				password: this.$.password1.getValue(),
				email: this.$.email.getValue(),
				first_name: this.$.firstName.getValue(),
				last_name: this.$.lastName.getValue()
			};
			this.doSubmit({data: data});
			this.clear();
		}
	},
	components: [
		{kind: "FormField", name: "firstName", placeholder: "Vorname", required: true, onchange: "checkFirstName", errorMessage: "Bitte gib deinen Namen ein!"},
		{kind: "FormField", name: "lastName", placeholder: "Nachname", required: true, onchange: "checkLastName", errorMessage: "Bitte gib deinen Namen ein!"},
		{kind: "FormField", name: "email", placeholder: "Email", required: true, onchange: "checkEmail"},
		{kind: "FormField", name: "username", placeholder: "Benutzername", required: true, onchange: "checkUsername"},
		{kind: "FormField", name: "password", type: "password", placeholder: "Passwort", required: true, onchange: "checkPassword"},
		// {kind: "FormField", name: "password2", type: "password", placeholder: "Passwort wiederholen", required: true, onchange: "checkPassword"},
		{kind: "onyx.Button", content: "Abschicken", ontap: "submit", classes: "onyx-affirmative", style: "width: 100%;"}
	]
});