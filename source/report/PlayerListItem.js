enyo.kind({
	name: "PlayerListItem",
	kind: "onyx.Item",
	classes: "player-list-item",
	published: {
		player: "",
		penalties: 0,
		warnings: 0,
		goals: 0,
		disqualified: false,
		disabled: false
	},
	handlers: {
		ontap: "tapHandler"
	},
	tapHandler: function() {
		if (this.disabled) {
			return true;
		}
	},
	playerChanged: function() {
		this.$.playerName.setContent(this.player.first_name + " " + this.player.last_name);
		this.$.shirtNumber.setContent(this.player.shirtNumber);
	},
	penaltiesChanged: function() {
		this.$.time1.setShowing(this.penalties >= 1);
		this.$.time2.setShowing(this.penalties >= 2);

		this.setDisqualified(this.penalties >= 3);
	},
	warningsChanged: function() {
		this.$.card1.setShowing(this.warnings >= 1);

		if (this.warnings >= 2) {
			this.disqualify();
		}
	},
	disqualifiedChanged: function() {
		this.setDisabled(this.disqualified);
		if (this.disqualified) {
			this.$.card1.hide();
			this.$.time1.hide();
			this.$.time2.hide();
		} else {
			this.penaltiesChanged();
			this.warningsChanged();
		}

		this.$.card2.setShowing(this.disqualified);
	},
	goalsChanged: function() {
		this.$.goals.setShowing(this.goals);
		this.$.goalsCounter.setContent("x " + this.goals);
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
	},
	penalty: function() {
		this.setPenalties(this.penalties+1);
		this.startTimer();
	},
	warning: function() {
		this.setWarnings(this.warnings+1);
	},
	disqualify: function() {
		this.setDisqualified(true);
		this.startTimer();
	},
	create: function() {
		this.inherited(arguments);
		this.playerChanged();
	},
	startTimer: function() {
		this.$.timer.setContent("2:00");
		this.timeLeft = 120;
		this.$.pen.hide();
		this.$.timer.show();
		this.resumeTimer();
	},
	updateTimer: function() {
		this.timeLeft--;
		if (this.timeLeft < 0) {
			this.stopTimer();
		} else {
			var min = Math.floor(this.timeLeft/60);
			var sec = this.timeLeft%60;
			this.$.timer.setContent(Math.floor(this.timeLeft/60) + ":" + (sec < 10 ? "0" : "") + sec);
		}
	},
	stopTimer: function() {
		clearInterval(this.timerInt);
		this.$.timer.hide();
		this.$.pen.show();
		this.disqualifiedChanged();
		this.timeLeft = null;
	},
	pauseTimer: function() {
		clearInterval(this.timerInt);
	},
	resumeTimer: function() {
		if (this.timeLeft) {
			this.pauseTimer();
			this.setDisabled(true);
			this.timerInt = setInterval(enyo.bind(this, this.updateTimer), 1000/60);
		}
	},
	components: [
		{name: "shirtNumber", classes: "player-list-item-number"},
		{name: "goals", classes: "player-list-item-goals", showing: false, components: [
			{kind: "Image", src: "assets/images/ball.png"},
			{name: "goalsCounter", classes: "player-list-item-goals-text"}
		]},
		{name: "pen", classes: "player-list-item-cards", components: [
			{kind: "Image", src: "assets/images/stopwatch.png", name: "time1", showing: false},
			{kind: "Image", src: "assets/images/stopwatch.png", name: "time2", showing: false},
			{kind: "Image", src: "assets/images/yellow_card_24x24.png", name: "card1", showing: false},
			{kind: "Image", src: "assets/images/red_card_24x24.png", name: "card2", showing: false}
		]},
		{name: "timer", classes: "player-list-item-timer", showing: false},
		{name: "playerName", classes: "player-list-item-name ellipsis"}
	]
});