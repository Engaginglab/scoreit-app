/**
    Lightweight control for selecting multiple items from a large number of choices.
    As the user types a query string into an input field, he is presented a list of choices matching his query.
    Selected items are shown as boxes within the text field which makes it very compact and good to use inside forms
*/
enyo.kind({
    name: "TextFieldSelector",
    kind: "MultiSelector",
    classes: "textfieldselector",
    setupItem: function(sender, event) {
        var item = this.selectedItemsArray[event.index];
        event.item.$.label.setContent(item[this.displayProperty]);
        return true;
    },
    listSetupItem: function(sender, event) {
        var item = this.filteredItems[event.index];
        this.$.listItem.addRemoveClass("selected", event.index == this.selected);
        this.$.listItem.setContent(item[this.displayProperty]);
    },
    components: [
        {kind: "onyx.InputDecorator", style: "width: 100%; box-sizing: border-box;", components: [
            {kind: "Repeater", name: "selectedRepeater", classes: "textfieldselector-repeater", onSetupItem: "setupItem", components: [
                {classes: "textfieldselector-item", components: [
                    {classes: "textfieldselector-item-label", name: "label"},
                    {classes: "textfieldselector-removebutton", content: "x", ontap: "removeItemTapped"}
                ]}
            ]},
            {kind: "onyx.Input", name: "searchInput", onkeyup: "keyupHandler", onkeydown: "keydownHandler"},
            {kind: "enyo.Popup", style: "width: 200px; max-height: 200px;", classes: "textfieldselector-popup onyx-menu onyx-picker", components: [
                {kind: "Scroller", style: "max-height: inherit;", components: [
                    {kind: "FlyweightRepeater", name: "list", onSetupItem: "listSetupItem", components: [
                        {kind: "onyx.Item", tapHighlight: true, ontap: "itemClick", name: "listItem", classes: "textfieldselector-listitem onyx-menu-item"}
                    ]}
                ]}
            ]}
        ]}
    ]
});