enyo.kind({
	name: "FormField",
	kind: "onyx.InputDecorator",
	classes: "formfield input-fill",
	published: {
		type: "",
		required: false,
		//label: "",
		valid: null,
		errorMessage: "",
		placeholder: ""
	},
	requiredChanged: function() {
		this.addRemoveClass("formfield-required", this.required);
	},
	typeChanged: function() {
		this.$.input.setType(this.type);
	},
	// labelChanged: function() {
	// 	this.$.label.setContent(this.label);
	// },
	placeholderChanged: function() {
		this.$.input.setPlaceholder(this.placeholder);
	},
	validChanged: function() {
		this.addRemoveClass("formfield-invalid", this.valid === false);
		this.addRemoveClass("formfield-valid", this.valid === true);
		this.$.errorMessage.setShowing(this.valid === false);
	},
	errorMessageChanged: function() {
		this.$.errorMessage.setContent(this.errorMessage);
	},
	create: function() {
		this.inherited(arguments);
		this.requiredChanged();
		this.typeChanged();
		// this.labelChanged();
		this.placeholderChanged();
		this.validChanged();
		this.errorMessageChanged();
	},
	getValue: function(value) {
		return this.$.input.getValue(value);
	},
	setValue: function(value) {
		return this.$.input.setValue(value);
	},
	components: [
		{name: "errorMessage", classes: "formfield-errormessage", showing: false},
		{kind: "onyx.Input", name: "input"},
		{classes: "formfield-checkmark label"}
	]
});