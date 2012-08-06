enyo.kind({
	name: "TeamForm",
	classes: "scoreit-form",
	published: {
		team: null,
		clubs: []
	},
	events: {
		onCancel: ""
	},
	teamChanged: function() {
		if (this.team) {
			this.$.teamName.setValue(this.team.name);
			this.$.clubSelector.setSelectedItem(this.team.club);
		}
	},
	clubsChanged: function() {
		this.$.clubSelector.setItems(this.clubs);
	},
	create: function() {
		this.inherited(arguments);
		this.teamChanged();
		this.clubsChanged();
		// this.loadPlayers();
		// this.loadManagers();
		// this.loadCoaches();
	},
	loadClubs: function() {
		scoreit.handball.club.list([], enyo.bind(this, function(sender, response) {
			this.setClubs(response.objects);
		}));
	},
	// clubSelected: function() {
	// 	this.club = this.$.clubSelector.getSelectedItem();
	// 	this.loadClubMembers();
	// },
	// loadClubMembers: function() {
	// 	scoreit.handball.person.list([['clubs', this.club.id]], enyo.bind(this, function(sender, response) {
	// 		this.$.playerSelector.setItems(response.objects);
	// 		this.$.managerSelector.setItems(response.objects);
	// 		this.$.coachSelector.setItems(response.objects);
	// 	}));
	// },
	// loadPlayers: function() {
	// 	if (this.team) {
	// 		scoreit.handball.person.list([['teams', this.team.id]], enyo.bind(this, function(sender, response) {
	// 			this.$.playerSelector.setSelectedItems(response.objects);
	// 		}));
	// 	}
	// },
	// loadCoaches: function() {
	// 	if (this.team) {
	// 		scoreit.handball.person.list([['teams_coached', this.team.id]], enyo.bind(this, function(sender, response) {
	// 			this.$.coachSelector.setSelectedItems(response.objects);
	// 		}));
	// 	}
	// },
	// loadManagers: function() {
	// 	if (this.team) {
	// 		scoreit.handball.person.list([['teams_managed', this.team.id]], enyo.bind(this, function(sender, response) {
	// 			this.$.managerSelector.setSelectedItems(response.objects);
	// 		}));
	// 	}
	// },
	// getParamArray: function(array) {
	// 	var paramArray = [];
	// 	for (var i=0; i<array.length; i++) {
	// 		if (array[i].resource_uri) {
	// 			paramArray.push(array[i].resource_uri);
	// 		} else {
	// 			var cut = array[i].display_name.lastIndexOf(" ");
	// 			paramArray.push({
	// 				first_name: array[i].display_name.substring(0, cut),
	// 				last_name: array[i].display_name.substring(cut+1)
	// 			});
	// 		}
	// 	}
	// 	return paramArray;
	// },
	getData: function() {
		// var players = this.getParamArray(this.$.playerSelector.getSelectedItems());
		// var coaches = this.getParamArray(this.$.coachSelector.getSelectedItems());
		// var managers = this.getParamArray(this.$.managerSelector.getSelectedItems());

		return {
			name: this.$.teamName.getValue(),
			club: this.$.clubSelector.getSelectedItem()
			// players: players,
			// coaches: coaches,
			// managers: managers
		};
	},
	components: [
		{kind: "onyx.InputDecorator", classes: "input-fill", components: [
			{kind: "onyx.Input", name: "teamName", placeholder: "Mannschaftsname (z.B.: \"Herren I\")"}
		]},
		{kind: "FilteredSelector", name: "clubSelector", displayProperty: "name", uniqueProperty: "id", filterProperties: ["name"],
			placeholder: "Verein auswählen...", style: "width: 100%;", onItemSelected: "clubSelected"}
		// {kind: "onyx.Groupbox", components: [
		// 	{kind: "onyx.GroupboxHeader", content: "Spieler"},
		// 	{kind: "TextFieldSelector", name: "playerSelector", displayProperty: "display_name", uniqueProperty: "id",
		// 		filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: true}
		// ]},
		// {kind: "onyx.Groupbox", components: [
		// 	{kind: "onyx.GroupboxHeader", content: "Trainer"},
		// 	{kind: "TextFieldSelector", name: "coachSelector", displayProperty: "display_name", uniqueProperty: "id",
		// 		filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: false}
		// ]},
		// {kind: "onyx.Groupbox", components: [
		// 	{kind: "onyx.GroupboxHeader", content: "Manager"},
		// 	{kind: "TextFieldSelector", name: "managerSelector", displayProperty: "display_name", uniqueProperty: "id",
		// 		filterProperties: ["display_name"], hint: "Namen eingeben...", allowNewItem: false}
		// ]},
	]
});