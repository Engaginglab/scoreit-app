enyo.kind({
	name: "ClubView",
	classes: "clubview",
	published: {
		club: null
	},
	events: {
		onShowTeam: ""
	},
	rendered: function() {
		this.inherited(arguments);
		this.clubChanged();
	},
	clubChanged: function() {
		if (this.club) {
			this.$.clubName.setContent(this.club.name);
			this.loadMembers();
			this.loadTeams();
			this.loadManagers();
		} else {
			this.$.clubName.setContent("");
			this.memberships = [];
			this.refreshMemberList();
			this.teams = [];
			this.refreshTeamList();
			this.managerRelations = [];
			this.refreshManagerList();
		}
	},
	loadMembers: function() {
		if (this.club) {
			this.$.loadingPopup.setText("Lade Mitglieder...");
			this.$.loadingPopup.show();
			scoreit.handball.clubmemberrelation.list([["club", this.club.id]], enyo.bind(this, function(sender, response) {
				this.$.loadingPopup.hide();
				this.memberships = response.objects;
				this.refreshMemberList();
				this.populateManagerSelector();
			}));
		}
	},
	refreshMemberList: function() {
		this.$.memberList.setCount(this.memberships.length);
		this.$.memberList.render();
	},
	setupMemberItem: function(sender, event) {
		var membership = this.memberships[event.index];
		this.$.memberName.setContent(membership.member.display_name);
		this.$.memberItem.addRemoveClass("unconfirmed", !membership.manager_confirmed);
	},
	newMember: function() {
		this.$.newMemberForm.clear();
		this.$.newMemberEmail.setValue("");
		this.$.newMemberPopup.show();
	},
	newMemberConfirm: function() {
		this.$.newMemberPopup.hide();
		this.addMember(this.$.newMemberForm.getData(), enyo.bind(this, function(membership) {
			if (this.$.newMemberEmail.getValue()) {
				scoreit.handball.sendInvite({email: this.$.newMemberEmail.getValue()}, enyo.bind(this, function(sender, response) {
					this.log(response);
				}));
			}
		}));
	},
	addMember: function(member, callback) {
		var data = {
			club: this.club.resource_uri,
			member: member.resource_uri || member
		};
		this.$.loadingPopup.setText("Füge Mitglied hinzu...");
		this.$.loadingPopup.show();
		scoreit.handball.clubmemberrelation.create(data, enyo.bind(this, function(sender, response) {
			this.loadMembers();
			this.$.loadingPopup.hide();
			if (callback) {
				callback(response);
			}
		}));
	},
	showEmailTooltip: function(sender, event) {
		this.$.emailTooltip.show();
	},
	hideEmailTooltip: function(sender, event) {
		this.$.emailTooltip.hide();
	},
	memberRemoveButtonTapped: function(sender, event) {
		var membership = this.memberships[event.index];
		// this.$.confirmPopup.setTitle("Mitglied Entfernen");
		this.$.confirmPopup.setMessage("Möchten sie dieses Mitglied wirklich entfernen?");
		this.$.confirmPopup.setAction("destructive");
		this.$.confirmPopup.setCallback(enyo.bind(this, function(choice) {
			if (choice) {
				this.removeMember(membership);
			}
		}));
		this.$.confirmPopup.show();
	},
	removeMember: function(membership) {
		this.$.loadingPopup.setText("Entferne Mitglied...");
		this.$.loadingPopup.show();
		scoreit.handball.clubmemberrelation.remove(membership.id, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadMembers();
		}));
	},
	confirmMembership: function(sender, event) {
		var membership = this.memberships[event.index];
		var data = {
			member: membership.member.resource_uri,
			club: membership.club.resource_uri,
			manager_confirmed: true
		};
		this.$.loadingPopup.setText("Bestätige Mitgliedschaft...");
		this.$.loadingPopup.show();
		scoreit.handball.clubmemberrelation.update(membership.id, data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadMembers();
		}));
	},
	loadTeams: function() {
		if (this.club) {
			this.$.loadingPopup.setText("Lade Mannschaften...");
			this.$.loadingPopup.show();
			scoreit.handball.team.list([["club", this.club.id]], enyo.bind(this, function(sender, response) {
				this.$.loadingPopup.hide();
				this.teams = response.objects;
				this.refreshTeamList();
			}));
		}
	},
	refreshTeamList: function() {
		this.$.teamList.setCount(this.teams.length);
		this.$.teamList.render();
	},
	setupTeamItem: function(sender, event) {
		var team = this.teams[event.index];
		this.$.teamName.setContent(team.name);
	},
	newTeam: function() {
		this.$.newTeamForm.setClubs([this.club]);
		this.$.newTeamForm.setTeam({name: "", club: this.club});
		this.$.newTeamPopup.show();
	},
	newTeamConfirm: function() {
		this.$.newTeamPopup.hide();
		this.addTeam(this.$.newTeamForm.getData());
	},
	addTeam: function(team) {
		this.$.loadingPopup.setText("Erstelle Mannschaft...");
		this.$.loadingPopup.show();
		scoreit.handball.team.create(team, enyo.bind(this, function(sender, response) {
			this.loadTeams();
			this.$.loadingPopup.hide();
		}));
	},
	teamTapped: function(sender, event) {
		this.doShowTeam({team: this.teams[event.index]});
	},
	loadManagers: function() {
		if (this.club) {
			this.$.loadingPopup.setText("Lade Manager...");
			this.$.loadingPopup.show();
			scoreit.handball.clubmanagerrelation.list([["club", this.club.id]], enyo.bind(this, function(sender, response) {
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
		scoreit.handball.clubmanagerrelation.remove(managerRelation.id, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadManagers();
		}));
	},
	populateManagerSelector: function() {
		var members = [];
		for (var i=0; i<this.memberships.length; i++) {
			var isManager = false;
			for (var j=0; j<this.managerRelations.length; j++) {
				if (this.memberships[i].member.id == this.managerRelations[j].manager.id) {
					isManager = true;
					break;
				}
			}
			if (!isManager) {
				members.push(this.memberships[i].member);
			}
		}

		this.$.managerSelector.setItems(members);
	},
	managerSelected: function(sender, event) {
		this.$.managerSelector.setSelectedItem(null);
		var data = {
			club: this.club.resource_uri,
			manager: event.item.resource_uri
		};

		this.$.loadingPopup.setText("Füge Manager hinzu...");
		this.$.loadingPopup.show();
		scoreit.handball.clubmanagerrelation.create(data, enyo.bind(this, function(sender, response) {
			this.$.loadingPopup.hide();
			this.loadManagers();
		}));
	},
	components: [
		{kind: "Scroller", classes: "enyo-fill", components: [
			{classes: "main-content", components: [
				{classes: "page-header", name: "clubName"},
				{classes: "section-header", content: "Mitglieder"},
				{kind: "FlyweightRepeater", name: "memberList", onSetupItem: "setupMemberItem", components: [
					{kind: "onyx.Item", name: "memberItem", components: [
						{name: "memberName", classes: "enyo-inline"},
						{kind: "onyx.Button", content: "Entfernen", classes: "onyx-negative align-right manager-control", ontap: "memberRemoveButtonTapped"},
						{kind: "onyx.Button", content: "Bestätigen", classes: "onyx-affirmative align-right confirm-button manager-control", ontap: "confirmMembership"}
					]}
				]},
				{kind: "onyx.Button", content: "Neues Mitglied Hinzufügen", ontap: "newMember", classes: "row-button"},
				{kind: "onyx.Popup", style: "width: 300px;", floating: true, centered: true, name: "newMemberPopup", components: [
					{kind: "LightweightPersonForm", name: "newMemberForm"},
					{kind: "onyx.TooltipDecorator", components: [
						{kind: "onyx.InputDecorator", showing: false, style: "box-sizing: border-box; width: 100%; margin-bottom: 5px;", classes: "input-fill", components: [
							{kind: "onyx.Input", name: "newMemberEmail", placeholder: "Email"}
						]},
						{kind: "onyx.Tooltip", autoDismiss: false, name: "emailTooltip", content: "Fülle dieses Feld aus, um der betreffenden Person eine Einladung zu schicken!"}
					]},
					{kind: "onyx.Button", content: "Speichern", ontap: "newMemberConfirm", style: "width: 100%", classes: "onyx-affirmative"}
				]},
				{classes: "section-header", content: "Mannschaften"},
				{kind: "FlyweightRepeater", name: "teamList", onSetupItem: "setupTeamItem", components: [
					{kind: "onyx.Item", name: "teamItem", ontap: "teamTapped", components: [
						{name: "teamName", classes: "enyo-inline"}
					]}
				]},
				{kind: "onyx.Button", content: "Neue Mannschaft Gründen", ontap: "newTeam", classes: "row-button"},
				{kind: "onyx.Popup", name: "newTeamPopup", floating: true, centered: true, components: [
					{kind: "TeamForm", name: "newTeamForm", style: "width: 300px;"},
					{kind: "onyx.Button", content: "Speichern", ontap: "newTeamConfirm", classes: "onyx-affirmative", style: "width: 100%;"}
				]},
				{classes: "section-header", content: "Manager"},
				{kind: "FlyweightRepeater", name: "managerList", onSetupItem: "setupManagerItem", components: [
					{kind: "onyx.Item", name: "managerItem", components: [
						{name: "managerName", classes: "enyo-inline"},
						{kind: "onyx.Button", content: "Entfernen", classes: "onyx-negative align-right manager-control", ontap: "managerRemoveButtonTapped"}
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