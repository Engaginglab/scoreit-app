enyo.kind({
	name: "DetailView",
	views: {
		"rootView": 0,
		"unionView": 1,
		"districtView": 2,
		"groupView": 3,
		"clubView": 4,
		"teamView": 5
	},
	showView: function(view) {
		this.$.panels.setIndex(this.views[view]);
	},
	showRootView: function() {
		this.showView("rootView");
	},
	showUnion: function(union) {
		this.$.unionView.setUnion(union);
		this.showView("unionView");
	},
	showDistrict: function(district) {
		this.$.districtView.setDistrict(district);
		this.showView("districtView");
	},
	showGroup: function(group) {
		this.$.groupView.setGroup(group);
		this.showView("groupView");
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
	showGroupHandler: function(sender, event) {
		this.showGroup(event.group);
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
			{kind: "UnionView", classes: "enyo-fill", onShowDistrict: "showDistrictHandler", onShowGroup: "showGroupHandler"},
			{kind: "DistrictView", classes: "enyo-fill", onShowClub: "showClubHandler", onShowUnion: "showUnionHandler", onShowGroup: "showGroupHandler"},
			{kind: "GroupView", classes: "enyo-fill", onShowDistrict: "showDistrictHandler", onShowUnion: "showUnionHandler", onShowTeam: "showTeamHandler"},
			{kind: "ClubView", classes: "enyo-fill", onShowTeam: "showTeamHandler", onShowDistrict: "showDistrictHandler"},
			{kind: "TeamView", classes: "enyo-fill", onShowClub: "showClubHandler"}
		]}
	]
});