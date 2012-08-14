enyo.kind({
	name: "UnionView",
	published: {
		union: null
	},
	events: {
		onShowDistrict: ""
	},
	unionChanged: function() {
		if (this.union) {
			this.$.unionName.setContent(this.union.name);
			this.loadDistricts();
		}
	},
	loadDistricts: function() {
		scoreit.handball.district.list([["union", this.union.id]], enyo.bind(this, function(sender, response) {
			this.districts = response.objects;
			this.refreshDistrictList();
		}));
	},
	refreshDistrictList: function() {
		this.$.districtList.setCount(this.districts.length);
		this.$.districtList.render();
	},
	setupDistrictItem: function(sender, event) {
		var district = this.districts[event.index];
		this.$.districtItem.setContent(district.name);
	},
	districtTapped: function(sender, event) {
		this.doShowDistrict({district: this.districts[event.index]});
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "unionName"},
				{kind: "FlyweightRepeater", name: "districtList", onSetupItem: "setupDistrictItem", components: [
					{kind: "onyx.Item", name: "districtItem", ontap: "districtTapped"}
				]}
			]}
		]}
	]
});