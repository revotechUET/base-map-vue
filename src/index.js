import Vue from "vue";
// import angular from "angular";
import {Plugin} from "vue-fragment";
import template from "./main.template.html";
import './main.style.less';
import components from "./components";
import "./directives";
import VModal from "vue-js-modal";

Vue.use(Plugin);
Vue.use(VModal, { dynamic: true, injectModalsContainer: true  });

function printFn(obj) {
    console.log(obj.label);
}
const mainMenu = [{
    label: "File",
    children: [{
        label: "New",
        handler: function() {
            printFn(this);
        }
    },{
        label: "Open",
        handler: function() {
            printFn(this);
        }
    },{
        label: "Save",
        handler: function() {
            printFn(this);
        }
    }]
},{
    label: "Import",
    children: [{
        label: "Wells",
        handler: function() {
            printFn(this);
        }
    },{
        label: "ZMap",
        handler: function() {
            printFn(this);
        }
    },{
        label: "Boundary",
        handler: function() {
            printFn(this);
        }
    }]
},{
    label: "Export",
    children: [{
        label: "Wells",
        handler: function() {
            printFn(this);
        }
    },{
        label: "ZMap",
        handler: function() {
            printFn(this);
        }
    },{
        label: "Boundary",
        handler: function() {
            printFn(this);
        }
    }]
}]

new Vue({
    el: "#vue-app",
    template, 
    components,
    computed: { },
    data: { 
        mainMenu
    },
    methods: { }
});