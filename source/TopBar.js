/**
	Header bar usually  shown at the top of the page. Contains score.it logo and signin/signout controls.
*/
enyo.kind({
	name: "TopBar",
	classes: "scoreit-topbar",
	published: {
		//* Currently signed in user
		user: null
	},
	events: {
		//* Fired when the user signs in
		onLogin: "",
		//* Fired when the user signs out
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
	goToIndex: function() {
		document.location = "index.html";
	},
	components: [
		{kind: "Image", src: "assets/images/scoreit_white_tiny.png", style: "height: 22px; margin: 3px 4px;", ontap: "goToIndex"},
		{name: "loginForm", style: "float: right;", components: [
			{kind: "onyx.InputDecorator", classes: "always-focused", components: [
				{kind: "onyx.Input", name: "username", placeholder: "Benutzername", onkeyup: "keyupHandler"}
			]},
			{kind: "onyx.InputDecorator", classes: "always-focused", components: [
				{kind: "onyx.Input", name: "password", type: "password", placeholder: "Passwort", onkeyup: "keyupHandler"}
			]},
			{kind: "onyx.Button", content: "Login", ontap: "login", style: "color: White;"}
		]},
		{name: "userMenu", style: "float: right;", showing: false, components: [
			{classes: "enyo-inline", content: "Hallo,", style: "padding-right: 5px;"},
			{classes: "enyo-inline", name: "fullName", style: "padding-right: 10px;"},
			{kind: "onyx.Button", content: "Logout", classes: "onyx-negative", ontap: "logout"}
		]}
	]
});