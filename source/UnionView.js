enyo.kind({
	name: "UnionView",
	published: {
		union: null
	},
	events: {
		onShowDistrict: "",
		onShowGroup: ""
	},
	unionChanged: function() {
		if (this.union) {
			this.$.unionName.setContent(this.union.name);
			this.loadDistricts();
			this.loadLeagues();
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
	loadLeagues: function() {
		scoreit.handball.group.list([["kind", "league"], ["union", this.union.id], ["district", true, "isnull"]], enyo.bind(this, function(sender, response) {
			this.$.groupList.setGroups(response.objects);
		}));
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "unionName"},
				{classes: "section-header", content: "Bezirke"},
				{kind: "FlyweightRepeater", name: "districtList", onSetupItem: "setupDistrictItem", components: [
					{kind: "onyx.Item", name: "districtItem", ontap: "districtTapped"}
				]},
				{classes: "section-header", content: "Ligen"},
				{kind: "GroupList", onShowGroup: "showGroupHandler"}
			]}
		]}
	]
});