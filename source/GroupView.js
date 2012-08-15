enyo.kind({
	name: "GroupView",
	published: {
		group: null
	},
	events: {
		onShowDistrict: "",
		onShowUnion: "",
		onShowTeam: ""
	},
	groupChanged: function() {
		if (this.group) {
			this.$.groupName.setContent(this.group.name);

			if (this.group.union) {
				this.$.unionHeader.show();
				this.$.unionItem.show();
				this.$.unionItem.setContent(this.group.union.name);
			} else {
				this.$.unionHeader.hide();
				this.$.unionItem.hide();
			}

			if (this.group.district) {
				this.$.districtHeader.show();
				this.$.districtItem.show();
				this.$.districtItem.setContent(this.group.district.name);
			} else {
				this.$.districtHeader.hide();
				this.$.districtItem.hide();
			}

			this.loadTeams();
		}
	},
	loadTeams: function() {
		scoreit.handball.groupteamrelation.list([["group", this.group.id]], enyo.bind(this, function(sender, response) {
			this.teamRelations = response.objects;
			this.refreshLadder();
		}));
	},
	refreshLadder: function() {
		this.teamRelations.sort(function(a, b) {
			return a.score - b.score;
		});
		this.$.ladder.setCount(this.teamRelations.length);
		this.$.ladder.render();
	},
	setupLadderItem: function(sender, event) {
		var teamRelation = this.teamRelations[event.index];
		this.$.position.setContent((event.index + 1) + ".&nbsp;");
		this.$.teamName.setContent(teamRelation.team.display_name);
	},
	unionTapped: function() {
		this.doShowUnion({union: this.group.union});
	},
	districtTapped: function() {
		this.doShowUnion({district: this.group.district});
	},
	teamTapped: function(sender, event) {
		this.doShowTeam({team: this.teamRelations[event.index].team});
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "groupName"},
				{classes: "section-header", content: "Verband", name: "unionHeader"},
				{kind: "onyx.Item", name: "unionItem", ontap: "unionTapped"},
				{classes: "section-header", content: "Bezirk", name: "districtHeader"},
				{kind: "onyx.Item", name: "districtItem", ontap: "districtTapped"},
				{classes: "section-header", content: "Rangliste"},
				{kind: "FlyweightRepeater", name: "ladder", onSetupItem: "setupLadderItem", components: [
					{kind: "onyx.Item", ontap: "teamTapped", components: [
						{name: "position", allowHtml: true, classes: "enyo-inline"},
						{name: "teamName", classes: "enyo-inline"}
					]}
				]}
			]}
		]}
	]
});