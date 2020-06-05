import template from "./template.html";
import "./style.less";
import Vue from "vue";
// import * as apiService from "../../services/apiService";

// IMPORTED COMPONENTS 
import { WiTree } from "@revotechuet/misc-component-vue"
Vue.component('wi-tree', WiTree);

const component =  {
    props: [ 'treeConfig' ],
    template,
    data: function() {
        return { };
    },
    watch: {},
    methods: {
        getLabel: (node) => node.name,
        getIcon: () => ""
    },
    mounted() {
        this.$nextTick(async() => {
        })
    }
}

const VueComponent = Vue.extend(component);
export default VueComponent;