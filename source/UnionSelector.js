enyo.kind({
	name: "UnionSelector",
	kind: "FilteredSelector",
	filterProperties: ["name"],
	valueProperty: "name",
	caption: "Verband",
	create: function() {
		this.inherited(arguments);
		this.loadItems();
	},
	loadItems: function() {
		scoreit.union.list([], enyo.bind(this, function(sender, response) {
			this.$.filteredList.setItems(response.objects);
		}));
	}
});