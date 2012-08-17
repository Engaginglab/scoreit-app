enyo.kind({
	name: "CollapsibleGroupbox",
	kind: "onyx.Groupbox",
	classes: "collapsible-groupbox",
	published: {
		caption: "",
		open: true
	},
	create: function() {
		this.inherited(arguments);
		this.captionChanged();
		this.openChanged();
	},
	openChanged: function() {
		this.$.client.setOpen(this.open);
		this.$.headerButton.addRemoveClass("active", this.open);
		this.addRemoveClass("closed", !this.open);
	},
	captionChanged: function() {
		this.$.headerButton.setContent(this.caption);
	},
	toggleOpen: function() {
		this.setOpen(!this.open);
	},
	components: [
		{kind: "onyx.Button", classes: "onyx-groupbox-header", name: "headerButton", ontap: "toggleOpen"},
		{kind: "onyx.Drawer", name: "client"}
	]
});

enyo.kind({
	name: "CollapsibleGroupboxTest",
	style: "padding: 50px;",
	components: [
		{kind: "CollapsibleGroupbox", caption: "Bezirke", components: [
			{kind: "onyx.Item", content: "test"},
			{kind: "onyx.Item", content: "test"}
		]}
	]
});