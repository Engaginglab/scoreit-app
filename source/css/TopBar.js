enyo.kind({
	name: "TopBar",
	classes: "scoreit-topbar",
	components: [
		{kind: "Image", src: "assets/images/scoreit_white_nobounce_tiny.png", style: "height: 22px; margin: 3px 4px;"},
		{style: "float: right;", components: [
			{kind: "onyx.InputDecorator", classes: "always-focused", components: [
				{kind: "onyx.Input", placeholder: "Benutzername"}
			]},
			{kind: "onyx.InputDecorator", classes: "always-focused", components: [
				{kind: "onyx.Input", type: "password", placeholder: "Passwort"}
			]},
			{kind: "onyx.Button", content: "Login", classes: "onyx-negative"}
		]}
	]
});