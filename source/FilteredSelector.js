enyo.kind({
	name: "FilteredSelector",
	kind: "onyx.Button",
	classes: "filteredselector",
	events: {
		onItemSelected: ""
	},
	published: {
		items: [],
		filterProperties: [],
		caption: "",
		displayProperty: "",
		uniqueProperty: "",
		selectedItem: null
	},
	handlers: {
		ontap: "openPopup"
	},
	create: function() {
		this.inherited(arguments);
		this.itemsChanged();
		this.selectedItemChanged();
		this.filterPropertiesChanged();
		this.captionChanged();
	},
	itemsChanged: function() {
		this.$.filteredList.setItems(this.items);
	},
	selectedItemChanged: function() {
		if (this.selectedItem) {
			this.$.label.setContent(this.selectedItem[this.displayProperty]);
		}
	},
	filterPropertiesChanged: function() {
		this.$.filteredList.setFilterProperties(this.filterProperties);
	},
	captionChanged: function() {
		this.$.caption.setContent(this.caption);
	},
	setupItem: function(sender, event) {
		var keyProp = this.uniqueProperty || this.displayProperty;
		this.$.item.setContent(event.item.name);
		this.$.item.addRemoveClass("selected", this.selectedItem && event.item[keyProp] == this.selectedItem[keyProp]);
	},
	tapHandler: function(sender, event) {
		this.setSelectedItem(this.$.filteredList.getFilteredItems()[event.index]);
		event.item = this.selectedItem;
		this.$.selectPopup.hide();
		this.doItemSelected(event);
		return true;
	},
	openPopup: function() {
		this.$.selectPopup.show();
		this.$.filteredList.render();
	},
	components: [
		{classes: "label", content: "test", components: [
			{name: "caption", style: "float:left"},
			{classes: "filteredselector-arrow"}
		]},
		{name: "label", classes: "filteredselector-value"},
		{kind: "onyx.Popup", style: "width: 300px;", name: "selectPopup", components: [
			{kind: "FilteredList", onSetupItem: "setupItem", onItemSelected: "itemSelected", components: [
				{kind: "onyx.Item", name: "item", ontap: "tapHandler", classes: "filteredselector-item"}
			]}
		]}
	]
});