import Vue from "vue";

// COMPONENTS donot registered
import { WiTree } from "@revotechuet/misc-component-vue"
Vue.component('wi-tree', WiTree);


import BaseMapInputTree from "./base-map-input-tree";
import BaseMapNavBar from "./base-map-nav-bar";
import BaseMapMapView from "./base-map-map-view";

export default {
    BaseMapInputTree,
    BaseMapNavBar,
    BaseMapMapView
};