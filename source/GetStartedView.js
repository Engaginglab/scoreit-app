enyo.kind({
    name: "GetStartedView",
    kind: "Panels",
    arrangerKind: "LeftRightArranger",
    style: "text-align: center;",
    published: {
        user: null
    },
    events: {
        onDone: ""
    },
    userChanged: function() {
        this.checkCompletionStatus();
    },
    checkCompletionStatus: function() {
        this.log(this.user);
        if (!this.user.handball_profile) {
            this.openProfilesSelection();
        } else {
            this.profile = this.user.handball_profile;
            if (!this.profile.clubs.length) {
                this.openClubSelection();
            }
            else alert("all done!");
        }
    },
    openProfilesSelection: function() {
        this.loadProfiles();
        this.setIndex(0);
    },
    openProfileEditor: function(profile) {
        this.$.profileForm.setUser(this.user);
        this.$.profileForm.setProfile(profile);
        this.setIndex(1);
    },
    openClubSelection: function() {
        this.loadClubs();
        this.setIndex(2);
    },
    openTeamSelection: function() {

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
        }));
    },
    setupItem: function(sender, event) {
        var profile = this.profiles[event.index];
        this.$.fullName.setContent(profile.first_name + " " + profile.last_name);
        if (profile.clubs && profile.clubs.length) {
            this.$.club.setContent(profile.clubs[0].name);
        } else {
            this.$.club.setContent("");
        }
    },
    selectProfile: function(sender, event) {
        this.openProfileEditor(this.profiles[event.index]);
    },
    newProfile: function() {
        this.openProfileEditor(null);
    },
    back: function() {
        var index = this.getIndex() ? 0 : this.getIndex() - 1;
        this.setIndex(index);
    },
    saveProfile: function() {
        var data = this.$.profileForm.getData();
        data.user = this.user.resource_uri;

        var callback = enyo.bind(this, function(sender, response) {
            this.profile = response;
            this.$.loadingPopup.hide();
            this.checkCompletionStatus();
            this.log(response);
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
    },
    selectClub: function(sender, event) {
        var club = this.$.clubList.getFilteredItems()[event.index];
        scoreit.handball.clubmemberrelation.create({club: club.resource_uri, member: this.profile.resource_uri, member_confirmed: true}, enyo.bind(this, function() {
            this.log(response);
            this.profile = response.member;
            this.checkCompletionStatus();
        }));
    },
    newClub: function() {
        this.$.clubPopup.show();
    },
    newClubSave: function() {
        this.$.clubPopup.hide();
    },
    components: [
        {classes: "getstartedview-slide", components: [
            {content: "Willkommen bei Score.it! Als erstes solltest du ein Spielerprofil erstellen. Bist du einer der folgenden Spieler?", classes: "getstartedview-info"},
            {kind: "Scroller", style: "max-height: 500px; margin: 10px 0;", components: [
                {kind: "onyx.Groupbox", components: [
                {kind: "FlyweightRepeater", name: "profileList", onSetupItem: "setupItem", components: [
                    {kind: "onyx.Item", tapHighlight: true, ontap: "selectProfile", name: "profileItem", components: [
                        {name: "fullName"},
                        {name: "club", style: "font-size: 15pt;"}
                    ]}
                ]}
                ]}
            ]},
            {kind: "onyx.Button", style: "width: 100%;", classes: "onyx-affirmative", content: "Neues Profil Erstellen", ontap: "newProfile"}
        ]},
        {classes: "getstartedview-slide", components: [
            {content: "Bearbeite dein Profil und klicke auf \"weiter\", wenn du fertig bist!", classes: "getstartedview-info"},
            {kind: "ProfileForm", style: "width: 100%;"},
            {kind: "onyx.Button", content: "Zurück", ontap: "back", style: "float: left;"},
            {kind: "onyx.Button", content: "Weiter", ontap: "saveProfile", style: "float: right;", classes: "onyx-affirmative"}
        ]},
        {classes: "getstartedview-slide", components: [
            {content: "Zeit einen Verein auszuwählen! Wenn dein Verein noch nicht existiert, kannst du ihn natürlich anlegen.", classes: "getstartedview-info"},
            {kind: "FilteredList", name: "clubList", onSetupItem: "setupClubItem", filterProperties: ["name"], components: [
                {kind: "onyx.Item", tapHighlight: true, name: "clubItem", ontap: "selectClub"}
            ]},
            {kind: "onyx.Button", content: "Verein Anlegen", ontap: "newUnion", style: "width: 100%;", classes: "onyx-affirmative"},
            {kind: "onyx.Popup", name: "clubPopup", components: [
                {kind: "ClubForm", name: "newClubForm"},
                //{kind: "onyx.Button", content: "Schließen", ontap: "clubPopupClose", style: "width: 48%; margin: 1%;"},
                {kind: "onyx.Button", content: "Speichern", ontap: "newClubSave", style: "width: 100%;", classes: "onyx-affirmative"}
            ]}
        ]},
        {classes: "getstartedview-slide", components: [
            {content: "Fertig! Jetzt kannst du loslegen und alle funktionen von Score.it nutzen!", classes: "getstartedview-info"},
            {kind: "onyx.Button", content: "Weiter", ontap: "doDone", style: "width: 100%", classes: "onyx-affirmative"}
        ]},
        // {classes: "getstartedview-slide", components: [
        //  {content: "In welchen Mannschaften spielst du?", classes: "getstartedview-info"},
        //  {kind: "onyx.Button", content: "Zurück", ontap: "back", style: "float: left;"},
        //  {kind: "onyx.Button", content: "Weiter", ontap: "saveProfile", style: "float: right;", classes: "onyx-affirmative"}
        // ]},
        {kind: "LoadingPopup"}
    ]
});