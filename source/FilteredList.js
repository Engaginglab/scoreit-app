/**
	A list with an input field that allows filtering items based on certain properties
*/
enyo.kind({
	name: "FilteredList",
	kind: "FittableRows",
	filteredItems: [],
	events: {
		//* Specify for a custom filter function
		onFilter: "",
		//* Specify for customizing the item appearance
		onSetupItem: ""
	},
	published: {
		//* Items in this list
		items: [],
		//* Properties that are searched for the filter string
		filterProperties: []
	},
	itemsChanged: function() {
		this.filteredItems = this.items;
		this.refreshList();
	},
	refreshList: function() {
		this.filteredItems = this.filteredItems || [];
		this.$.client.setCount(this.filteredItems.length);
		this.$.client.render();
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
			if (item[props[i]] && item[props[i]].match(pattern)) {
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
		{kind: "onyx.InputDecorator", style: "width: 100%", name: "searchInputDecorator", classes: "input-fill", components: [
			{kind: "onyx.Input", name: "searchInput", onkeyup: "filter", defaultFocus: true},
			{kind: "Image", src: "assets/images/search-input-search.png", classes: "label"}
		]},
		{kind: "Scroller", components: [
			{kind: "FlyweightRepeater", onSetupItem: "setupItem", name: "client"}
		]}
	]
});