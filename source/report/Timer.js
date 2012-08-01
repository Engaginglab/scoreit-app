enyo.kind({
	name: "Timer",
	classes: "timer",
	allowHtml: true,
	// content: "		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area sep colon on'>			<div class='element bar top'></div>			<div class='element bar bottom'></div>		</div>		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area second digit'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>		<div class='display-area second digit' style='display: none'>			<div class='element bar center top'></div>			<div class='element bar center middle'></div>			<div class='element bar center bottom'></div>			<div class='element bar left top'></div>			<div class='element bar left bottom'></div>			<div class='element bar right top'></div>			<div class='element bar right bottom'></div>		</div>",
	dt: 100,
	published: {
		time: 0,
		maxTime: 3600000
	},
	events: {
		onTimeout: ""
	},
	rendered: function() {
		this.inherited(arguments);
		this.timeChanged();
	},
	timeChanged: function() {
		var fl = Math.floor;

		// var d = $('.digit');
		var hs = fl(this.time / 10) % 100;
		var s = fl(this.time / 1000) % 60;
		var m = fl(this.time / 60000) % 60;

		this.$.minute1.setContent(fl(m / 10));
		this.$.minute2.setContent(m % 10);
		this.$.second1.setContent(fl(s / 10));
		this.$.second2.setContent(s % 10);
		// //this.log("m: " + m + ", s: " + s + ", hs: " + hs);

		// //$('.sep').toggleClass('on');
		// // Set all the digits

		// d.removeClass("d0 d1 d2 d3 d4 d5 d6 d7 d8 d9")
		// .eq(0).addClass("d" + fl(m / 10)).end()
		// .eq(1).addClass("d" + (m % 10)).end()
		// .eq(2).addClass("d" + fl(s / 10)).end()
		// .eq(3).addClass("d" + (s % 10)).end()
		// .eq(4).addClass("d" + fl(hs / 10)).end()
		// .eq(5).addClass("d" + (hs % 10));
	},
	updateTime: function() {
		var newTime = this.time + this.dt*60;
		if (newTime >= this.maxTime) {
			this.stop();
			this.setTime(this.maxTime);
			this.doTimeout();
			this.blink();
		}
		this.setTime(newTime);
	},
	start: function() {
		this.stop();
		this.running = true;
		this.timer = setInterval(enyo.bind(this, this.updateTime), this.dt);
	},
	stop: function() {
		this.stopBlinking();
		clearInterval(this.timer);
		this.running = false;
	},
	reset: function() {
		this.stopBlinking();
		this.setTime(0);
	},
	blink: function() {
		this.blinkTimer = setInterval(enyo.bind(this, function() {
			this.addRemoveClass("off", !this.hasClass("off"));
		}), 1000);
	},
	stopBlinking: function() {
		clearInterval(this.blinkTimer);
		this.removeClass("off");
	},
	toggle: function() {
		if (this.running) {
			this.stop();
		} else {
			this.start();
		}
	},
	isRunning: function() {
		return this.running;
	},
	components: [
		{classes: "timer-digit", name: "minute1"},
		{classes: "timer-digit", name: "minute2"},
		{classes: "timer-digit", content: ":"},
		{classes: "timer-digit", name: "second1"},
		{classes: "timer-digit", name: "second2"}
	]
});