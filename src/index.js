import Vue from "vue";
import * as Fragment from "vue-fragment";
import {scaleLinear} from "d3-scale";
import {extent} from "d3-array";
import template from "./main.template.html";
import './main.style.less';
import components from "./components";
import mainMenu from "./handlers/mainMenu";
import projectTree from "./handlers/projectTree";
import '@fortawesome/fontawesome-free/css/all.css';
import {VueResizable, VueDialog, VueContextMenu} from "@revotechuet/misc-component-vue";

Vue.use(Fragment.Plugin);
Vue.use(VueResizable)
Vue.use(VueDialog)
Vue.use(VueContextMenu);

console.log(projectTree.project);

new Vue({
    el: "#vue-app",
    template, 
    components: {...components},
    computed: { },
    data: {
        mainMenu,
        treeConfig: projectTree.project,
        drawWidth: 800,
        drawHeight: 700
    },
    methods: {
    }
});
