import Vue from "vue";
// import angular from "angular";
import * as Fragment from "vue-fragment";
import template from "./main.template.html";
import './main.style.less';
import components from "./components";
import mainMenu from "./handlers/mainMenu";
import projectTree from "./handlers/projectTree";
import {VueResizable, VueDialog, VueContextMenu } from "../../misc-component-vue";

Vue.use(Fragment.Plugin);
Vue.use(VueResizable)
Vue.use(VueDialog)
Vue.use(VueContextMenu);

new Vue({
    el: "#vue-app",
    template, 
    components,
    computed: { },
    data: { 
        mainMenu,
        treeConfig: projectTree.tree
    },
    methods: { }
});