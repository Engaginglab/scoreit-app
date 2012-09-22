/**
	Field to be used in forms. Changes style based on the valid property and can show an error message.
*/
enyo.kind({
	name: "FormField",
	kind: "onyx.InputDecorator",
	classes: "formfield input-fill",
	published: {
		//* Type of the input field. Get mapped directly to the underlying onyx.Input kind
		type: "",
		//* Whether or not this field has to be filled
		required: false,
		//* Whether or not this fields content is considered valid
		valid: null,
		//* Error message that is shown if the fields content is not valid
		errorMessage: "",
		//* Placeholder that is shwon if the field is empty
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
		this.addRemoveClass("invalid", this.valid === false);
		this.addRemoveClass("valid", this.valid === true);
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
		{classes: "formfield-checkmark"}
	]
});