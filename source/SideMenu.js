/**
	Vertical menu for selecting subviews
*/
enyo.kind({
	name: "SideMenu",
	classes: "sidemenu",
	events: {
		//* Gets fired when the user selects the dashboard menu item
		onDashboard: "",
		//* Gets fired when the user selects the detail menu item
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
	/**
		Show report app in new window
	*/
	report: function() {
		window.open("report_debug.html", "report",
			"location=no,menubar=no,resizable=no,status=no,titlebar=no,toolbar=no,width=1024,height=768");
	},
	components: [
		{classes: "onyx-menu-item sidemenu-item", name: "dashboardMenuItem", ontap: "dashboard", components: [
			{kind: "Image", src: "assets/images/home.png", classes: "sidemenu-item-icon"},
			{classes: "sidemenu-item-caption", content: "Home"}
		]},
		{classes: "onyx-menu-item sidemenu-item", name: "detailMenuItem", ontap: "detail", components: [
			{kind: "Image", src: "assets/images/list.png", classes: "sidemenu-item-icon"},
			{classes: "sidemenu-item-caption", content: "Übersicht"}
		]},
		{classes: "onyx-menu-item sidemenu-item", name: "reportMenuItem", ontap: "report", components: [
			{kind: "Image", src: "assets/images/report.png", classes: "sidemenu-item-icon"},
			{classes: "sidemenu-item-caption", content: "Spielbericht"}
		]}
	]
});