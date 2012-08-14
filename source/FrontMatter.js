enyo.kind({
	name: "FrontMatter",
	classes: "frontmatter",
	events: {
		onSignUp: ""
	},
	signUpHandler: function(sender, event) {
		this.doSignUp(event);
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "frontmatter-content", components: [
				{allowHtml: true, content: "There is a story <br> behind your numbers.",
					style: "position: absolute; text-align: center; top: 40px; left: 10px; font-size: 15pt;"},
				{content: "Discover it.", style: "position: absolute; text-align: center; top: 220px; left: 0px; font-size: 18pt;"},
				{content: "And benefit!", style: "position: absolute; text-align: center; top: 250px; left: 320px; font-size: 20pt;"},
				{style: "width: 300px; float: right; text-align: center;", components: [
					{style: "font-size: 15pt; color: #BDE515;", content: "Noch nicht dabei?"},
					{style: "font-size: 24pt; color: #C51616;", content: "Jetzt registrieren!"},
					{kind: "SignUpForm", style: "width: 100%;", onSubmit: "signUpHandler"}
				]}
			]}
		]}
	]
});