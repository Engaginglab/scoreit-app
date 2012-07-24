enyo.kind({
	name: "LoadingPopup",
	kind: "onyx.Popup",
	centered: true,
	floating: true,
	autoDismiss: false,
	classes: "loadingpopup",
	published: {
		text: "Loading..."
	},
	textChanged: function() {
		this.$.loadingText.setContent(this.text);
	},
	create: function() {
		this.inherited(arguments);
		this.textChanged();
	},
	components: [
        {kind: "onyx.Spinner", classes: "onyx-light loadingpopup-spinner", showing: true},
        {name: "loadingText", classes: "loadingpopup-text"}
	]
});