/**
	Detail view for Team objects
*/
enyo.kind({
	name: "TeamView",
	classes: "teamview",
	published: {
		//* The team object
		team: null,
		//* The currently signed in user
		user: null
	},
	events: {
		//* Fired when the user selects a person in the team
		onShowPerson: "",
		//* Fired when the user selects the club the team belongs to
		onShowClub: "",
		//* Fired when the user selects a group the team is in
		onShowGroup: ""
	},
	userChanged: function() {
		this.checkPermissions();
	},
	teamChanged: function() {
		this.checkPermissions();
		if (this.team) {
			this.$.teamName.setContent(this.team.name);
			this.$.clubItem.setContent(this.team.club.name);
			this.loadPlayers();
			this.loadCoaches();
			this.loadManagers();
			this.loadClubMembers();
			this.loadGroups();
		}
	},
	/**
		Check the user permissions based on team and club membership and manager status and adjust UI accordingly
	*/
	checkPermissions: function() {
		this.removeClass("manager");
		this.removeClass("member");
		this.removeClass("coach");
		if (this.user && this.user.handball_profile && this.team) {
			var profile = this.user.handball_profile;
			scoreit.handball.clubmanagerrelation.list([["manager", profile.id], ["club", this.team.club.id], ["validated", true]], enyo.bind(this, function(sender, response) {
				if (response.objects.length) {
					this.addClass("manager");
					this.addClass("member");
				}
			}));
			scoreit.handball.teammanagerrelation.list([["manager", profile.id], ["team", this.team.id], ["validated", true]], enyo.bind(this, function(sender, response) {
				if (response.objects.length) {
					this.addClass("manager");
					this.addClass("member");
				}
			}));
			scoreit.handball.teamplayerrelation.list([["player", profile.id], ["team", this.team.id], ["validated", true]], enyo.bind(this, function(sender, response) {
				if (response.objects.length) {
					this.addClass("member");
				}
			}));
			scoreit.handball.teamplayerrelation.list([["coach", profile.id], ["team", this.team.id], ["validated", true]], enyo.bind(this, function(sender, response) {
				if (response.objects.length) {
					this.addClass("member");
					this.addClass("coach");
				}
			}));
		}
	},
	loadClubMembers: function() {
		if (this.team && this.team.club) {
			// this.$.loadingPopup.setText("Lade Mitglieder...");
			// this.$.loadingPopup.show();
			scoreit.handball.clubmemberrelation.list([["club", this.team.club.id]], enyo.bind(this, function(sender, response) {
				// this.$.loadingPopup.hide();
				this.clubMemberships = response.objects;
				this.populatePlayerSelector();
				this.populateCoachSelector();
				this.populateManagerSelector();
			}));
		}
	},
	loadPlayers: function() {
		if (this.team) {
			this.$.loadingPopup.setText("Lade Spieler...");
			this.$.loadingPopup.show();
			scoreit.handball.teamplayerrelation.list([["team", this.team.id]], enyo.bind(this, function(sender, response) {
				this.$.loadingPopup.hide();
				this.playerRelations = response.objects;
				this.refreshPlayerList();
				this.populatePlayerSelector();
			}));
		}
	},
	refreshPlayerList: function() {
		this.$.playerList.setCount(this.playerRelations.length);
		this.$.playerList.render();
	},
	setupPlayerItem: function(sender, event) {
		var playerRelation = this.playerRelations[event.index];
		this.$.playerName.setContent(playerRelation.player.display_name);
		this.$.playerItem.addRemoveClass("unconfirmed", !playerRelation.validated);
	},
	newPlayer: function() {
		this.$.newPlayerForm.clear();
		this.$.newPlayerEmail.setValue("");
		this.$.newPlayerPopup.show();
	},
	newPlayerConfirm: function() {
		this.$.newPlayerPopup.hide();
		this.addPlayer(this.$.newPlayerForm.getData());
	},
	addPlayer: function(player) {
		var data = {
			team: this.team.resource_uri,
			player: player.resource_uri || player
		};
		this.$.loadingPopup.setText("Füge Spieler hinzu...");
		this.$.loadingPopup.show();
		scoreit.handball.teamplayerrelation.create(data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadPlayers();
			this.loadClubMembers();
		}));
	},
	playerRemoveButtonTapped: function(sender, event) {
		var playerRelation = this.playerRelations[event.index];
		// this.$.confirmPopup.setTitle("Mitglied Entfernen");
		this.$.confirmPopup.setMessage("Möchten sie diesen Spieler wirklich entfernen?");
		this.$.confirmPopup.setAction("destructive");
		this.$.confirmPopup.setCallback(enyo.bind(this, function(choice) {
			if (choice) {
				this.removePlayer(playerRelation);
			}
		}));
		this.$.confirmPopup.show();
	},
	removePlayer: function(playerRelation) {
		this.$.loadingPopup.setText("Entferne Spieler...");
		this.$.loadingPopup.show();
		scoreit.handball.teamplayerrelation.remove(playerRelation.id, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadPlayers();
		}));
	},
	confirmPlayerRelation: function(sender, event) {
		var playerRelation = this.playerRelations[event.index];
		var data = {
			player: playerRelation.player.resource_uri,
			team: playerRelation.team.resource_uri,
			validated: true
		};
		this.$.loadingPopup.setText("Bestätige Spieler...");
		this.$.loadingPopup.show();
		scoreit.handball.teamplayerrelation.update(playerRelation.id, data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadPlayers();
		}));
	},
	populatePlayerSelector: function() {
		var members = [];
		if (this.clubMemberships) {
			var playerRelations = this.playerRelations || [];
			for (var i=0; i<this.clubMemberships.length; i++) {
				var isPlayer = false;
				for (var j=0; j<playerRelations.length; j++) {
					if (this.clubMemberships[i].member.id == playerRelations[j].player.id) {
						isPlayer = true;
						break;
					}
				}
				if (!isPlayer) {
					members.push(this.clubMemberships[i].member);
				}
			}
		}

		this.$.playerSelector.setItems(members);
	},
	playerSelected: function(sender, event) {
		this.$.playerSelector.setSelectedItem(null);
		this.addPlayer(event.item);
	},
	loadCoaches: function() {
		if (this.team) {
			this.$.loadingPopup.setText("Lade Trainer...");
			this.$.loadingPopup.show();
			scoreit.handball.teamcoachrelation.list([["team", this.team.id]], enyo.bind(this, function(sender, response) {
				this.$.loadingPopup.hide();
				this.coachRelations = response.objects;
				this.refreshCoachList();
				this.populateCoachSelector();
			}));
		}
	},
	refreshCoachList: function() {
		this.$.coachList.setCount(this.coachRelations.length);
		this.$.coachList.render();
	},
	setupCoachItem: function(sender, event) {
		var coachRelation = this.coachRelations[event.index];
		this.$.coachName.setContent(coachRelation.coach.display_name);
		this.$.coachItem.addRemoveClass("unconfirmed", !coachRelation.validated);
	},
	newCoach: function() {
		this.$.newCoachForm.clear();
		this.$.newCoachEmail.setValue("");
		this.$.newCoachPopup.show();
	},
	newCoachConfirm: function() {
		this.$.newCoachPopup.hide();
		this.addCoach(this.$.newCoachForm.getData());
	},
	addCoach: function(coach) {
		var data = {
			team: this.team.resource_uri,
			coach: coach.resource_uri || coach
		};
		this.$.loadingPopup.setText("Füge Trainer hinzu...");
		this.$.loadingPopup.show();
		scoreit.handball.teamcoachrelation.create(data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadCoaches();
			this.loadClubMembers();
		}));
	},
	coachRemoveButtonTapped: function(sender, event) {
		var coachRelation = this.coachRelations[event.index];
		// this.$.confirmPopup.setTitle("Mitglied Entfernen");
		this.$.confirmPopup.setMessage("Möchten sie diesen Trainer wirklich entfernen?");
		this.$.confirmPopup.setAction("destructive");
		this.$.confirmPopup.setCallback(enyo.bind(this, function(choice) {
			if (choice) {
				this.removeCoach(coachRelation);
			}
		}));
		this.$.confirmPopup.show();
	},
	removeCoach: function(coachRelation) {
		this.$.loadingPopup.setText("Entferne Trainer...");
		this.$.loadingPopup.show();
		scoreit.handball.teamcoachrelation.remove(coachRelation.id, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadCoaches();
		}));
	},
	confirmCoachRelation: function(sender, event) {
		var coachRelation = this.coachRelations[event.index];
		var data = {
			coach: coachRelation.coach.resource_uri,
			team: coachRelation.team.resource_uri,
			validated: true
		};
		this.$.loadingPopup.setText("Bestätige Trainer...");
		this.$.loadingPopup.show();
		scoreit.handball.teamcoachrelation.update(coachRelation.id, data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadCoaches();
		}));
	},
	populateCoachSelector: function() {
		var members = [];

		if (this.clubMemberships) {
			var coachRelations = this.coachRelations || [];
			for (var i=0; i<this.clubMemberships.length; i++) {
				var isCoach = false;
				for (var j=0; j<coachRelations.length; j++) {
					if (this.clubMemberships[i].member.id == coachRelations[j].coach.id) {
						isCoach = true;
						break;
					}
				}
				if (!isCoach) {
					members.push(this.clubMemberships[i].member);
				}
			}
		}

		this.$.coachSelector.setItems(members);
	},
	coachSelected: function(sender, event) {
		this.$.coachSelector.setSelectedItem(null);
		this.addCoach(event.item);
	},
	loadManagers: function() {
		if (this.team) {
			this.$.loadingPopup.setText("Lade Manager...");
			this.$.loadingPopup.show();
			scoreit.handball.teammanagerrelation.list([["team", this.team.id]], enyo.bind(this, function(sender, response) {
				this.$.loadingPopup.hide();
				this.managerRelations = response.objects;
				this.refreshManagerList();
				this.populateManagerSelector();
			}));
		}
	},
	refreshManagerList: function() {
		this.$.managerList.setCount(this.managerRelations.length);
		this.$.managerList.render();
	},
	setupManagerItem: function(sender, event) {
		var managerRelation = this.managerRelations[event.index];
		this.$.managerName.setContent(managerRelation.manager.display_name);
	},
	managerRemoveButtonTapped: function(sender, event) {
		var managerRelation = this.managerRelations[event.index];
		// this.$.confirmPopup.setTitle("Mitglied Entfernen");
		this.$.confirmPopup.setMessage("Möchten sie diesen Manager wirklich entfernen?");
		this.$.confirmPopup.setAction("destructive");
		this.$.confirmPopup.setCallback(enyo.bind(this, function(choice) {
			if (choice) {
				this.removeManager(managerRelation);
			}
		}));
		this.$.confirmPopup.show();
	},
	removeManager: function(managerRelation) {
		this.$.loadingPopup.setText("Entferne Manager...");
		this.$.loadingPopup.show();
		scoreit.handball.teammanagerrelation.remove(managerRelation.id, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadManagers();
		}));
	},
	populateManagerSelector: function() {
		var members = [];

		if (this.clubMemberships) {
			var managerRelations = this.managerRelations || [];
			for (var i=0; i<this.clubMemberships.length; i++) {
				var isManager = false;
				for (var j=0; j<managerRelations.length; j++) {
					if (this.clubMemberships[i].member.id == managerRelations[j].manager.id) {
						isManager = true;
						break;
					}
				}
				if (!isManager) {
					members.push(this.clubMemberships[i].member);
				}
			}
		}

		this.$.managerSelector.setItems(members);
	},
	managerSelected: function(sender, event) {
		this.$.managerSelector.setSelectedItem(null);
		var data = {
			team: this.team.resource_uri,
			manager: event.item.resource_uri
		};

		this.$.loadingPopup.setText("Füge Manager hinzu...");
		this.$.loadingPopup.show();
		scoreit.handball.teammanagerrelation.create(data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadManagers();
		}));
	},
	clubTapped: function() {
		this.doShowClub({club: this.team.club});
	},
	loadGroups: function() {
		scoreit.handball.groupteamrelation.list([["team", this.team.id]], enyo.bind(this, function(sender, response) {
			this.groups = response.objects;
			this.refreshGroupList();
		}));
	},
	refreshGroupList: function() {
		this.$.groupList.setCount(this.groups.length);
		this.$.groupList.render();
	},
	setupGroupItem: function(sender, event) {
		var groupRelation = this.groups[event.index];
		this.$.groupItem.setContent(groupRelation.group.name);
	},
	groupTapped: function(sender, event) {
		this.doShowGroup({group: this.groups[event.index]});
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "teamName"},
				{kind: "onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "Verein"},
					{kind: "onyx.Item", name: "clubItem", ontap: "clubTapped"}
				]},
				{kind: "CollapsibleGroupbox", caption: "Spielgruppen/Ligen", style: "margin-top: 10px;", components: [
					{kind: "FlyweightRepeater", name: "groupList", onSetupItem: "setupGroupItem", components: [
						{kind: "onyx.Item", name: "groupItem", ontap: "groupTapped"}
					]}
				]},
				{kind: "CollapsibleGroupbox", caption: "Spieler", style: "margin-top: 10px;", components: [
					{kind: "FlyweightRepeater", name: "playerList", onSetupItem: "setupPlayerItem", components: [
						{kind: "onyx.Item", name: "playerItem", components: [
							{name: "playerName", classes: "enyo-inline"},
							{kind: "onyx.Button", content: "Entfernen", classes: "onyx-negative align-right manager-control", ontap: "playerRemoveButtonTapped"},
							{kind: "onyx.Button", content: "Bestätigen", classes: "onyx-affirmative align-right confirm-button member-control", ontap: "confirmPlayerRelation"}
						]}
					]}
				]},
				{kind: "FilteredSelector", name: "playerSelector", displayProperty: "display_name", uniqueProperty: "id", filterProperties: ["display_name"],
					placeholder: "Existierenden Spieler hinzufügen...", classes: "row-button member-control", onItemSelected: "playerSelected"},
				{kind: "onyx.Button", content: "Neuen Spieler Erstellen", ontap: "newPlayer", classes: "row-button member-control"},
				{kind: "onyx.Popup", style: "width: 300px;", floating: true, centered: true, name: "newPlayerPopup", components: [
					{kind: "LightweightPersonForm", name: "newPlayerForm"},
					{kind: "onyx.InputDecorator", showing: false, style: "box-sizing: border-box; width: 100%; margin-bottom: 5px;", classes: "input-fill", components: [
						{kind: "onyx.Input", name: "newPlayerEmail", placeholder: "Email"}
					]},
					{kind: "onyx.Button", content: "Speichern", ontap: "newPlayerConfirm", style: "width: 100%", classes: "onyx-affirmative"}
				]},
				{kind: "CollapsibleGroupbox", caption: "Trainer", style: "margin-top: 10px;", components: [
					{kind: "FlyweightRepeater", name: "coachList", onSetupItem: "setupCoachItem", components: [
						{kind: "onyx.Item", name: "coachItem", components: [
							{name: "coachName", classes: "enyo-inline"},
							{kind: "onyx.Button", content: "Entfernen", classes: "onyx-negative align-right manager-control", ontap: "coachRemoveButtonTapped"},
							{kind: "onyx.Button", content: "Bestätigen", classes: "onyx-affirmative align-right confirm-button manager-control", ontap: "confirmCoachRelation"}
						]}
					]}
				]},
				{kind: "FilteredSelector", name: "coachSelector", displayProperty: "display_name", uniqueProperty: "id", filterProperties: ["display_name"],
					placeholder: "Existierende Person als Trainer hinzufügen...", classes: "manager-control row-button", onItemSelected: "coachSelected"},
				{kind: "onyx.Button", content: "Neuen Trainer Erstellen", ontap: "newCoach", classes: "manager-control row-button"},
				{kind: "onyx.Popup", style: "width: 300px;", floating: true, centered: true, name: "newCoachPopup", components: [
					{kind: "LightweightPersonForm", name: "newCoachForm"},
					{kind: "onyx.InputDecorator", showing: false, style: "box-sizing: border-box; width: 100%; margin-bottom: 5px;", classes: "input-fill", components: [
						{kind: "onyx.Input", name: "newCoachEmail", placeholder: "Email"}
					]},
					{kind: "onyx.Button", content: "Speichern", ontap: "newCoachConfirm", style: "width: 100%", classes: "onyx-affirmative"}
				]},
				{kind: "CollapsibleGroupbox", caption: "Manager", style: "margin-top: 10px;", components: [
					{kind: "FlyweightRepeater", name: "managerList", onSetupItem: "setupManagerItem", components: [
						{kind: "onyx.Item", name: "managerItem", components: [
							{name: "managerName", classes: "enyo-inline"},
							{kind: "onyx.Button", content: "Entfernen", classes: "onyx-negative align-right manager-control", ontap: "managerRemoveButtonTapped"}
						]}
					]}
				]},
				{kind: "FilteredSelector", name: "managerSelector", displayProperty: "display_name", uniqueProperty: "id", filterProperties: ["display_name"],
					placeholder: "Manager hinzufügen...", classes: "manager-control row-button", onItemSelected: "managerSelected"},
				{style: "height: 200px;"}
			]}
		]},
		{kind: "LoadingPopup"},
		{kind: "ConfirmPopup"}
	]
});