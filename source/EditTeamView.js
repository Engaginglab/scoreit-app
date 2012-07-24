enyo.kind({
	name: "EditTeamView",
	classes: "scoreit-form",
	published: {
		team: null
	},
	events: {
		onCancel: ""
	},
	teamChanged: function() {
		if (this.team) {
			this.$.teamName.setValue(this.team.name);
			this.club = this.team.club;
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
		this.club = this.$.clubSelector.getSelectedItem();
		this.loadClubMembers();
	},
	loadClubMembers: function() {
		scoreit.handball.person.list([['clubs', this.club.id]], enyo.bind(this, function(sender, response) {
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
	getParamArray: function(array) {
		var paramArray = [];
		for (var i=0; i<array.length; i++) {
			if (array[i].resource_uri) {
				paramArray.push(array[i].resource_uri);
			} else {
				var cut = array[i].display_name.lastIndexOf(" ");
				paramArray.push({
					first_name: array[i].display_name.substring(0, cut),
					last_name: array[i].display_name.substring(cut+1)
				});
			}
		}
		return paramArray;
	},
	save: function() {
		var players = this.getParamArray(this.$.playerSelector.getSelectedItems());
		var coaches = this.getParamArray(this.$.coachSelector.getSelectedItems());
		var managers = this.getParamArray(this.$.managerSelector.getSelectedItems());

		var params = {
			name: this.$.teamName.getValue(),
			club: this.club.resource_uri,
			players: players,
			coaches: coaches,
			managers: managers
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
		{kind: "onyx.InputDecorator", classes: "input-fill", components: [
			{kind: "onyx.Input", name: "teamName", placeholder: "Mannschaftsname"}
		]},
		{kind: "FilteredSelector", name: "clubSelector", displayProperty: "name", uniqueProperty: "id", filterProperties: ["name"],
			placeholder: "Verein auswählen...", style: "width: 100%;", onItemSelected: "clubSelected"},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.GroupboxHeader", content: "Spieler"},
			{kind: "TextFieldSelector", name: "playerSelector", displayProperty: "display_name", uniqueProperty: "id",
				filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: true}
		]},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.GroupboxHeader", content: "Trainer"},
			{kind: "TextFieldSelector", name: "coachSelector", displayProperty: "display_name", uniqueProperty: "id",
				filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: false}
		]},
		{kind: "onyx.Groupbox", components: [
			{kind: "onyx.GroupboxHeader", content: "Manager"},
			{kind: "TextFieldSelector", name: "managerSelector", displayProperty: "display_name", uniqueProperty: "id",
				filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: false}
		]},
		{kind: "onyx.Button", style: "width: 50%;", content: "Abbrechen", ontap: "doCancel"},
		{kind: "onyx.Button", style: "width: 50%;", content: "Speichern", ontap: "save", classes: "onyx-affirmative"}
	]
});