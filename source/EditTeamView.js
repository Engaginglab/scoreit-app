enyo.kind({
	name: "EditTeamView",
	published: {
		team: null
	},
	events: {
		onCancel: ""
	},
	teamChanged: function() {
		if (this.team) {
			this.$.teamName.setValue(this.team.name);
		}
	},
	create: function() {
		this.inherited(arguments);
		this.teamChanged();
		this.loadClubs();
		this.loadPlayers();
		this.loadManagers();
		this.loadCoaches();
	},
	loadClubs: function() {
		scoreit.handball.club.list([], enyo.bind(this, function(sender, response) {
			this.$.clubSelector.setItems(response.objects);
			if (this.team) {
				this.$.clubSelector.setSelectedItem(this.team.club);
				this.clubSelected();
			}
		}));
	},
	clubSelected: function() {
		this.team.club = this.$.clubSelector.getSelectedItem();
		this.loadClubMembers();
	},
	loadClubMembers: function() {
		scoreit.handball.person.list([['clubs', this.team.club.id]], enyo.bind(this, function(sender, response) {
			this.$.playerSelector.setItems(response.objects);
			this.$.managerSelector.setItems(response.objects);
			this.$.coachSelector.setItems(response.objects);
		}));
	},
	loadPlayers: function() {
		if (this.team) {
			scoreit.handball.person.list([['teams', this.team.id]], enyo.bind(this, function(sender, response) {
				this.$.playerSelector.setSelectedItems(response.objects);
			}));
		}
	},
	loadCoaches: function() {
		if (this.team) {
			scoreit.handball.person.list([['teams_coached', this.team.id]], enyo.bind(this, function(sender, response) {
				this.$.coachSelector.setSelectedItems(response.objects);
			}));
		}
	},
	loadManagers: function() {
		if (this.team) {
			scoreit.handball.person.list([['teams_managed', this.team.id]], enyo.bind(this, function(sender, response) {
				this.$.managerSelector.setSelectedItems(response.objects);
			}));
		}
	},
	save: function() {
		var players = this.$.playerSelector.getSelectedItems();
		var playersUris = [];
		for (var i=0; i<players.length; i++) {
			playersUris.push(players[i]["resource_uri"]);
		}
		var coaches = this.$.coachSelector.getSelectedItems();
		var coachesUris = [];
		for (var i=0; i<coaches.length; i++) {
			coachesUris.push(coaches[i]["resource_uri"]);
		}
		var managers = this.$.managerSelector.getSelectedItems();
		var managersUris = [];
		for (var i=0; i<managers.length; i++) {
			managersUris.push(managers[i]["resource_uri"]);
		}
		var params = {
			name: this.$.teamName.getValue(),
			club: this.$.clubSelector.getSelectedItem().resource_uri,
			players: playersUris,
			coaches: coachesUris,
			managers: managersUris
		};

		if (this.team && this.team.id) {
			scoreit.handball.team.put(this.team.id, params, enyo.bind(this, function(sender, response) {
				this.log(response);
			}));
		} else {
			scoreit.handball.team.create(params, enyo.bind(this, function(sender, response) {
				this.log(response);
			}));
		}
		this.log(params);
	},
	components: [
		{kind: "onyx.Groupbox", components: [
			//{kind: "onyx.GroupboxHeader", content: "Info"},
			{kind: "onyx.InputDecorator", classes: "input-fill", components: [
				{kind: "onyx.Input", name: "teamName", placeholder: "Mannschaftsname"}
			]},
			{kind: "FilteredSelector", name: "clubSelector", displayProperty: "name", uniqueProperty: "id", filterProperties: ["name"],
				placeholder: "Verein auswählen...", style: "width: 100%;", onItemSelected: "clubSelected"},
			{kind: "onyx.GroupboxHeader", content: "Spieler"},
			{kind: "TextFieldSelector", name: "playerSelector", displayProperty: "display_name", uniqueProperty: "id",
				filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: true},
			{kind: "onyx.GroupboxHeader", content: "Trainer"},
			{kind: "TextFieldSelector", name: "coachSelector", displayProperty: "display_name", uniqueProperty: "id",
				filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: false},
			{kind: "onyx.GroupboxHeader", content: "Manager"},
			{kind: "TextFieldSelector", name: "managerSelector", displayProperty: "display_name", uniqueProperty: "id",
				filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: false}
		]},
		{kind: "onyx.Button", style: "width: 50%;", content: "Speichern", ontap: "save"},
		{kind: "onyx.Button", style: "width: 50%;", content: "Abbrechen", ontap: "doCancel"}
	]
});