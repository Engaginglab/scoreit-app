enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	classes: "scoreit-app",
	views: {
		"frontMatter": 0,
		"getStartedView": 1
	},
	create: function() {
		this.inherited(arguments);
		var user = null;
		try {
			user = JSON.parse(localStorage.getItem("user"));
		} catch(e) {
		}
		scoreit.user = user;
		this.updateUser();
	},
	showView: function(view) {
		this.$.panels.setIndex(this.views[view]);
	},
	updateUser: function() {
		this.$.topBar.setUser(scoreit.user);

		if (scoreit.user) {
			this.$.getStartedView.setUser(scoreit.user);
			this.showView("getStartedView");
		} else {
			this.showView("frontMatter");
		}
	},
	signUpHandler: function(sender, event) {
		this.$.loadingPopup.setText("Erstelle Account...");
		this.$.loadingPopup.show();
		scoreit.signUp(event.data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.$.signedUpPopup.show();
		}));
	},
	hideSignedUpPopup: function() {
		this.$.signedUpPopup.hide();
	},
	loginHandler: function(sender, event) {
		scoreit.login(event.username, event.password, enyo.bind(this, function(success) {
			localStorage.setItem("user", JSON.stringify(scoreit.user));
			this.updateUser();
		}));
	},
	logoutHandler: function() {
		scoreit.user = null;
		localStorage.removeItem("user");
		this.updateUser();
	},
	components: [
		{kind: "TopBar", onLogin: "loginHandler", onLogout: "logoutHandler"},
		{kind: "Panels", name: "panels", fit: true, style: "width: 850px; margin: 0 auto;", components: [
			{kind: "FrontMatter", onSignUp: "signUpHandler"},
			{kind: "GetStartedView"}
		]},
		{kind: "LoadingPopup"},
		{kind: "onyx.Popup", name: "signedUpPopup", floating: true, centered: true, style: "right: auto;", components: [
			{content: "Dir wurde soeben eine Email geschickt. Klicke auf den Link in der Email, um deinen Account zu aktiveren!"},
			{kind: "onyx.Button", content: "OK", onclick: "hideSignedUpPopup"}
		]}
	]
});