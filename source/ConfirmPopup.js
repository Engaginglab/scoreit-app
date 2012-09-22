/**
	A popup used to prompt a user to confirm or decline an action
*/
enyo.kind({
	name: "ConfirmPopup",
	kind: "onyx.Popup",
	classes: "confirmpopup",
	centered: true,
	floating: true,
	published: {
		//* Title on top of the popup
		title: "",
		//* Message inside the popup
		message: "",
		//* Caption of the accept button
		acceptButtonCaption: "OK",
		//* Caption of the cancel/decline button
		cancelButtonCaption: "Abbrechen",
		//* Function that gets called after the user has made a decision. The single argument is true if the user accepts, false if he declines
		callback: null,
		//* Action type the user is asked to accept. Available types are 'default' and 'destructive'
		action: "default"
	},
	events: {
		//* Gets fired when the user clicks the accept button
		onAccept: "",
		//* Gets fired when the user clicks the cancel button
		onCancel: ""
	},
	components: [
		{name: "title", classes: "confirmpopup-title"},
		{components: [
			{name: "message", classes: "confirmpopup-text"},
			{components: [
				{name: "cancelButton", kind: "onyx.Button", ontap: "cancelClick", style: "width: 46%; margin: 2%;"},
				{name: "acceptButton", kind: "onyx.Button", classes: "onyx-affirmative", ontap: "acceptClick", style: "width: 46%; margin: 2%;"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
		this.messageChanged();
		this.acceptButtonCaptionChanged();
		this.cancelButtonCaptionChanged();
		this.actionChanged();
	},
	titleChanged: function() {
		this.$.title.setContent(this.title);
		this.$.title.setShowing(this.title);
	},
	messageChanged: function() {
		this.$.message.setContent(this.message);
	},
	acceptButtonCaptionChanged: function() {
		this.$.acceptButton.setContent(this.acceptButtonCaption);
	},
	cancelButtonCaptionChanged: function() {
		this.$.cancelButton.setContent(this.cancelButtonCaption);
		this.$.cancelButton.setShowing(this.cancelButtonCaption);
	},
	actionChanged: function() {
		this.$.acceptButton.removeClass("onyx-affirmative");
		this.$.acceptButton.removeClass("onyx-negative");
		switch (this.action) {
			case "destructive":
				this.$.acceptButton.addClass("onyx-negative");
				break;
			default:
				this.$.acceptButton.addClass("onyx-affirmative");
		}
	},
	acceptClick: function() {
		if (this.callback) {
			this.callback(true);
		}
		this.doAccept();
		this.hide();
	},
	cancelClick: function() {
		if (this.callback) {
			this.callback(false);
		}
		this.doCancel();
		this.hide();
	}
});