/**
	Detail view for districts
*/
enyo.kind({
	name: "DistrictView",
	published: {
		district: null
	},
	events: {
		//* Fired when the user selects on of the clubs in this district
		onShowClub: "",
		//* Fired when the user selects the union this district belongs to
		onShowUnion: "",
		//* Fired when the user selects one of the groups belonging to this district
		onShowGroup: ""
	},
	districtChanged: function() {
		if (this.district) {
			this.$.districtName.setContent(this.district.name);
			this.$.unionItem.setContent(this.district.union.name);
			this.loadClubs();
			this.loadLeagues();
		}
	},
	loadClubs: function() {
		scoreit.handball.club.list([["district", this.district.id]], enyo.bind(this, function(sender, response) {
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
	unionTapped: function() {
		this.doShowUnion({union: this.district.union});
	},
	loadLeagues: function() {
		scoreit.handball.group.list([["kind", "league"], ["district", this.district.id]], enyo.bind(this, function(sender, response) {
			this.$.groupList.setGroups(response.objects);
		}));
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "districtName"},
				{kind: "onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "Verband"},
					{kind: "onyx.Item", name: "unionItem", ontap: "unionTapped"}
				]},
				{kind: "CollapsibleGroupbox", caption: "Vereine", style: "margin-top: 10px;", components: [
					{kind: "FlyweightRepeater", name: "clubList", onSetupItem: "setupClubItem", components: [
						{kind: "onyx.Item", name: "clubItem", ontap: "clubTapped"}
					]}
				]},
				{classes: "section-header", content: "Ligen"},
				{kind: "GroupList", onShowGroup: "showGroupHandler"}
			]}
		]}
	]
});