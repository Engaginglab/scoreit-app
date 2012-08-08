enyo.kind({
	name: "DetailView",
	views: {
		"clubView": 0
	},
	showView: function(view) {
		this.$.panels.setIndex(this.views[view]);
	},
	showClub: function(club) {
		this.$.clubView.setClub(club);
		this.showView("clubView");
	},
	components: [
		{kind: "Panels", draggable: false, name: "panels", arrangerKind: "CarouselArranger", classes: "enyo-fill", components: [
			{kind: "ClubView", classes: "enyo-fill"}
		]}
	]
});