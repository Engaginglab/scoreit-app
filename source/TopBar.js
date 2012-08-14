enyo.kind({
	name: "TopBar",
	classes: "scoreit-topbar",
	published: {
		user: null
	},
	events: {
		onLogin: "",
		onLogout: ""
	},
	userChanged: function() {
		if (this.user) {
			this.$.fullName.setContent(this.user.first_name + " " + this.user.last_name + "!");
			this.$.userMenu.show();
			this.$.loginForm.hide();
		} else {
			this.$.userMenu.hide();
			this.$.loginForm.show();
		}
	},
	login: function() {
		this.doLogin({username: this.$.username.getValue(), password: this.$.password.getValue()});
		this.$.username.setValue("");
		this.$.password.setValue("");
	},
	logout: function() {
		this.doLogout();
	},
	keyupHandler: function(sender, event) {
		if (event.keyCode == 13) {
			this.login();
		}
	},
	components: [
		{kind: "Image", src: "assets/images/scoreit_white_tiny.png", style: "height: 22px; margin: 3px 4px;"},
		{name: "loginForm", style: "float: right;", components: [
			{kind: "onyx.InputDecorator", classes: "always-focused", components: [
				{kind: "onyx.Input", name: "username", placeholder: "Benutzername", onkeyup: "keyupHandler"}
			]},
			{kind: "onyx.InputDecorator", classes: "always-focused", components: [
				{kind: "onyx.Input", name: "password", type: "password", placeholder: "Passwort", onkeyup: "keyupHandler"}
			]},
			{kind: "onyx.Button", content: "Login", classes: "onyx-negative", ontap: "login"}
		]},
		{name: "userMenu", style: "float: right;", showing: false, components: [
			{classes: "enyo-inline", content: "Hallo,", style: "padding-right: 5px;"},
			{classes: "enyo-inline", name: "fullName", style: "padding-right: 10px;"},
			{kind: "onyx.Button", content: "Logout", classes: "onyx-negative", ontap: "logout"}
		]}
	]
});