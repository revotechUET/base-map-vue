import template from "./template.html";
import "./style.less";
import {WiSelect} from "../../../../misc-component-vue";
// import {VScene, VRect} from "plot-toolkit-2";

const components = {WiSelect} //, VScene, VRect};
const component =  {
    props: [ ],
    template,
    components, 
    data: function() {
        return {
            opts: [
                {label: "name 1"},
                {label: "name sakdjfkdsajflkjdsaflkja dsjflkajsdlkfjdsa 2"},
                {label: "name 3"},
            ],
            optButtons: [
                {
                    class: "fa fa-edit",
                    handler: (item) => {
                        console.log("edit item", item);
                    }
                }
            ]
        };
    },
    watch: {},
    methods: {
        getSelected: (opts) => {
            return opts[0];
        },
        onSelectItemChanged: function(item) {
            console.log(item);
        },
        getLabelFn: (node) => node.label || node.name,
        getIcon: () => "",
        openContextMenu: function(event) {
            // console.log("DEBUG[outside] ", this);
            this.showContextMenu(event, [
                {label: "TEST 1", handler: function() {console.log(this.label)}},
                {label: "TEST 2", handler: function() {console.log(this.label)}},
                {label: "TEST 3", handler: function() {console.log(this.label)}},
            ]);
        },
        openModal: function() {
            const dialogs = [ "infoDialog", "successDialog", "warningDialog", "errorDialog" ];
            const rand = Math.floor(Math.random() * 4)
            this[dialogs[rand]]({
                title: "Alert",
                content: "This is content of the modal",
                buttons: [
                    {
                        label: "Cancel", handler: (close) => {
                            console.log("Cancel button clicked")
                            close && close();
                        }
                    },
                    {
                        label: "OK", handler: (close) => {
                            console.log("OK button clicked")
                            close && close();
                        }
                    }
                ]
            })
                .then(msg => {
                    console.log("before dialog: ", msg);
                });
        }
    },
    mounted() {}
}

export default component;