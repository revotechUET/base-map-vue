import template from "./template.html";
import "./style.less";
import Vue from "vue";
import {VueDialog} from "../../../../misc-component-vue";
const component =  {
    props: [ ],
    template,
    data: function() {
        return {
        };
    },
    watch: {},
    methods: {
        getLabel: (node) => node.name,
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
            this.infoDialog({
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

Vue.extend(component);
export default component;