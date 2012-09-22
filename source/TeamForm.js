/**
	Form for editing Team objects
*/
enyo.kind({
	name: "TeamForm",
	classes: "scoreit-form",
	published: {
		//* Optional team object for prefilling form
		team: null,
		//* Clubs for the team to choose from
		clubs: []
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
	},
	loadClubs: function() {
		scoreit.handball.club.list([], enyo.bind(this, function(sender, response) {
			this.setClubs(response.objects);
		}));
	},
	getData: function() {
		return {
			name: this.$.teamName.getValue(),
			club: this.$.clubSelector.getSelectedItem()
		};
	},
	components: [
		{kind: "onyx.InputDecorator", classes: "input-fill", components: [
			{kind: "onyx.Input", name: "teamName", placeholder: "Mannschaftsname (z.B.: \"Herren I\")"}
		]},
		{kind: "FilteredSelector", name: "clubSelector", displayProperty: "name", uniqueProperty: "id", filterProperties: ["name"],
			placeholder: "Verein auswählen...", style: "width: 100%;", onItemSelected: "clubSelected"}
	]
});