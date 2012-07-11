enyo.kind({
	name: "SignUpView",
	components: [
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.GroupboxHeader", content: "Allgemein"},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", name: "firstName"}, {classes: "label", content: "Vorname"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", name: "lastName"}, {classes: "label", content: "Nachname"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", name: "email"}, {classes: "label", content: "Email"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", name: "username"}, {classes: "label", content: "Benutzername"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", type: "password", name: "password1"}, {classes: "label", content: "Passwort"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", type: "password", name: "password2"}, {classes: "label", content: "Passwort Wiederholen"}
			]}
		]},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.GroupboxHeader", content: "Spielerprofil"},
			{kind: "onyx.custom.SelectDecorator", components: [
				{kind: "Select", name: "gender", components: [
					{content: "Männlich", value: "male"},
					{content: "Weiblich", value: "female"}
				]}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", name: "passNumber"}, {classes: "label", content: "Passnummer"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", name: "birthday"}, {classes: "label", content: "Geburtstag"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill", components: [
				{kind: "onyx.Input", name: "address"}, {classes: "label", content: "Adresse"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill", components: [
				{kind: "onyx.Input", name: "city"}, {classes: "label", content: "Stadt"}
			]},
			{kind: "onyx.InputDecorator", classes: "input-fill input-mandatory", components: [
				{kind: "onyx.Input", name: "zipCode"}, {classes: "label", content: "Postleitzahl"}
			]}
		]}
	]
});