enyo.kind({
    name: "BottomBar",
    kind: "Slideable",
    classes: "bottombar", 
    min: -200,
    max: 0,
    axis: "v",
    unit: "px",
    overMoving: false,
    handlers: {
        ondrag: "dragHandler"
    },
    open: function() {
        this.animateToMin();
    },
    close: function() {
        this.animateToMax();
        this.$.group.setActive(null);
    },
    showAbout: function() {
        this.animateToMin();
        this.$.panels.setIndex(0);
    },
    showImpressum: function() {
        this.animateToMin();
        this.$.panels.setIndex(1);
    },
    showContact: function() {
        this.animateToMin();
        this.$.panels.setIndex(2);
    },
    dragHandler: function() {
        return true;
    },
    components: [
        {kind: "FittableRows", classes: "bottombar-inner", style: "height: 240px;", components: [
            {kind: "FittableColumns", components: [
                {allowHtml: true, content: "&copy; 2012 Engaginglab"},
                {fit: true, style: "text-align: center", components: [
                    {kind: "Group", components: [
                        {kind: "Button", classes: "bottombar-radiobutton", content: "about", ontap: "showAbout"},
                        {classes: "enyo-inline", allowHtml: true, content: "&#183;"},
                        {kind: "Button", classes: "bottombar-radiobutton", content: "impressum", ontap: "showImpressum"},
                        {classes: "enyo-inline", allowHtml: true, content: "&#183;"},
                        {kind: "Button", classes: "bottombar-radiobutton", content: "contact", ontap: "showContact"}
                    ]}
                ]},
                {style: "width: 100px;"}
            ]},
            {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
                {classes: "enyo-fill", style: "text-align: center", components: [
                    {allowHtml: true, classes: "bottombar-content", content: "about"}
                ]},
                {classes: "enyo-fill", style: "text-align: center", components: [
                    {allowHtml: true, classes: "bottombar-content impressum", content: "Lounge Affaire GmbH<br />" +
                        "Versailler Str. 11<br />" +
                        "81677 München<br />" +
                        "E-Mail: contact@engaginglab.com<br />" +
                        "Tel: +49 (0)179-5338597<br />" +
                        "Geschäftsführer: Roman Rackwitz<br />" +
                        "Registergericht: München, 180976 <br />" +
                        "Ust-IdNr: DE267481306"}
                ]},
                {classes: "enyo-fill", style: "text-align: center", components: [
                    {allowHtml: true, classes: "bottombar-content", content: "contact"}
                ]}
            ]}
        ]}
    ]
});