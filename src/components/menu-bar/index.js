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
        execMenuItem: function(menuItem, mouseover) {
            if (mouseover) {
                if (menuItem.children && menuItem.children.length) {
                    menuItem.show = true;
                    if (menuItem.show) {
                        this.menu.forEach(item => {
                            if (item !== menuItem)
                                item.show = false;
                        })
                    }
                }
            }
            else {
                menuItem.handler && menuItem.handler();
            }
        },
        unShowAllMenuItem: function() {
            console.log("unShow");
            this.menu.forEach(item => item.show = false);
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
        });
    }
};

const VueComponent = Vue.extend(component);
const MenuBar = dialogFactoryFn(VueComponent);
export { MenuBar as default };