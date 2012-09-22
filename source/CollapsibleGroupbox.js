/**
	A groupbox with a drawer that can be opened or closed by tapping on the group header
*/
enyo.kind({
	name: "CollapsibleGroupbox",
	kind: "onyx.Groupbox",
	classes: "collapsible-groupbox",
	published: {
		//* Text inside the group header
		caption: "",
		//* Open state of the group
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