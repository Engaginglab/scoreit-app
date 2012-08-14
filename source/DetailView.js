enyo.kind({
	name: "DetailView",
	views: {
		"rootView": 0,
		"unionView": 1,
		"districtView": 2,
		"clubView": 3,
		"teamView": 4
	},
	showView: function(view) {
		this.$.panels.setIndex(this.views[view]);
	},
	showUnion: function(union) {
		this.$.unionView.setUnion(union);
		this.showView("unionView");
	},
	showDistrict: function(district) {
		this.$.districtView.setDistrict(district);
		this.showView("districtView");
	},
	showClub: function(club) {
		this.$.clubView.setClub(club);
		this.showView("clubView");
	},
	showTeam: function(team) {
		this.$.teamView.setTeam(team);
		this.showView("teamView");
	},
	showUnionHandler: function(sender, event) {
		this.showUnion(event.union);
	},
	showDistrictHandler: function(sender, event) {
		this.showDistrict(event.district);
	},
	showClubHandler: function(sender, event) {
		this.showClub(event.club);
	},
	showTeamHandler: function(sender, event) {
		this.showTeam(event.team);
	},
	components: [
		{kind: "Panels", draggable: false, name: "panels", arrangerKind: "CarouselArranger", classes: "enyo-fill", components: [
			{kind: "RootView", classes: "enyo-fill", onShowUnion: "showUnionHandler"},
			{kind: "UnionView", classes: "enyo-fill", onShowDistrict: "showDistrictHandler"},
			{kind: "DistrictView", classes: "enyo-fill", onShowClub: "showClubHandler"},
			{kind: "ClubView", classes: "enyo-fill", onShowTeam: "showTeamHandler"},
			{kind: "TeamView", classes: "enyo-fill"}
		]}
	]
});