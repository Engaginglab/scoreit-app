/**
	A popup with a spinner and text massage for indicating that the page is loading.
*/
enyo.kind({
	name: "LoadingPopup",
	kind: "onyx.Popup",
	centered: true,
	floating: true,
	autoDismiss: false,
	classes: "loadingpopup",
	published: {
		/**
			Loading message to be shown
		*/
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