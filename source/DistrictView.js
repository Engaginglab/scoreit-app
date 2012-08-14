enyo.kind({
	name: "DistrictView",
	published: {
		district: null
	},
	events: {
		onShowClub: ""
	},
	districtChanged: function() {
		if (this.district) {
			this.$.districtName.setContent(this.district.name);
			this.loadClubs();
		}
	},
	loadClubs: function() {
		scoreit.handball.club.list(["district", this.district.id], enyo.bind(this, function(sender, response) {
			this.clubs = response.objects;
			this.refreshClubList();
		}));
	},
	refreshClubList: function() {
		this.$.clubList.setCount(this.clubs.length);
		this.$.clubList.render();
	},
	setupClubItem: function(sender, event) {
		var club = this.clubs[event.index];
		this.$.clubItem.setContent(club.name);
	},
	clubTapped: function(sender, event) {
		this.doShowClub({club: this.clubs[event.index]});
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "districtName"},
				{classes: "section-header", content: "Vereine"},
				{kind: "FlyweightRepeater", name: "clubList", onSetupItem: "setupClubItem", components: [
					{kind: "onyx.Item", name: "clubItem", ontap: "clubTapped"}
				]}
			]}
		]}
	]
});