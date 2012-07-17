enyo.kind({
	name: "FormField",
	published: {
		type: "",
		required: false,
		label: "",
		valid: null,
		errorMessage: ""
	},
	requiredChanged: function() {
		this.addRemoveClass("formfield-required", this.required);
	},
	typeChanged: function() {
		this.$.input.setType(this.type);
	},
	labelChanged: function() {
		this.$.label.setContent(this.label);
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
		this.labelChanged();
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
		{kind: "onyx.InputDecorator", classes: "input-fill", components: [
			{kind: "onyx.Input", name: "input"},
			{classes: "label", components: [
				{classes: "formfield-checkmark"},
				{name: "label", style: "float: right"}
			]}
		]}
	]
});