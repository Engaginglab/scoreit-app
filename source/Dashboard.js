enyo.kind({
	name: "Dashboard",
	events: {
		onShowClub: "",
		onShowTeam: ""
	},
	refresh: function() {
		this.loadClubs();
		this.loadTeams();
	},
	loadClubs: function() {
		this.clubMemberships = null;
		this.clubsManaged = null;

		scoreit.handball.clubmanagerrelation.list([["manager", scoreit.user.handball_profile.id]], enyo.bind(this, function(sender, response) {
			// this.log(response);
			this.clubsManaged = response.objects;
			if (this.clubMemberships) {
				this.refreshClubList();
				this.loadAllClubs();
			}
		}));
		scoreit.handball.clubmemberrelation.list([["member", scoreit.user.handball_profile.id]], enyo.bind(this, function(sender, response) {
			// this.log(response);
			this.clubMemberships = response.objects;
			if (this.clubsManaged) {
				this.refreshClubList();
				this.loadAllClubs();
			}
		}));
	},
	loadAllClubs: function() {
		scoreit.handball.club.list([], enyo.bind(this, function(sender, response) {
			var clubs = response.objects.filter(enyo.bind(this, function(club) {
				for (var i=0; i<this.clubs.length; i++) {
					if (this.clubs[i].id == club.id) {
						return false;
					}
				}
				return true;
			}));
			this.$.clubSelector.setItems(clubs);
		}));
	},
	refreshClubList: function() {
		this.assembleClubArray();
		if (this.teams) {
			this.loadAllTeams();
		}
		this.$.clubList.setCount(this.clubs.length);
		this.$.clubList.render();
	},
	assembleClubArray: function() {
		this.clubs = [];

		for (var i=0; i<this.clubsManaged.length; i++) {
			this.clubsManaged[i].club.isManager = true;
			this.clubs.push(this.clubsManaged[i].club);
		}

		for (var i=0; i<this.clubMemberships.length; i++) {
			var club = null;
			for (var j=0; j<this.clubs.length; j++) {
				if (this.clubs[j].id == this.clubMemberships[i].club.id) {
					club = this.clubs[j];
					break;
				}
			}

			if (!club) {
				club = this.clubMemberships[i].club;
				this.clubs.push(club);
			}
			club.isMember = true;
		}
	},
	setupClubItem: function(sender, event) {
		var club = this.clubs[event.index];
		this.$.clubItem.setContent(club.name + (club.isManager ? "*" : "") + (club.isMember ? "+" : ""));
	},
	addClub: function(club) {
		var data = {
			member: scoreit.user.handball_profile.resource_uri,
			club: club.resource_uri || club
		};
		scoreit.handball.clubmemberrelation.create(data, enyo.bind(this, function(sender, response) {
			this.loadClubs();
		}));
	},
	clubSelected: function(sender, event) {
		this.$.clubSelector.setSelectedItem(null);
		this.addClub(event.item);
	},
	newClub: function() {
		this.$.newClubForm.setClub(null);
		this.$.newClubPopup.show();
	},
	newClubConfirm: function() {
		this.$.newClubPopup.hide();
		this.addClub(this.$.newClubForm.getData());
	},
	loadTeams: function() {
		this.teamPlayerRelations = null;
		this.teamManagerRelations = null;
		this.teamCoachRelations = null;

		scoreit.handball.teammanagerrelation.list([["manager", scoreit.user.handball_profile.id]], enyo.bind(this, function(sender, response) {
			this.teamManagerRelations = response.objects;
			if (this.teamPlayerRelations && this.teamCoachRelations) {
				this.refreshTeamList();
			}
		}));
		scoreit.handball.teamplayerrelation.list([["player", scoreit.user.handball_profile.id]], enyo.bind(this, function(sender, response) {
			this.teamPlayerRelations = response.objects;
			if (this.teamManagerRelations && this.teamCoachRelations) {
				this.refreshTeamList();
			}
		}));
		scoreit.handball.teamcoachrelation.list([["coach", scoreit.user.handball_profile.id]], enyo.bind(this, function(sender, response) {
			this.teamCoachRelations = response.objects;
			if (this.teamManagerRelations && this.teamPlayerRelations) {
				this.refreshTeamList();
			}
		}));
	},
	loadAllTeams: function() {
		scoreit.handball.team.list([], enyo.bind(this, function(sender, response) {
			var teams = response.objects.filter(enyo.bind(this, function(team) {
				for (var i=0; i<this.teams.length; i++) {
					var rightClub = false;
					for (var j=0; j<this.clubs.length; j++) {
						if (this.teams[i].club.id == this.clubs[j].id) {
							rightClub = true;
							break;
						}
					}
					if (!rightClub) {
						return false;
					}

					if (this.teams[i].id == team.id) {
						if (this.teams[i].isPlayer) {
							return false;
						} else {
							return true;
						}
					}
				}
				return true;
			}));
			this.$.teamSelector.setItems(teams);
		}));
	},
	refreshTeamList: function() {
		this.assembleTeamArray();
		if (this.clubs) {
			this.loadAllTeams();
		}
		this.$.teamList.setCount(this.teams.length);
		this.$.teamList.render();
	},
	assembleTeamArray: function() {
		this.teams = [];

		for (var i=0; i<this.teamManagerRelations.length; i++) {
			this.teamManagerRelations[i].team.isManager = true;
			this.teams.push(this.teamManagerRelations[i].team);
		}

		for (var i=0; i<this.teamPlayerRelations.length; i++) {
			var team = null;
			for (var j=0; j<this.teams.length; j++) {
				if (this.teams[j].id == this.teamPlayerRelations[i].team.id) {
					team = this.teams[j];
					break;
				}
			}

			if (!team) {
				team = this.teamPlayerRelations[i].team;
				this.teams.push(team);
			}
			team.isPlayer = true;
		}

		for (var i=0; i<this.teamCoachRelations.length; i++) {
			var team = null;
			for (var j=0; j<this.teams.length; j++) {
				if (this.teams[j].id == this.teamCoachRelations[i].team.id) {
					team = this.teams[j];
					break;
				}
			}

			if (!team) {
				team = this.teamCoachRelations[i].team;
				this.teams.push(team);
			}
			team.isCoach = true;
		}
	},
	setupTeamItem: function(sender, event) {
		var team = this.teams[event.index];
		this.$.teamItem.setContent(team.display_name + (team.isManager ? "*" : "") + (team.isPlayer ? "+" : "") + (team.isCoach ? "-" : ""));
	},
	addTeam: function(team) {
		var data = {
			player: scoreit.user.handball_profile.resource_uri,
			team: team.resource_uri || team
		};
		scoreit.handball.teamplayerrelation.create(data, enyo.bind(this, function(sender, response) {
			this.loadTeams();
		}));
	},
	teamSelected: function(sender, event) {
		this.$.teamSelector.setSelectedItem(null);
		this.addTeam(event.item);
	},
	newTeam: function() {
		this.$.newTeamForm.setClubs(this.clubs);
		this.$.newTeamForm.setTeam({name: "", club: this.clubs[0]});
		this.$.newTeamPopup.show();
	},
	newTeamConfirm: function() {
		this.$.newTeamPopup.hide();
		this.addTeam(this.$.newTeamForm.getData());
	},
	clubTapped: function(sender, event) {
		this.doShowClub({club: this.clubs[event.index]});
	},
	teamTapped: function(sender, event) {
		this.doShowTeam({team: this.teams[event.index]});
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", content: "home"},
				{kind: "CollapsibleGroupbox", caption: "Meine Vereine", components: [
					{kind: "FlyweightRepeater", name: "clubList", onSetupItem: "setupClubItem", components: [
						{kind: "onyx.Item", name: "clubItem", ontap: "clubTapped"}
					]}
				]},
				{kind: "FilteredSelector", name: "clubSelector", displayProperty: "name", uniqueProperty: "id", filterProperties: ["name"],
					placeholder: "Verein beitreten...", classes: "row-button", onItemSelected: "clubSelected"},
				{kind: "onyx.Button", content: "Neuen Verein Gründen", ontap: "newClub", classes: "row-button"},
				{kind: "onyx.Popup", name: "newClubPopup", floating: true, centered: true, components: [
					{kind: "ClubForm", name: "newClubForm"},
					{kind: "onyx.Button", content: "Speichern", ontap: "newClubConfirm", classes: "onyx-affirmative", style: "width: 100%;"}
				]},
				{kind: "CollapsibleGroupbox", caption: "Meine Mannschaften", style: "margin-top: 10px;", components: [
					{kind: "FlyweightRepeater", name: "teamList", onSetupItem: "setupTeamItem", components: [
						{kind: "onyx.Item", name: "teamItem", ontap: "teamTapped"}
					]}
				]},
				{kind: "FilteredSelector", name: "teamSelector", displayProperty: "display_name", uniqueProperty: "id", filterProperties: ["display_name"],
					placeholder: "Mannschaft beitreten...", classes: "row-button", onItemSelected: "teamSelected"},
				{kind: "onyx.Button", content: "Neue Mannschaft Gründen", ontap: "newTeam", classes: "row-button"},
				{kind: "onyx.Popup", name: "newTeamPopup", floating: true, centered: true, components: [
					{kind: "TeamForm", name: "newTeamForm", style: "width: 300px;"},
					{kind: "onyx.Button", content: "Speichern", ontap: "newTeamConfirm", classes: "onyx-affirmative", style: "width: 100%;"}
				]},
				{style: "height: 200px;"}
			]}
		]},
		{kind: "LoadingPopup"}
	]
});