enyo.kind({
    name: "MainView",
    kind: "FittableColumns",
    noStretch: true,
    classes: "bg-light",
    published: {
        "user": null
    },
    views: {
        "dashboard": 0,
        "detail": 1
    },
    userChanged: function() {
        this.$.detail.setUser(this.user);
    },
    showView: function(view) {
        this.$.panels.setIndex(this.views[view]);
        // this.$.panels.resized();
    },
    showClubHandler: function(sender, event) {
        this.$.detail.showClub(event.club);
        this.showView("detail");
    },
    showTeamHandler: function(sender, event) {
        this.$.detail.showTeam(event.team);
        this.showView("detail");
    },
    refresh: function() {
        this.$.dashboard.refresh();
    },
    showDashboard: function() {
        this.showView("dashboard");
    },
    showDetail: function() {
        this.$.detail.showRootView();
        this.showView("detail");
    },
    components: [
        {kind: "SideMenu", onDashboard: "showDashboard", onDetail: "showDetail", style: "margin: 110px 0 0 0;"},
        {kind: "Image", src: "assets/images/vertical-separator.png", style: "margin: 0 -20px;"},
        // {kind: "Slideable", min: 0, max: 80, unit: "px", classes: "enyo-fill bg-light shadow-left", style: "background-color: White;", overMoving: false, components: [
            {kind: "Panels", fit: true, name: "panels", arrangerKind: "CardArranger", draggable: false, classes: "enyo-fill", components: [
                {kind: "Dashboard", onShowClub: "showClubHandler", onShowTeam: "showTeamHandler"},
                {kind: "DetailView", name: "detail"}
            ]}
        // ]}
    ]
});