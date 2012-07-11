enyo.kind({
	name: "ReportPrepView",
	classes: "prepview",
	events: {
		onStartGame: ""
	},
	rendered: function() {
		this.inherited(arguments);
		this.loadUnions();
		this.$.number.setValue(Math.floor(Math.random()*10000000));
	},
	loadUnions: function() {
		scoreit.union.list([], enyo.bind(this, this.gotUnions));
	},
	gotUnions: function(sender, response) {
		this.unions = response.objects;

		this.$.unionSelect.destroyComponents();
		//this.$.unionSelect.createComponent({content: "Verband wählen", value: -1});
		for (var i = 0; i < this.unions.length; i++) {
			this.$.unionSelect.createComponent({content: this.unions[i].name, value: i});
		}

		this.$.unionSelectDecorator.setDisabled(false);
		this.$.unionSelectDecorator.render();
	},
	unionChanged: function(sender, event) {
		var index = sender.getValue();
		if (index != -1) {
			this.selectedUnion = this.unions[index];
			scoreit.league.list([["league", this.selectedUnion.id]], enyo.bind(this, this.gotLeagues));
		}
	},
	gotLeagues: function(sender, response) {
		this.leagues = response.objects;

		this.$.leagueSelect.destroyComponents();
		//this.$.leagueSelect.createComponent({content: "Klasse wählen", value: -1});
		for (var i = 0; i < this.leagues.length; i++) {
			this.$.leagueSelect.createComponent({content: this.leagues[i].name, value: i});
		}

		this.$.leagueSelectDecorator.setDisabled(false);
		this.$.leagueSelectDecorator.render();
	},
	leagueChanged: function(sender, event) {
		var index = sender.getValue();
		if (index != -1) {
			this.selectedLeague = this.leagues[index];
			scoreit.team.list([["union", this.selectedUnion.id], ["league", this.selectedLeague.id]], enyo.bind(this, this.gotTeams));
		}
	},
	gotTeams: function(sender, response) {
		this.teams = response.objects;

		this.$.homeSelect.destroyComponents();
		this.$.awaySelect.destroyComponents();
		//this.$.homeSelect.createComponent({content: "Mannschaft wählen", value: -1});
		//this.$.awaySelect.createComponent({content: "Mannschaft wählen", value: -1});
		for (var i = 0; i < this.teams.length; i++) {
			this.$.homeSelect.createComponent({content: this.teams[i].name, value: i});
			this.$.awaySelect.createComponent({content: this.teams[i].name, value: i});
		}

		this.$.homeSelectDecorator.setDisabled(false);
		this.$.awaySelectDecorator.setDisabled(false);
		this.$.homeSelectDecorator.render();
		this.$.awaySelectDecorator.render();
	},
	teamChanged: function(sender, event) {
		var index = sender.getValue();
		var team = sender.team;
		if (index != -1) {
			this[team + "Team"] = this.teams[index];
			this.populateTeamMembers(team);
		}
	},
	populateTeamMembers: function(team) {
		var players = this[team + "Team"].players;
		var select = this.$[team + "PlayerSelect"];
		var selectDecorator = this.$[team + "PlayerSelectDecorator"];
		select.destroyComponents();
		//this.$.homeTeamMemberSelect.createComponent({content: "Spieler hinzufügen", value: -1});
		for (var i = 0; i < players.length; i++) {
			select.createComponent({content: players[i].first_name + " " + players[i].last_name, value: i});
		}

		selectDecorator.setDisabled(false);
		selectDecorator.render();

		this[team + "Players"] = players;

		this.$[team + "TeamList"].setCount(players.length);
		this.$[team + "TeamList"].render();
		this.$.doneButton.setDisabled(!this.homeTeam || !this.homeTeam.players || !this.awayTeam || !this.awayTeam.players);
	},
	playerChanged: function(sender, event) {
		var index = sender.getValue();
		var team = sender.team;
		var players = this[team + "Players"];

		if (index != -1) {
			var player = this[team + "Team"].players[index];

			players = players || [];
			players.push(player);
			this.$[team + "TeamList"].render();
			this.$[team + "TeamMemberSelect"].setSelected(0);
		}
	},
	setupPlayerItem: function(sender, event) {
		this.$[sender.team + "PlayerItem"].setPlayer(this[sender.team + "Players"][event.index]);
	},
	startGame: function() {
		this.doStartGame({home: this.homeTeam, away: this.awayTeam, number: this.$.number.getValue(), union: this.selectedUnion, gameClass: this.selectedClass});
	},
	reset: function() {
		this.$.unionSelect.setSelected(0);
		this.$.leagueSelect.setSelected(0);
		this.$.leagueSelectDecorator.setDisabled(true);
		this.$.homeSelect.setSelected(0);
		this.$.homeSelectDecorator.setDisabled(true);
		this.$.awaySelect.setSelected(0);
		this.$.awaySelectDecorator.setDisabled(true);

		this.homeTeam = null;
		this.awayTeam = null;
		this.homePlayers = [];
		this.awayPlayers = [];
		this.homeTeamList.render();
		this.awayTeamList.render();

		this.$.doneButton.setDisabled(true);
	},
	components: [
		{kind: "FittableRows", classes: "prepview-inner", components: [
			{kind: "onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "Allgemein"},
				{kind: "onyx.InputDecorator", components: [
					{kind: "onyx.Input", name: "number", style: "width: 480px"}, {classes: "label", content: "Spielnummer"}
				]},
				{kind: "onyx.custom.SelectDecorator", name: "unionSelectDecorator", disabled: true, components: [
					{kind: "Select", name: "unionSelect", onchange: "unionChanged", components: [
						{content: "Verband wählen", value: -1}
					]}
				]},
				{kind: "onyx.custom.SelectDecorator", name: "leagueSelectDecorator", disabled: true, components: [
					{kind: "Select", name: "leagueSelect", onchange: "leagueChanged", components: [
						{content: "Klasse wählen", value: -1}
					]}
				]}
			]},
			{kind: "FittableColumns", fit: true, components: [
				{kind: "onyx.Groupbox", layoutKind: "FittableRowsLayout", style: "width: 50%", components: [
					{kind: "onyx.GroupboxHeader", content: "Heim"},
					{kind: "onyx.custom.SelectDecorator", name: "homeSelectDecorator", disabled: true, components: [
						{kind: "Select", name: "homeSelect", team: "home", onchange: "teamChanged", components: [
							{content: "Mannschaft wählen", value: -1}
						]}
					]},
					{fit: true, kind: "Scroller", components: [
						{name: "homeTeamList", kind: "FlyweightRepeater", team: "home", onSetupItem: "setupPlayerItem", classes: "prepview-teamlist", components: [
							{kind: "PrepPlayerItem", name: "homePlayerItem"}
						]},
						{kind: "onyx.custom.SelectDecorator", showing: false, name: "homePlayerSelectDecorator", disabled: true, components: [
							{kind: "Select", name: "homePlayerSelect", team: "home", onchange: "playerChanged", components: [
								{content: "Spieler hinzufügen", value: -1}
							]}
						]}
					]}
				]},
				{kind: "onyx.Groupbox", layoutKind: "FittableRowsLayout", style: "width: 50%", components: [
					{kind: "onyx.GroupboxHeader", content: "Gast"},
					{kind: "onyx.custom.SelectDecorator", name: "awaySelectDecorator", disabled: true, components: [
						{kind: "Select", name: "awaySelect", team: "away", onchange: "teamChanged", components: [
							{content: "Mannschaft wählen", value: -1}
						]}
					]},
					{fit: true, kind: "Scroller", components: [
						{name: "awayTeamList", kind: "FlyweightRepeater", team: "away", onSetupItem: "setupPlayerItem", classes: "prepview-teamlist", components: [
							{kind: "PrepPlayerItem", name: "awayPlayerItem"}
						]},
						{kind: "onyx.custom.SelectDecorator", showing: false, name: "awayPlayerSelectDecorator", disabled: true, components: [
							{kind: "Select", name: "awayPlayerSelect", team: "away", onchange: "playerChanged", components: [
								{content: "Spieler hinzufügen", value: -1}
							]}
						]}
					]}
				]}
			]},
			// {kind: "onyx.Groupbox", components: [
			// 	{kind: "onyx.GroupboxHeader", content: "Zeitnehmer / Sekretär / Schiedsrichter"}
			// ]},
			{kind: "onyx.Button", content: "Spiel Starten", classes: "prepview-done-button", onclick: "startGame", disabled: true, name: "doneButton"}
		]}
	]
});

enyo.kind({
	name: "PrepPlayerItem",
	kind: "onyx.Item",
	published: {
		player: null
	},
	rendered: function() {
		this.inherited(arguments);
		this.playerChanged();
	},
	playerChanged: function() {
		if (this.player) {
			this.$.name.setContent(this.player.first_name + " " + this.player.last_name);
			this.$.number.setValue(this.player.shirt_number || "");
		}
	},
	shirtNumberChanged: function() {
		this.player.shirt_number = this.$.number.getValue();
	},
	components: [
		{name: "name", classes: "prepview-member-item-name"},
		{kind: "onyx.InputDecorator", classes: "prepview-member-item-input", components: [
			{kind: "onyx.Input", name: "number", style: "width: 40px; text-align: center", onchange: "shirtNumberChanged", placeholder: "Tr-#"}
		]}
	]
});