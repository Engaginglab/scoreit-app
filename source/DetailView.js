enyo.kind({
	name: "DetailView",
	views: {
		"clubView": 0,
		"teamView": 1
	},
	showView: function(view) {
		this.$.panels.setIndex(this.views[view]);
	},
	showClub: function(club) {
		this.$.clubView.setClub(club);
		this.showView("clubView");
	},
	showTeam: function(team) {
		this.$.teamView.setTeam(team);
		this.showView("teamView");
	},
	showTeamHandler: function(sender, event) {
		this.showTeam(event.team);
	},
	components: [
		{kind: "Panels", draggable: false, name: "panels", arrangerKind: "CarouselArranger", classes: "enyo-fill", components: [
			{kind: "ClubView", classes: "enyo-fill", onShowTeam: "showTeamHandler"},
			{kind: "TeamView", classes: "enyo-fill"}
		]}
	]
});