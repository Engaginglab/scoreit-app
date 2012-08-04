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
                this.$.icon.setAttribute("src", "assets/images/info_64x64.png");
                break;
            case "warning":
                this.$.icon.setAttribute("src", "assets/images/warning_64x64.png");
                break;
            case "error":
                this.$.icon.setAttribute("src", "assets/images/error_64x64.png");
                break;
            default:
                this.$.icon.setAttribute("src", this.icon);
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
        {tag: "img", name: "icon", classes: "alert-popup-icon"},
        {name: "message", allowHtml: true, classes: "alert-popup-message"},
        {kind: "onyx.Button", content: "OK", ontap: "dismiss", style: "width: 100%;"}
    ]
});