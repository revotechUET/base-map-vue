import Vue from 'vue';
import template from "./template.html";
import "./style.less";
import dialogFactoryFn from '../../dialogs';
const component =  {
    props: [ 'menu' ],
    template,
    data: function() {
        return { };
    },
    watch: {},
    methods: {
        execMenuItem: function(menuItem) {
            if (menuItem.children && menuItem.children.length) {
                menuItem.show = !menuItem.show;
            }
            else {
                menuItem.handler && menuItem.handler();
            }
        },
        openModal: function() {
            this.infoDialog({
                title: "Alert",
                content: "this is content of modal",
                buttons: [
                    {
                        label: "OK", handler: (close) => {
                            console.log("OK button clicked")
                            close && close();
                        }
                    },
                    {
                        label: "Cancel", handler: (close) => {
                            console.log("Cancel button clicked")
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
    mounted() {
        this.$nextTick(() => {
            // this.menu = this.menu || ["abc", "def"];
        });
    }
};

const VueComponent = Vue.extend(component);
export default dialogFactoryFn(VueComponent);