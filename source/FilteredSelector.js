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
		selectedItem: null,
		placeholder: "Tap to select an item..."
	},
	handlers: {
		ontap: "openPopup"
	},
	create: function() {
		this.inherited(arguments);
		this.itemsChanged();
		this.selectedItemChanged();
		this.filterPropertiesChanged();
	},
	itemsChanged: function() {
		this.$.filteredList.setItems(this.items);
	},
	selectedItemChanged: function() {
		if (this.selectedItem) {
			this.$.label.setContent(this.selectedItem[this.displayProperty]);
		} else {
			this.$.label.setContent(this.placeholder);
		}
	},
	filterPropertiesChanged: function() {
		this.$.filteredList.setFilterProperties(this.filterProperties);
	},
	setupItem: function(sender, event) {
		var keyProp = this.uniqueProperty && event.item[this.uniqueProperty] !== undefined ? this.uniqueProperty : this.displayProperty;
		this.$.item.setContent(event.item[this.displayProperty]);
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
		// {classes: "label", components: [
		// 	{name: "caption", style: "float:left"},
		// 	{classes: "filteredselector-arrow"}
		// ]},
		{name: "label", classes: "filteredselector-value"},
		{kind: "onyx.Popup", classes: "onyx-menu onyx-picker filteredselector-popup", name: "selectPopup", components: [
			{kind: "FilteredList", onSetupItem: "setupItem", onItemSelected: "itemSelected", components: [
				{name: "item", ontap: "tapHandler", classes: "onyx-menu-item filteredselector-item ellipsis"}
			]}
		]}
	]
});