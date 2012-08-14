enyo.kind({
	name: "SideMenu",
	classes: "sidemenu",
	events: {
		onDashboard: "",
		onDetail: ""
	},
	dashboard: function() {
		this.$.dashboardMenuItem.addClass("selected");
		this.$.detailMenuItem.removeClass("selected");
		this.doDashboard();
	},
	detail: function() {
		this.$.dashboardMenuItem.removeClass("selected");
		this.$.detailMenuItem.addClass("selected");
		this.doDetail();
	},
	components: [
		{classes: "onyx-menu-item sidemenu-item", content: "Mein score.it", name: "dashboardMenuItem", ontap: "dashboard"},
		{classes: "onyx-menu-item sidemenu-item", content: "Übersicht", name: "detailMenuItem", ontap: "detail"}
	]
});