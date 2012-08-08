enyo.kind({
	name: "TeamView",
	classes: "teamview",
	published: {
		team: null
	},
	rendered: function() {
		this.inherited(arguments);
		this.teamChanged();
	},
	teamChanged: function() {
		if (this.team) {
			this.$.teamName.setContent(this.team.name);
			this.loadPlayers();
			// this.loadCoaches();
			this.loadManagers();
			this.loadClubMembers();
		} else {
			this.$.teamName.setContent("");
			this.playerRelations = [];
			this.refreshPlayerList();
			this.coachRelations = [];
			// this.refreshCoachList();
			this.managerRelations = [];
			this.refreshManagerList();
			this.clubMemberships = [];
			this.populatePlayerSelector();
			this.populateManagerSelector();
		}
	},
	loadClubMembers: function() {
		if (this.team && this.team.club) {
			// this.$.loadingPopup.setText("Lade Mitglieder...");
			// this.$.loadingPopup.show();
			scoreit.handball.clubmemberrelation.list([["club", this.team.club.id]], enyo.bind(this, function(sender, response) {
				// this.$.loadingPopup.hide();
				this.populatePlayerSelector(response.objects);
				this.populateManagerSelector(response.objects);
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
		this.$.playerItem.addRemoveClass("unconfirmed", !playerRelation.manager_confirmed);
	},
	newPlayer: function() {
		this.$.newPlayerForm.setPerson(null);
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
			this.loadMembers();
		}));
	},
	confirmPlayerRelation: function(sender, event) {
		var playerRelation = this.playerRelations[event.index];
		var data = {
			player: playerRelation.player.resource_uri,
			team: playerRelation.team.resource_uri
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
		for (var i=0; i<this.clubMemberships.length; i++) {
			var isPlayer = false;
			for (var j=0; j<this.playerRelations.length; j++) {
				if (this.clubMemberships[i].member.id == this.playerRelations[j].player.id) {
					isPlayer = true;
					break;
				}
			}
			if (!isPlayer) {
				members.push(this.clubMemberships[i].member);
			}
		}

		this.$.playerSelector.setItems(members);
	},
	playerSelected: function(sender, event) {
		this.playerSelector.setSelectedItem(null);
		this.addPlayer(event.item);
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
		for (var i=0; i<this.clubMemberships.length; i++) {
			var isManager = false;
			for (var j=0; j<this.managerRelations.length; j++) {
				if (this.clubMemberships[i].member.id == this.managerRelations[j].manager.id) {
					isManager = true;
					break;
				}
			}
			if (!isManager) {
				members.push(this.clubMemberships[i].member);
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
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "page-header", name: "teamName"},
			{classes: "section-header", content: "Spieler"},
			{kind: "FlyweightRepeater", name: "playerList", onSetupItem: "setupPlayerItem", components: [
				{kind: "onyx.Item", name: "playerItem", components: [
					{name: "playerName", classes: "enyo-inline"},
					{kind: "onyx.Button", content: "Entfernen", classes: "onyx-negative align-right manager-control", ontap: "playerRemoveButtonTapped"},
					{kind: "onyx.Button", content: "Bestätigen", classes: "onyx-affirmative align-right confirm-button manager-control", ontap: "confirmPlayerRelation"}
				]}
			]},
			{kind: "FilteredSelector", name: "playerSelector", displayProperty: "display_name", uniqueProperty: "id", filterProperties: ["display_name"],
				placeholder: "Existierenden Spieler hinzufügen...", style: "width: 100%;", onItemSelected: "playerSelected"},
			{kind: "onyx.Button", content: "Neuen Spieler Erstellen", ontap: "newPlayer", style: "width: 100%;", classes: "manager-control"},
			{kind: "onyx.Popup", style: "width: 300px;", floating: true, centered: true, name: "newPlayerPopup", components: [
				{kind: "LightweightPersonForm", name: "newPlayerForm"},
				{kind: "onyx.InputDecorator", showing: false, style: "box-sizing: border-box; width: 100%; margin-bottom: 5px;", classes: "input-fill", components: [
					{kind: "onyx.Input", name: "newPlayerEmail", placeholder: "Email"}
				]},
				{kind: "onyx.Button", content: "Speichern", ontap: "newPlayerConfirm", style: "width: 100%", classes: "onyx-affirmative"}
			]},
			{classes: "section-header", content: "Manager"},
			{kind: "FlyweightRepeater", name: "managerList", onSetupItem: "setupManagerItem", components: [
				{kind: "onyx.Item", name: "managerItem", components: [
					{name: "managerName", classes: "enyo-inline"},
					{kind: "onyx.Button", content: "Entfernen", classes: "onyx-negative align-right manager-control", ontap: "managerRemoveButtonTapped"}
				]}
			]},
			{kind: "FilteredSelector", name: "managerSelector", displayProperty: "display_name", uniqueProperty: "id", filterProperties: ["display_name"],
				placeholder: "Manager hinzufügen...", style: "width: 100%;", onItemSelected: "managerSelected"},
			{style: "height: 200px;"}
		]},
		{kind: "LoadingPopup"},
		{kind: "ConfirmPopup"}
	]
});