/**
    Root component and entry point of the app
*/
enyo.kind({
    name: "App",
    kind: "FittableRows",
    fit: true,
    classes: "scoreit-app",
    views: {
        "frontMatter": 0,
        "getStartedView": 1,
        "mainView": 2
    },
    handlers: {
        ontap: "tapHandler"
    },
    create: function() {
        this.inherited(arguments);
        this.loadUser();
    },
    showView: function(view) {
        this.$.panels.setIndex(this.views[view]);
        this.resized();
    },
    showMainView: function() {
        this.$.mainView.refresh();
        this.showView("mainView");
    },
    showReportView: function() {
        this.showView("reportView");
    },
    /**
        Load current users data
    */
    loadUser: function() {
        var user = this.fetchUser();
        if (user) {
            this.$.loadingPopup.setText("Lade Daten für Benutzer " + user.username + "...");
            this.$.loadingPopup.show();
            scoreit.auth.user.detail(user.id, enyo.bind(this, function(sender, response) {
                scoreit.user = response;
                this.saveUser();
                this.$.loadingPopup.hide();
                this.userChanged();
            }));
        } else {
            scoreit.user = null;
            this.userChanged();
        }
    },
    /**
        Fetch user data from local storage
    */
    fetchUser: function() {
        var user = null;
        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch(e) {
        }
        return user;
    },
    /**
        Save user data to local storage
    */
    saveUser: function() {
        localStorage.setItem("user", JSON.stringify(scoreit.user));
    },
    /**
        Delete user from local storage
    */
    deleteUser: function() {
        localStorage.removeItem("user");
    },
    userChanged: function() {
        this.$.topBar.setUser(scoreit.user);
        this.$.mainView.setUser(scoreit.user);

        if (scoreit.user) {
            this.$.getStartedView.setUser(scoreit.user);

            if (scoreit.user.handball_profile && scoreit.user.handball_profile.clubs.length) {
                this.showMainView();
            } else {
                this.showView("getStartedView");
            }
        } else {
            this.showView("frontMatter");
        }
    },
    signUpHandler: function(sender, event) {
        this.$.loadingPopup.setText("Erstelle Account...");
        this.$.loadingPopup.show();
        scoreit.signUp(event.data, enyo.bind(this, function(sender, response) {
            this.$.loadingPopup.hide();
            this.$.alertPopup.setMessage("Dir wurde soeben eine Email and die Adresse " + event.data.email + " geschickt. Klicke auf den Link in der Email, um deinen Account zu aktiveren!");
            this.$.alertPopup.show();
        }));
    },
    hideSignedUpPopup: function() {
        this.$.signedUpPopup.hide();
    },
    loginHandler: function(sender, event) {
        scoreit.login(event.username, event.password, enyo.bind(this, function(success) {
            this.saveUser();
            this.userChanged();
        }));
    },
    logoutHandler: function() {
        scoreit.user = null;
        this.deleteUser();
        this.userChanged();
    },
    tapHandler: function(sender, event) {
        if (!event.dispatchTarget.isDescendantOf(this.$.bottomBar)) {
            this.closeBottomBar();
        }
    },
    closeBottomBar: function() {
        this.$.bottomBar.close();
    },
    components: [
        {kind: "TopBar", onLogin: "loginHandler", onLogout: "logoutHandler"},
        {kind: "Panels", fit: true, draggable: false, classes: "app-panels", components: [
            {kind: "FrontMatter", onSignUp: "signUpHandler"},
            {kind: "GetStartedView", onDone: "showMainView"},
            {kind: "MainView"}
        ]},
        {kind: "BottomBar"},
        {kind: "LoadingPopup"},
        {kind: "AlertPopup"}
    ]
});