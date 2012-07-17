enyo.kind({
	name: "FilteredSelector",
	classes: "onyx-button filtered-selector",
	events: {
		onChange: ""
	},
	published: {
		items: [],
		filterProperties: [],
		caption: "",
		valueProperty: ""
	},
	handlers: {
		ontap: "openPopup"
	},
	create: function() {
		this.inherited(arguments);
		this.itemsChanged();
		this.filterPropertiesChanged();
		this.captionChanged();
	},
	itemsChanged: function() {
		this.$.filteredList.setItems(this.items);
	},
	filterPropertiesChanged: function() {
		this.$.filteredList.setFilterProperties(this.filterProperties);
	},
	captionChanged: function() {
		this.$.caption.setContent(this.caption);
	},
	setupItem: function(sender, event) {
		this.$.item.setContent(event.item.name);
	},
	tapHandler: function(sender, event) {
		event.item = this.$.filteredList.getFilteredItems()[event.index];
		this.$.value.setContent(event.item[this.valueProperty]);
		this.$.selectPopup.hide();
		this.doChange(event);
		return true;
	},
	openPopup: function() {
		this.$.selectPopup.show();
	},
	components: [
		{classes: "label", content: "test", components: [
			{name: "caption", style: "float:left"},
			{classes: "filtered-selector-arrow"}
		]},
		{name: "value", classes: "filtered-selector-value"},
		{kind: "onyx.Popup", style: "width: 300px; height: 300px", name: "selectPopup", components: [
			{kind: "FilteredList", classes: "enyo-fill", onSetupItem: "setupItem", onItemSelected: "itemSelected", components: [
				{kind: "onyx.Item", name: "item", ontap: "tapHandler"}
			]}
		]}
	]
});