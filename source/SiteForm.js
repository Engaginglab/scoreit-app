enyo.kind({
	name: "SiteForm",
	classes: "scoreit-form",
	published: {
		site: null
	},
	siteChanged: function() {
		if (this.site) {
			this.$.siteNumber.setValue(this.site.number);
			this.$.address.setValue(this.site.address);
			this.$.zipCode.setValue(this.site.zip_code);
			this.$.city.setValue(this.site.city);
		} else {
			this.$.siteNumber.setValue("");
			this.$.address.setValue("");
			this.$.zipCode.setValue("");
			this.$.city.setValue("");
		}
	},
	clear: function() {
		this.setSite(null);
		this.siteChanged();
	},
	getData: function() {
		var address = this.$.address.getValue();
		var number = this.$.siteNumber.getValue();
		var zipCode = this.$.zipCode.getValue();
		var city = this.$.city.getValue();
		return {
			id: this.site ? this.site.id : undefined,
			number: number,
			address: address,
			zip_code: zipCode,
			city: city,
			display_name: address + ", " + zipCode + " " + city + " (#" + number + ")"
		};
	},
	components: [
		{kind: "onyx.InputDecorator", components: [
			{kind: "onyx.Input", defaultFocus: true, placeholder: "Hallennummer", name: "siteNumber"}
		]},
		{kind: "onyx.InputDecorator", components: [
			{kind: "onyx.Input", placeholder: "Adresse", name: "address"}
		]},
		{kind: "onyx.InputDecorator", components: [
			{kind: "onyx.Input", placeholder: "Postleitzahl", name: "zipCode"}
		]},
		{kind: "onyx.InputDecorator", components: [
			{kind: "onyx.Input", placeholder: "Stadt", name: "city"}
		]}
	] 
});