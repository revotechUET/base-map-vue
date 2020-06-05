import Vue from "vue";
// import angular from "angular";
import * as Fragment from "vue-fragment";
import template from "./main.template.html";
import './main.style.less';
import components from "./components";
import "./directives";
import VModal from "vue-js-modal";
import mainMenu from "./handlers/mainMenu";
import projectTree from "./handlers/projectTree";

Vue.use(Fragment.Plugin);
Vue.use(VModal, { dynamic: true, injectModalsContainer: true });

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