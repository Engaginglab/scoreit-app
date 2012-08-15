enyo.kind({
	name: "GroupView",
	published: {
		group: null
	},
	groupChanged: function() {
		if (this.group) {
			this.$.groupName.setContent(this.group.name);
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
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "groupName"},
				{classes: "section-header", content: "Rangliste"},
				{kind: "FlyweightRepeater", name: "ladder", onSetupItem: "setupLadderItem", components: [
					{kind: "onyx.Item", components: [
						{name: "position", allowHtml: true, classes: "enyo-inline"},
						{name: "teamName", classes: "enyo-inline"}
					]}
				]}
			]}
		]}
	]
});