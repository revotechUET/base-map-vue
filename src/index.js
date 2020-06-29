import Vue from "vue";
import * as Fragment from "vue-fragment";
import {scaleLinear} from "d3-scale";
import {extent} from "d3-array";
import template from "./main.template.html";
import './main.style.less';
import components from "./components";
import mainMenu from "./handlers/mainMenu";
import projectTree from "./handlers/projectTree";
import { VueResizable, VueDialog, VueContextMenu } from "@revotechuet/misc-component-vue";
// import { ContourView, ContourFileImport } from "../../contour-module/src/components/index-vue";
import {ContourView, ContourFileImport} from "@revotechuet/contour-module";
import '@fortawesome/fontawesome-free/css/all.css';
// import { VueResizable, VueDialog, VueContextMenu } from "@revotechuet/misc-component-vue";

Vue.use(Fragment.Plugin);
Vue.use(VueResizable)
Vue.use(VueDialog)
Vue.use(VueContextMenu);

console.log(projectTree.project);

new Vue({
    el: "#vue-app",
    template, 
    components: {...components, ContourView, ContourFileImport},
    computed: { },
    data: { 
        mainMenu,
        treeConfig: projectTree.project,

        // negativeData: false,
        // headers: {},
        // values: [],
        // minValue: 0,
        // maxValue: 1,
        // colorScale: scaleLinear().range(['red', 'blue']),
        // step: 100,
        // majorEvery: 5,
        // fontSize: 2,
        // showLabel: false,
        // showGrid: true,
        // gridMajor: 5,
        // gridMinor: 4,
        // gridNice: true,
        // scale: 1,
        // showScale: true,
        // yDirection: 'up',
        // colorLegendTicks: 50,
        // showColorScaleLegend: true,
    },
    methods: {
        // onDataChanged(changedData) {
        //     this.headers = _.clone(changedData.headers);
        //     this.values = _.flatten(changedData.data);
        //     const domain = extent(this.values);
        //     this.colorScale.domain(domain);
        //     this.minValue = domain[0];
        //     this.maxValue = domain[1];
        // }
    }
});