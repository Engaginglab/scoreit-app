enyo.kind({
    name: "AlertPopup",
    kind: "onyx.Popup",
    floating: true,
    centered: true,
    classes: "alert-popup",
    events: {
        onDismiss: ""
    },
    published: {
        icon: "info",
        message: "",
        callback: null
    },
    create: function() {
        this.inherited(arguments);
        this.iconChanged();
    },
    iconChanged: function() {
        switch (this.icon) {
            case "info":
                this.$.icon.setSrc("assets/images/info_64x64.png");
                break;
            case "warning":
                this.$.icon.setSrc("assets/images/warning_64x64.png");
                break;
            case "error":
                this.$.icon.setSrc("assets/images/error_64x64.png");
                break;
            default:
                this.$.icon.setSrc(this.icon);
                break;
        }
    },
    messageChanged: function() {
        this.$.message.setContent(this.message);
    },
    dismiss: function() {
        this.doDismiss();
        if (this.callback) {
            this.callback();
        }
        this.hide();
    },
    components: [
        {kind: "Image", name: "icon", classes: "alert-popup-icon"},
        {name: "message", allowHtml: true, classes: "alert-popup-message"},
        {kind: "onyx.Button", content: "OK", ontap: "dismiss", style: "width: 100%;"}
    ]
});