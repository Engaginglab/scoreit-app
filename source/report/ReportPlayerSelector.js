enyo.kind({
    name: "ReportPlayerSelector",
    kind: "MultiSelector",
    classes: "reportplayerselector",
    displayProperty: "display_name",
    filterProperties: ["display_name"],
    uniqueProperty: "id",
    setupSelectedItem: function(sender, event) {
        var item = this.selectedItemsArray[event.index];
        event.item.$.selectedPlayerName.setContent(item["display_name"]);
        event.item.$.shirtNumber.setValue(item.shirtNumber || "");
        return true;
    },
    listSetupItem: function(sender, event) {
        var item = this.filteredItems[event.index];
        this.$.listItem.addRemoveClass("selected", event.index == this.selected);
        this.$.listItem.setContent(item[this.displayProperty]);
    },
    shirtNumberChanged: function(sender, event) {
        var item = this.selectedItemsArray[event.index];
        item.shirtNumber = sender.getValue();
    },
    components: [
        {kind: "Scroller", style: "display: block; max-height: 200px; width: 100%; box-sizing: border-box;", components: [
            {kind: "Repeater", name: "selectedRepeater", onSetupItem: "setupSelectedItem", components: [
                {kind: "onyx.Item", tapHighlight: true, style: "display: block; width: 100%; box-sizing: border-box; padding: 5px;", components: [
                    {kind: "onyx.InputDecorator", components: [
                        {kind: "onyx.Input", placeholder: "Tr.#", style: "width: 40px;", onchange: "shirtNumberChanged", name: "shirtNumber"}
                    ]},
                    {name: "selectedPlayerName", classes: "enyo-inline", style: "padding: 5px;"},
                    {content: "x", style: "float: right;", ontap: "removeItemTapped"}
                ]}
            ]}
        ]},
        {kind: "onyx.InputDecorator", style: "width: 100%; box-sizing: border-box;", components: [
            {kind: "onyx.Input", name: "searchInput", onkeyup: "keyupHandler", onkeydown: "keydownHandler", style: "width: 100%;"}
        ]},
        {kind: "enyo.Popup", style: "width: 200px; max-height: 200px;", classes: "textfieldselector-popup onyx-menu onyx-picker", components: [
            {kind: "Scroller", style: "max-height: inherit;", components: [
                {kind: "FlyweightRepeater", name: "list", onSetupItem: "listSetupItem", components: [
                    {kind: "onyx.Item", tapHighlight: true, ontap: "itemClick", name: "listItem", classes: "textfieldselector-listitem onyx-menu-item"}
                ]}
            ]}
        ]}
    ]
});