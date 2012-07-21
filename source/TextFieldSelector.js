enyo.kind({
	name: "TextFieldSelector",
	kind: "onyx.InputDecorator",
	classes: "textfieldselector",
	selectedItems: {},
	selectedItemsArray: [],
	published: {
		items: [],
		uniqueProperty: "",
		displayProperty: "",
		filterProperties: [],
		hint: "Type to select an item!"
	},
	create: function() {
		this.inherited(arguments);
		this.hintChanged();
	},
	hintChanged: function() {
		this.$.searchInput.setPlaceholder(this.hint);
	},
	setSelectedItems: function(items) {
		var keyProp = this.uniqueProperty || this.displayProperty;
		for (var i=0; i<items.length; i++) {
			this.selectedItems[items[i][keyProp]] = items[i];
		}
		this.refreshItems();
	},
	getSelectedItems: function() {
		var items = [];
		for (var x in this.selectedItems) {
			items.push(this.selectedItems[x]);
		}
		return items;
	},
	isSelected: function(item) {
		var keyProp = this.uniqueProperty || this.displayProperty;
		var found = this.selectedItems[item[keyProp]];
		return found !== undefined && found !== null;
	},
	setupItem: function(sender, event) {
		var item = this.selectedItemsArray[event.index];
		event.item.$.label.setContent(item[this.displayProperty]);
		return true;
	},
	listSetupItem: function(sender, event) {
		var item = this.filteredItems[event.index];
		this.$.listItem.addRemoveClass("selected", event.index == this.selected);
		this.$.listItem.setContent(item[this.displayProperty]);
	},
	keyupHandler: function(sender, event) {
		if (event.keyCode == 40) {
			this.selected = this.selected < this.filteredItems.length-1 ? this.selected+1 : this.filteredItems.length-1;
			event.preventDefault();
            this.refreshList();
		} else if (event.keyCode == 38) {
			this.selected = this.selected ? this.selected-1 : 0;
			event.preventDefault();
            this.refreshList();
		} else if (event.keyCode == 13) {
			var item = this.filteredItems[this.selected];
			if (item) {
				this.selectItem(item);
			}
		} else if (event.keyCode == 8 && !this.$.searchInput.getValue()) {
			this.popItem();
		} else {
			var searchString = this.$.searchInput.getValue();
			this.filteredItems = this.items.filter(enyo.bind(this, function(item) {
				return !this.isSelected(item) && this.filterByProps(item, searchString, this.filterProperties);
			}));
			this.$.list.setCount(this.filteredItems.length);
			this.selected = 0;
			
			if (this.filteredItems.length) {
				this.showPopup();
			} else {
				this.$.popup.hide();
			}
		}
	},
	showPopup: function() {
		this.$.popup.show();
		// this.$.popup.applyStyle("height", this.$.list.getBounds().height + "px");
		var inputBounds = this.$.searchInput.getBounds();
		this.$.popup.applyStyle("top", inputBounds.top + 20 + "px");
		this.$.popup.applyStyle("left", inputBounds.left + "px");
        this.refreshList();
	},
	filterByProps: function(item, searchString, props) {
		var pattern = new RegExp(searchString, "i");
		for (var i=0; i<props.length; i++) {
			var value = item[props[i]];
			if (value === undefined || value === null) {
				continue;
			}
			if (typeof(value) != "string") {
				value = value.toString();
			}
			if (value.match(pattern)) {
				return true;
			}
		}
		return false;
	},
	itemClick: function(sender, event) {
		this.selectItem(this.filteredItems[event.index]);
		this.$.searchInput.focus();
	},
	selectItem: function(item) {
		var keyProp = this.uniqueProperty || this.displayProperty;
		this.selectedItems[item[keyProp]] = item;
		this.refreshItems();
		this.$.popup.hide();
		this.$.searchInput.setValue("");
	},
	deselectItem: function(item) {
		var keyProp = this.uniqueProperty || this.displayProperty;
		delete this.selectedItems[item[keyProp]];
		this.refreshItems();
	},
	popItem: function() {
		var selectedItems = this.getSelectedItems();
		var item = selectedItems[selectedItems.length-1];
		if (item) {
			this.deselectItem(item);
		}
	},
    refreshList: function() {
        this.$.list.render();
        this.$.list.performOnRow(this.selected, function() {
            this.$.scroller.scrollIntoView(this.$.listItem);
        }, this);
    },
	refreshItems: function() {
		this.selectedItemsArray = this.getSelectedItems();
		this.$.itemRepeater.setCount(this.selectedItemsArray.length);
		this.$.itemRepeater.render();
	},
	removeItemTapped: function(sender, event) {
		var item = this.getSelectedItems()[event.index];
		this.deselectItem(item);
	},
	components: [
		{kind: "Repeater", name: "itemRepeater", classes: "textfieldselector-repeater", onSetupItem: "setupItem", components: [
			{classes: "textfieldselector-item", components: [
				{classes: "textfieldselector-item-label", name: "label"},
				{classes: "textfieldselector-removebutton", content: "x", ontap: "removeItemTapped"}
			]}
		]},
		{kind: "onyx.Input", name: "searchInput", onkeyup: "keyupHandler"},
        {kind: "enyo.Popup", style: "width: 200px; max-height: 200px;", classes: "textfieldselector-popup", components: [
            {kind: "Scroller", style: "max-height: inherit;", components: [
                {kind: "FlyweightRepeater", name: "list", onSetupItem: "listSetupItem", components: [
                    {kind: "onyx.Item", tapHighlight: true, ontap: "itemClick", name: "listItem", classes: "textfieldselector-listitem"}
                ]}
            ]}
        ]}
	]
});