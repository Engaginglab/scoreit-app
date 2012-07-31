enyo.kind({
	name: "MultiSelector",
	events: {
		onNewItem: ""
	},
	published: {
		items: [],
		uniqueProperty: "",
		displayProperty: "",
		filterProperties: [],
		hint: "Type to select an item!",
		allowNewItem: false
	},
	create: function() {
		this.inherited(arguments);
		this.hintChanged();
		this.selectedItems = {};
		this.selectedItemsArray= [];
	},
	hintChanged: function() {
		this.$.searchInput.setPlaceholder(this.hint);
	},
	getKeyProp: function(item) {
		return (this.uniqueProperty && item[this.uniqueProperty]) ? this.uniqueProperty : this.displayProperty;
	},
	setSelectedItems: function(items) {
		this.selectedItems = {};
		for (var i=0; i<items.length; i++) {
			var keyProp = this.getKeyProp(items[i]);
			this.selectedItems[items[i][keyProp]] = items[i];
		}
		this.refreshSelectedItems();
	},
	getSelectedItems: function() {
		var items = [];
		for (var x in this.selectedItems) {
			items.push(this.selectedItems[x]);
		}
		return items;
	},
	isSelected: function(item) {
		var keyProp = this.getKeyProp(item);
		var found = this.selectedItems[item[keyProp]];
		return found !== undefined && found !== null;
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
			} else if (this.allowNewItem) {
				this.newItem();
			}
		}  else {
			var searchString = this.$.searchInput.getValue();
			this.filteredItems = this.items.filter(enyo.bind(this, function(item) {
				return searchString && !this.isSelected(item) && this.filterByProps(item, searchString, this.filterProperties);
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
	keydownHandler: function(sender, event) {
		if (event.keyCode == 8 && !this.$.searchInput.getValue()) {
			this.popItem();
		}
	},
	newItem: function() {
		var item = {};
		item[this.displayProperty] = this.$.searchInput.getValue();
		// this.items.push(item);
		this.selectItem(item);
		this.doNewItem({item: item});
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
		var keyProp = this.getKeyProp(item);
		this.selectedItems[item[keyProp]] = item;
		this.refreshSelectedItems();
		this.$.popup.hide();
		this.$.searchInput.setValue("");
	},
	deselectItem: function(item) {
		var keyProp = this.getKeyProp(item);
		delete this.selectedItems[item[keyProp]];
		this.refreshSelectedItems();
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
	refreshSelectedItems: function() {
		this.selectedItemsArray = this.getSelectedItems();
		this.$.selectedRepeater.setCount(this.selectedItemsArray.length);
		this.$.selectedRepeater.render();
	},
	removeItemTapped: function(sender, event) {
		var item = this.getSelectedItems()[event.index];
		this.deselectItem(item);
	}
});