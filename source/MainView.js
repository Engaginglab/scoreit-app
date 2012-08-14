enyo.kind({
    name: "MainView",
    kind: "FittableColumns",
    views: {
        "dashboard": 0,
        "detail": 1
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
        this.showView("detail");
    },
    components: [
        {kind: "SideMenu", onDashboard: "showDashboard", onDetail: "showDetail"},
        {kind: "Panels", fit: true, name: "panels", arrangerKind: "CardArranger", animate: true, classes: "enyo-fill", components: [
            {kind: "Dashboard", onShowClub: "showClubHandler", onShowTeam: "showTeamHandler"},
            {kind: "DetailView", name: "detail"}
        ]}
    ]
});