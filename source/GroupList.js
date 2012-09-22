/**
	Shows a list of groups and groups them into different league levels, genders and age groups.
*/
enyo.kind({
	name: "GroupList",
	ageGroups: [
		["adults", "Erwachsene"],
		["juniors_a", "Jugend A"],
		["juniors_b", "Jugend B"],
		["juniors_c", "Jugend C"],
		["juniors_d", "Jugend D"],
		["juniors_e", "Jugend E"]
	],
	published: {
		groups: []
	},
	events: {
		//* Gets fired when a user selects a group
		onShowGroup: ""
	},
	groupsChanged: function() {
		for (var i=0; i<this.ageGroups.length; i++) {
			this["groups_male_" + this.ageGroups[i][0]] = [];
			this["groups_female_" + this.ageGroups[i][0]] = [];
		}

		for (var i=0; i<this.groups.length; i++) {
			var group = this.groups[i];
			var arrayName = "groups_" + group.gender + "_" + group.age_group;

			this[arrayName].push(group);
		}

		this.destroyComponents();
		for (var i=0; i<this.ageGroups.length; i++) {
			this.createGroupList("male", this.ageGroups[i]);
			this.createGroupList("female", this.ageGroups[i]);
		}

		this.render();
		this.refreshLists();
	},
	setupGroupItem: function(sender, event) {
		var group = this["groups_" + sender.gender + "_" + sender.ageGroup][event.index];
		var item = this.$["item_" + sender.gender + "_" + sender.ageGroup];
		item.setContent(group.name);
	},
	createGroupList: function(gender, ageGroup) {
		var groupArray = this["groups_" + gender + "_" + ageGroup[0]];
		if (groupArray && groupArray.length) {
			this.createComponent({kind: "onyx.Groupbox", classes: "grouplist-box", gender: gender, ageGroup: ageGroup[0], onSetupItem: "setupGroupItem", components: [
				{kind: "onyx.GroupboxHeader", content: ageGroup[1] + " " + (gender == "male" ? "männlich" : "weiblich")},
				{kind: "FlyweightRepeater", owner: this, name: "list_" + gender + "_" + ageGroup[0], components: [
					{kind: "onyx.Item", name: "item_" + gender + "_" + ageGroup[0], ontap: "groupTapped"}
				]}
			]});
		}
	},
	refreshList: function(gender, ageGroup) {
		var list = this.$["list_" + gender + "_" + ageGroup[0]];
		var groups = this["groups_" + gender + "_" + ageGroup[0]];
		if (list) {
			list.setCount(groups.length);
			list.render();
		}
	},
	refreshLists: function() {
		for (var i=0; i<this.ageGroups.length; i++) {
			this.refreshList("male", this.ageGroups[i]);
			this.refreshList("female", this.ageGroups[i]);
		}
	},
	groupTapped: function(sender, event) {
		var gender = sender.container.container.gender;
		var ageGroup = sender.container.container.ageGroup;
		var group = this["groups_" + gender + "_" + ageGroup][event.index];
		this.doShowGroup({group: group});
	}
});