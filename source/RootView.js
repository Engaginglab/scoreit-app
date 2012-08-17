enyo.kind({
	name: "RootView",
	events: {
		onShowUnion: ""
	},
	create: function() {
		this.inherited(arguments);
		this.loadUnions();
	},
	loadUnions: function() {
		scoreit.handball.union.list([], enyo.bind(this, function(sender, response) {
			this.unions = response.objects;
			this.refreshUnionList();
		}));
	},
	refreshUnionList: function() {
		this.$.unionList.setCount(this.unions.length);
		this.$.unionList.render();
	},
	setupUnionItem: function(sender, event) {
		var union = this.unions[event.index];
		this.$.unionItem.setContent(union.name);
	},
	unionTapped: function(sender, event) {
		this.doShowUnion({union: this.unions[event.index]});
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", content: "Gesamtübersicht"},
				{kind: "CollapsibleGroupbox", caption: "Verbände", components: [
					{kind: "FlyweightRepeater", name: "unionList", onSetupItem: "setupUnionItem", components: [
						{kind: "onyx.Item", name: "unionItem", ontap: "unionTapped"}
					]}
				]}
			]}
		]}
	]
});