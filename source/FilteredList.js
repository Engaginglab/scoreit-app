enyo.kind({
	name: "FilteredList",
	kind: "FittableRows",
	filteredItems: [],
	events: {
		onFilter: "",
		onSetupItem: ""
	},
	published: {
		items: [],
		multiSelect: false,
		filterProperties: []
	},
	itemsChanged: function() {
		this.filteredItems = this.items;
		this.refreshList();
	},
	refreshList: function() {
		this.$.client.setCount(this.filteredItems.length);
		this.$.client.reset();
	},
	filter: function() {
		var searchString = this.$.searchInput.getValue();
		this.filteredItems = this.items.filter(enyo.bind(this, function(item) {
			if (this.onFilter) {
				return this.doFilter({item: item, searchString: this.$.searchInput.getValue()});
			}
			return this.filterByProps(item, searchString, this.filterProperties);
		}));
		this.$.client.getSelection().clear();
		this.refreshList();
	},
	filterByProps: function(item, searchString, props) {
		var pattern = new RegExp(searchString, "i");
		for (var i=0; i<props.length; i++) {
			if (item[props[i]].match(pattern)) {
				return true;
			}
		}
		return false;
	},
	setupItem: function(sender, event) {
		event.item = this.filteredItems[event.index];
		this.doSetupItem(event);
	},
	getFilteredItems: function() {
		return this.filteredItems;
	},
	getSelected: function() {
		var selected = [];
		for (var i=0; i<this.filteredItems.length; i++) {
			if (this.$.client.isSelected(i)) {
				this.selected.push(this.filteredItems[i]);
			}
		}
		return selected;
	},
	components: [
		{kind: "onyx.InputDecorator", components: [
			{kind: "onyx.Input", name: "searchInput", onkeyup: "filter"}
		]},
		{kind: "List", fit: true, onSetupItem: "setupItem", name: "client"}
	]
});