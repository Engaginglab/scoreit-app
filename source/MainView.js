enyo.kind({
	name: "MainView",
	refresh: function() {
		this.loadClubs();
	},
	loadClubs: function() {
		this.clubMemberships = null;
		this.clubsManaged = null;

		scoreit.handball.club.list([["managers", scoreit.user.handball_profile.id]], enyo.bind(this, function(sender, response) {
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
		this.$.clubList.setCount(this.clubs.length);
		this.$.clubList.render();
	},
	assembleClubArray: function() {
		this.clubs = [];

		for (var i=0; i<this.clubsManaged.length; i++) {
			this.clubsManaged[i].isManager = true;
			this.clubs.push(this.clubsManaged[i]);
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
			this.log(response);
			this.loadClubs();
		}));
	},
	clubSelected: function(sender, event) {
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
	components: [
		{classes: "scoreit-separator", content: "Meine Vereine"},
		{kind: "FlyweightRepeater", name: "clubList", onSetupItem: "setupClubItem", components: [
			{kind: "onyx.Item", name: "clubItem"}
		]},
		{kind: "FilteredSelector", name: "clubSelector", displayProperty: "name", uniqueProperty: "id", filterProperties: ["name"],
			placeholder: "Verein beitreten...", style: "width: 100%;", onItemSelected: "clubSelected"},
		{kind: "onyx.Button", content: "Neuen Verein Gründen", ontap: "newClub", style: "width: 100%;"},
		{kind: "onyx.Popup", name: "newClubPopup", floating: true, centered: true, components: [
			{kind: "ClubForm", name: "newClubForm"},
			{kind: "onyx.Button", content: "Speichern", ontap: "newClubConfirm", classes: "onyx-affirmative", style: "width: 100%;"}
		]}
	]
});