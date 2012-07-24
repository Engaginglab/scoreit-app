enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	classes: "scoreit-app",
	create: function() {
		this.inherited(arguments);
		var user = null;
		try {
			user = JSON.parse(localStorage.getItem("user"));
		} catch(e) {
		}

		if (user) {
			scoreit.user = user;
			this.$.topBar.setUser(user);
		}
		//this.reportDone(this,{"nummer":"123456","heim":"2","gast":"3","tore_heim":9,"tore_gast":12,"sieger":"3","verband":"1","klasse":"1","spieler_heim":"[\"52\",\"53\",\"54\",\"55\",\"56\",\"57\",\"58\",\"59\",\"60\",\"61\",\"62\",\"63\"]","spieler_gast":"[\"64\",\"65\",\"66\",\"67\",\"68\",\"69\",\"70\",\"71\",\"72\",\"73\",\"74\"]","ereignisse":"[{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"56\",\"vorname\":\"Michael\",\"nachname\":null,\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":198000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"67\",\"vorname\":\"Thomas\",\"nachname\":\"Kratzer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":372000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"71\",\"vorname\":\"Christoph\",\"nachname\":\"Briemeyer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":570000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"71\",\"vorname\":\"Christoph\",\"nachname\":\"Briemeyer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":660000},{\"typ\":3,\"mannschaft\":\"2\",\"person\":{\"ID\":\"58\",\"vorname\":\"Tobias\",\"nachname\":\"Burckhardt\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":822000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"66\",\"vorname\":\"Tobias\",\"nachname\":\"Kaiser\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":990000},{\"typ\":4,\"mannschaft\":\"2\",\"person\":{\"ID\":\"53\",\"vorname\":\"Sven\",\"nachname\":\"Herweh\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1098000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"52\",\"vorname\":\"Fabian\",\"nachname\":\"Schoenert\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1194000},{\"typ\":2,\"mannschaft\":\"2\",\"person\":{\"ID\":\"60\",\"vorname\":\"Manuel\",\"nachname\":null,\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1272000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"62\",\"vorname\":\"Benedikt\",\"nachname\":\"Wittl\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1374000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"70\",\"vorname\":\"Dennis\",\"nachname\":\"Odoi\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1452000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"69\",\"vorname\":\"Patrick\",\"nachname\":\"Wilhelm\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1566000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"65\",\"vorname\":\"Michael\",\"nachname\":\"Millmann\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1638000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"71\",\"vorname\":\"Christoph\",\"nachname\":\"Briemeyer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1734000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"56\",\"vorname\":\"Michael\",\"nachname\":null,\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1800000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"61\",\"vorname\":\"Florian\",\"nachname\":\"Beyer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1908000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"61\",\"vorname\":\"Florian\",\"nachname\":\"Beyer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":1986000},{\"typ\":2,\"mannschaft\":\"2\",\"person\":{\"ID\":\"60\",\"vorname\":\"Manuel\",\"nachname\":null,\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2070000},{\"typ\":3,\"mannschaft\":\"2\",\"person\":{\"ID\":\"58\",\"vorname\":\"Tobias\",\"nachname\":\"Burckhardt\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2184000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"59\",\"vorname\":\"Daniel\",\"nachname\":\"Gattung\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2256000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"61\",\"vorname\":\"Florian\",\"nachname\":\"Beyer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2328000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"71\",\"vorname\":\"Christoph\",\"nachname\":\"Briemeyer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2400000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"64\",\"vorname\":\"Patrick\",\"nachname\":\"Grossl\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2484000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"73\",\"vorname\":\"Philip\",\"nachname\":\"Hermes\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2556000},{\"typ\":3,\"mannschaft\":\"3\",\"person\":{\"ID\":\"73\",\"vorname\":\"Philip\",\"nachname\":\"Hermes\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2676000},{\"typ\":1,\"mannschaft\":\"2\",\"person\":{\"ID\":\"55\",\"vorname\":\"Sebastian\",\"nachname\":null,\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2760000},{\"typ\":2,\"mannschaft\":\"3\",\"person\":{\"ID\":\"64\",\"vorname\":\"Patrick\",\"nachname\":\"Grossl\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":2868000},{\"typ\":3,\"mannschaft\":\"3\",\"person\":{\"ID\":\"67\",\"vorname\":\"Thomas\",\"nachname\":\"Kratzer\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":3000000},{\"typ\":1,\"mannschaft\":\"3\",\"person\":{\"ID\":\"70\",\"vorname\":\"Dennis\",\"nachname\":\"Odoi\",\"passnummer\":\"0\",\"geburtstag\":null,\"adresse\":null,\"plz\":null},\"zeit\":3078000}]"});
	},
	signUpHandler: function(sender, event) {
		this.$.loadingPopup.setText("Erstelle Account...");
		this.$.loadingPopup.show();
		scoreit.signUp(event.data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
		}));
	},
	loginHandler: function(sender, event) {
		scoreit.login(event.username, event.password, enyo.bind(this, function(success) {
			localStorage.setItem("user", JSON.stringify(scoreit.user));
			this.$.topBar.setUser(scoreit.user);
		}));
	},
	logoutHandler: function() {
		scoreit.user = null;
		localStorage.removeItem("user");
		this.$.topBar.setUser(null);
	},
	components: [
		{kind: "TopBar", onLogin: "loginHandler", onLogout: "logoutHandler"},
		{kind: "Panels", fit: true, style: "width: 850px; margin: 0 auto;", components: [
			{kind: "FrontMatter", onSignUp: "signUpHandler"}
		]},
		{kind: "LoadingPopup"}
	]
});