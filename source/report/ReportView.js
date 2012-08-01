enyo.kind({
	name: "ReportView",
	openGameView: function() {
		var data = this.$.reportForm.getData();
		this.$.reportGameView.setHome(data.home);
		this.$.reportGameView.setAway(data.away);
		this.$.reportGameView.setPlayers(data.players);
		this.$.panels.setIndex(1);
	},
	components: [
		{kind: "Panels", classes: "enyo-fill", components: [
			{kind: "FittableRows", components: [
				{kind: "Scroller", fit: true, components: [
					{kind: "ReportForm"}
				]},
				{kind: "onyx.Button", classes: "onyx-affirmative", style: "width: 100%", content: "Weiter", ontap: "openGameView"}
			]},
			{kind: "ReportGameView"}
		]}
	]
});