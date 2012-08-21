enyo.kind({
	name: "Timer",
	classes: "timer",
	allowHtml: true,
	// content: "		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area sep colon on'>			<div class='element bar top'></div>			<div class='element bar bottom'></div>		</div>		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area second digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area second digit' style='display: none'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>",
	dt: 100,
	published: {
		time: 0,
		maxTime: 3600000,
		running: false,
		blinking: false
	},
	events: {
		onTimeout: ""
	},
	create: function() {
		this.inherited(arguments);
		this.timeChanged();
		this.runningChanged();
		this.blinkingChanged();
	},
	timeChanged: function() {
		var fl = Math.floor;
		var hs = fl(this.time / 10) % 100;
		var s = fl(this.time / 1000) % 60;
		var m = fl(this.time / 60000) % 60;

		this.$.minute1.setContent(fl(m / 10));
		this.$.minute2.setContent(m % 10);
		this.$.second1.setContent(fl(s / 10));
		this.$.second2.setContent(s % 10);
	},
	updateTime: function() {
		var newTime = this.time + this.dt*60;
		if (newTime >= this.maxTime) {
			this.stop();
			this.setTime(this.maxTime);
			this.doTimeout();
			this.setBlinking(true);
		}
		this.setTime(newTime);
	},
	runningChanged: function() {
		if (this.running) {
			this.timer = setInterval(enyo.bind(this, this.updateTime), this.dt);
		} else {
			clearInterval(this.timer);
		}
	},
	start: function() {
		this.setRunning(true);
	},
	stop: function() {
		this.setRunning(false);
	},
	reset: function() {
		this.setBlinking(false);
		this.setTime(0);
	},
	blinkingChanged: function() {
		if (this.blinking) {
			this.blinkTimer = setInterval(enyo.bind(this, function() {
				this.addRemoveClass("off", !this.hasClass("off"));
			}), 1000);
		} else {
			clearInterval(this.blinkTimer);
			this.removeClass("off");
		}
	},
	toggle: function() {
		this.setRunning(!this.running);
	},
	components: [
		{classes: "timer-digit", name: "minute1", content: "0"},
		{classes: "timer-digit", name: "minute2", content: "0"},
		{classes: "timer-digit", content: ":"},
		{classes: "timer-digit", name: "second1", content: "0"},
		{classes: "timer-digit", name: "second2", content: "0"}
	]
});