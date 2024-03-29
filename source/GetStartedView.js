/**
    View that is shown the first time a user signs in. Leads him through filling out some profile info and selecting a club and team
*/
enyo.kind({
    name: "GetStartedView",
    classes: "bg-light",
    style: "text-align: center;",
    published: {
        user: null
    },
    events: {
        //* Gets fired when the user has completed all steps
        onDone: ""
    },
    create: function() {
        this.inherited(arguments);
        this.selectedTeams = {};
    },
    userChanged: function() {
        this.checkCompletionStatus();
    },
    /**
        Check if the user has completed all steps
    */
    checkCompletionStatus: function() {
        if (!this.user.handball_profile) {
            this.openProfilesSelection();
        } else {
            if (!this.user.handball_profile.clubs.length) {
                this.openClubSelection();
            } else {
                this.checkForTeams();
            }
        }
    },
    /**
        Check if the user has selected a team yet
    */
    checkForTeams: function() {
        this.$.loadingPopup.setText("Lade Mannschaften...");
        this.$.loadingPopup.show();
        scoreit.handball.teamplayerrelation.list([["player", this.user.handball_profile.id]], enyo.bind(this, function(sender, response) {
            if (response.objects.length) {
                this.$.loadingPopup.hide();
                this.openDoneView();
            } else {
                this.openTeamSelection();
            }
        }));
    },
    openProfilesSelection: function() {
        this.loadProfiles();
        this.$.panels.setIndex(0);
    },
    openProfileEditor: function(profile) {
        this.$.profileForm.setUser(this.user);
        this.$.profileForm.setProfile(profile);
        this.$.panels.setIndex(1);
    },
    openClubSelection: function() {
        this.loadClubs();
        this.$.panels.setIndex(2);
    },
    openTeamSelection: function() {
        this.loadTeams();
        this.$.panels.setIndex(3);
    },
    openDoneView: function() {
        this.$.panels.setIndex(4);
    },
    back: function() {
        var index = this.$.panels.getIndex() ? 0 : this.$.panels.getIndex() - 1;
        this.$.panels.setIndex(index);
    },
    loadProfiles: function() {
        this.$.loadingPopup.setText("Profile werden geladen...");
        this.$.loadingPopup.show();
        scoreit.handball.person.list([
            ["first_name", this.user.first_name],
            ["last_name", this.user.last_name],
            ["user__isnull", true]
        ], enyo.bind(this, function(sender, response) {
            this.profiles = response.objects;
            this.$.profileList.setCount(this.profiles.length);
            this.$.profileList.render();
            this.$.loadingPopup.hide();

            if (!this.profiles.length) {
                this.openProfileEditor(null);
            }
            this.$.profileBackButton.setShowing(this.profiles.length);
        }));
    },
    setupProfileItem: function(sender, event) {
        var profile = this.profiles[event.index];
        this.$.fullName.setContent(profile.first_name + " " + profile.last_name);
        if (profile.clubs && profile.clubs.length) {
            this.$.club.setContent(profile.clubs[0].name);
        } else {
            this.$.club.setContent("");
        }
        this.$.profileItem.addRemoveClass("selected", this.selectedProfile && this.selectedProfile.id == profile.id);
    },
    profileTapped: function(sender, event) {
        this.selectProfile(this.profiles[event.index]);
    },
    selectProfile: function(profile) {
        this.selectedProfile = profile;
        this.$.profileList.render();
    },
    newProfile: function() {
        this.openProfileEditor(null);
    },
    confirmProfile: function(sender, event) {
        this.openProfileEditor(this.selectedProfile);
    },
    saveProfile: function() {
        var data = this.$.profileForm.getData();
        data.user = this.user.resource_uri;

        var callback = enyo.bind(this, function(sender, response) {
            this.user.handball_profile = response;
            this.$.loadingPopup.hide();
            this.checkCompletionStatus();
        });

        if (data.id) {
            this.$.loadingPopup.setText("Speichere Profil...");
            // Profile already exists. Update it.
            scoreit.handball.person.put(data.id, data, callback);
        } else {
            this.$.loadingPopup.setText("Erstelle Profil...");
            scoreit.handball.person.create(data, callback);
        }
    },
    loadClubs: function() {
        this.$.loadingPopup.setText("Lade Vereine...");
        this.$.loadingPopup.show();
        scoreit.handball.club.list([], enyo.bind(this, function(sender, response) {
            this.$.clubList.setItems(response.objects);
            this.$.loadingPopup.hide();
        }));
    },
    setupClubItem: function(sender, event) {
        this.$.clubItem.setContent(event.item.name);
        if (this.selectedClub) {
            var keyProp = this.selectedClub.id ? "id" : "name";
            this.$.clubItem.addRemoveClass("selected", this.selectedClub[keyProp] == event.item[keyProp]);
        }
    },
    clubTapped: function(sender, event) {
        var club = this.$.clubList.getFilteredItems()[event.index];
        this.selectClub(club);
    },
    selectClub: function(club) {
        this.selectedClub = club;
        this.$.clubList.render();
        this.$.saveClubButton.setDisabled(false);
    },
    newClub: function() {
        this.$.clubForm.setClub(null);
        this.$.clubPopup.show();
    },
    newClubConfirm: function() {
        this.$.clubPopup.hide();
        var club = this.$.clubForm.getData();
        this.$.clubList.items.push(club);
        this.$.clubList.itemsChanged();
        this.selectClub(club);
    },
    saveClub: function() {
        this.$.loadingPopup.setText("Speichere Verein...");
        scoreit.handball.clubmemberrelation.create({
            club: this.selectedClub.resource_uri || this.selectedClub,
            member: this.user.handball_profile.resource_uri
        }, enyo.bind(this, function(sender, response) {
            this.user.handball_profile = response.member;
            this.$.loadingPopup.hide();
            this.checkCompletionStatus();
        }));
    },
    loadTeams: function() {
        this.$.loadingPopup.setText("Lade Mannschaften...");
        scoreit.handball.team.list([["club", this.user.handball_profile.clubs[0].id]], enyo.bind(this, function(sender, response) {
            this.teams = response.objects;
            this.$.teamList.setCount(this.teams.length);
            this.$.teamList.render();
            this.$.loadingPopup.hide();
        }));
    },
    setupTeamItem: function(sender, event) {
        var team = this.teams[event.index];
        var keyProp = team.id || team.name;
        this.$.teamItem.setContent(team.display_name);
        this.$.teamItem.addRemoveClass("selected", this.selectedTeams[keyProp]);
    },
    teamTapped: function(sender, event) {
        var team = this.teams[event.index];
        this.toggleTeam(team);
    },
    toggleTeam: function(team) {
        this.numberSelectedTeams = this.numberSelectedTeams || 0;
        var keyProp = team.id || team.name;
        if (!this.selectedTeams[keyProp]) {
            this.selectedTeams[keyProp] = team;
        } else {
            delete this.selectedTeams[keyProp];
        }
        this.$.teamList.render();
    },
    newTeam: function() {
        this.$.teamForm.setTeam({name: "", club: this.user.handball_profile.clubs[0]});
        this.$.teamForm.setClubs(this.user.handball_profile.clubs);
        this.$.teamPopup.show();
    },
    newTeamConfirm: function() {
        this.$.teamPopup.hide();
        var team = this.$.teamForm.getData();
        team.display_name = team.club.name + " " + team.name;
        this.teams.push(team);
        this.$.teamList.setCount(this.teams.length);
        this.toggleTeam(team);
    },
    saveTeams: function() {
        var relations = [];

        for (var x in this.selectedTeams) {
            var team = this.selectedTeams[x];
            delete team.display_name;
            relations.push({
                team: team.resource_uri || team,
                player: this.user.handball_profile.resource_uri
            });
        }

        this.$.loadingPopup.setText("Speichere Mannschaften...");
        scoreit.handball.teamplayerrelation.bulk(relations, null, enyo.bind(this, function(sender, response) {
            this.$.loadingPopup.hide();
            this.checkCompletionStatus();
        }));
    },
    components: [
        {kind: "Panels", draggable: false, arrangerKind: "CarouselArranger", classes: "enyo-fill", components: [
            {kind: "Scroller", classes: "enyo-fill", components: [
                {classes: "centered-content", components: [
                    {content: "Willkommen bei score.it! Als erstes solltest du ein Spielerprofil erstellen. Bist du einer der folgenden Spieler?", classes: "getstartedview-info"},
                    {kind: "Scroller", style: "max-height: 500px; margin: 10px 0;", components: [
                        {kind: "FlyweightRepeater", name: "profileList", onSetupItem: "setupProfileItem", components: [
                            {kind: "onyx.Item", tapHighlight: true, ontap: "profileTapped", name: "profileItem", components: [
                                {name: "fullName"},
                                {name: "club", style: "font-size: 15pt;"}
                            ]}
                        ]}
                    ]},
                    {kind: "onyx.Button", style: "width: 100%;", classes: "row-button", content: "Neues Profil Erstellen", ontap: "newProfile"},
                    // {kind: "onyx.Button", content: "Zurück", ontap: "back", style: "float: left;"},
                    {kind: "onyx.Button", content: "Weiter", ontap: "confirmProfile", style: "float: right; margin-top: 5px;", classes: "onyx-affirmative"}
                ]}
            ]},
            {kind: "Scroller", classes: "enyo-fill", components: [
                {classes: "centered-content", components: [
                    {content: "Bearbeite dein Profil und klicke auf \"weiter\", wenn du fertig bist!", classes: "getstartedview-info"},
                    {kind: "ProfileForm", style: "width: 100%;"},
                    {kind: "onyx.Button", content: "Zurück", ontap: "back", name: "profileBackButton", style: "float: left;"},
                    {kind: "onyx.Button", content: "Weiter", ontap: "saveProfile", style: "float: right; margin-top: 5px;", classes: "onyx-affirmative"}
                ]}
            ]},
            {kind: "Scroller", classes: "enyo-fill", components: [
                {classes: "centered-content", components: [
                    {content: "Zeit einen Verein auszuwählen! Wenn dein Verein noch nicht existiert, kannst du ihn natürlich anlegen.", classes: "getstartedview-info"},
                    {kind: "Scroller", style: "max-height: 500px; margin: 10px 0;", components: [
                        {kind: "FilteredList", name: "clubList", onSetupItem: "setupClubItem", filterProperties: ["name"], components: [
                            {kind: "onyx.Item", tapHighlight: true, name: "clubItem", ontap: "clubTapped"}
                        ]}
                    ]},
                    {kind: "onyx.Button", content: "Verein Anlegen", ontap: "newClub", classes: "row-button"},
                    // {kind: "onyx.Button", content: "Zurück", ontap: "back", style: "float: left;"},
                    {kind: "onyx.Button", content: "Weiter", ontap: "saveClub", name: "saveClubButton", disabled: true, style: "float: right; margin-top: 5px;", classes: "onyx-affirmative"},
                    {kind: "onyx.Popup", centered: true, floating: true, name: "clubPopup", components: [
                        {kind: "ClubForm", name: "clubForm"},
                        //{kind: "onyx.Button", content: "Schließen", ontap: "clubPopupClose", style: "width: 48%; margin: 1%;"},
                        {kind: "onyx.Button", content: "Speichern", ontap: "newClubConfirm", style: "width: 100%;", classes: "onyx-affirmative"}
                    ]}
                ]}
            ]},
            {kind: "Scroller", classes: "enyo-fill", components: [
                {classes: "centered-content", components: [
                    {content: "In welchen Mannschaften spielst du? Wähle deine Mannschaften aus oder erstelle sie, wenn sie noch nicht existieren!", classes: "getstartedview-info"},
                    {kind: "Scroller", style: "max-height: 500px; margin: 10px 0;", components: [
                        {kind: "FlyweightRepeater", name: "teamList", onSetupItem: "setupTeamItem", components: [
                            {kind: "onyx.Item", tapHighlight: true, name: "teamItem", ontap: "teamTapped"}
                        ]}
                    ]},
                    {kind: "onyx.Button", content: "Mannschaft Anlegen", ontap: "newTeam", classes: "row-button"},
                    // {kind: "onyx.Button", content: "Zurück", ontap: "back", style: "float: left;"},
                    {kind: "onyx.Button", content: "Weiter", ontap: "saveTeams", name: "saveTeamsButton", style: "float: right; margin-top: 5px;", classes: "onyx-affirmative"},
                    {kind: "onyx.Popup", centered: true, floating: true, name: "teamPopup", components: [
                        {kind: "TeamForm", name: "teamForm", style: "width: 300px;"},
                        //{kind: "onyx.Button", content: "Schließen", ontap: "clubPopupClose", style: "width: 48%; margin: 1%;"},
                        {kind: "onyx.Button", content: "Speichern", ontap: "newTeamConfirm", style: "width: 100%;", classes: "onyx-affirmative"}
                    ]}
                ]}
            ]},
            {classes: "enyo-fill", components: [
                {classes: "centered-content", components: [
                    {content: "Fertig! Jetzt kannst du loslegen und alle Funktionen von score.it nutzen!", classes: "getstartedview-info"},
                    {kind: "onyx.Button", content: "Weiter", ontap: "doDone", classes: "row-button onyx-affirmative"}
                ]}
            ]}
        ]},
        {kind: "LoadingPopup"}
    ]
});