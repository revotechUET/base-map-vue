import template from "./template.html";
import "./style.less";
import Vue from "vue";

// DEPENDENT COMPONENTS 
import { WiTree } from "@revotechuet/misc-component-vue"
// import { WiTree } from "../../../../misc-component-vue";
Vue.component('wi-tree', WiTree);

const component =  {
    props: [ 'treeConfig' ],
    template,
    data: function() {
        return { };
    },
    watch: {},
    methods: {
        getLabel: (node) => {
            if (node.type == "well") 
                return `${node.parent}/${node.name}`;
            return node.name
        },
        getIcon: (node) => {
            if (node.type == "well") {
                return node.show ? 'fa fa-eye' : "fa fa-eye-slash";
            } else if (node.type == "boundary") {
                return node.show ? 'fa fa-eye' : "fa fa-eye-slash";
            } else if (node.type == "zmap") {
                return node.show ? 'fa fa-eye' : "fa fa-eye-slash";
            }
            return "fa fa-folder";
        },
        getChildren: (node) => node.children,
        onNodeClick: function(event, node, selectedNodes, tree) {
            if (node.onClick) {
                this.$nextTick(() => {
                    node.onClick.call(node);
                })
            }
            // console.log(event, node, selectedNodes, tree);
        },
        onNodeRightClick: function(event, node) {
            // console.log("right click", event, node);
            this.showContextMenu(event, node.contextMenu || []);
        }
    },
    mounted() {
        this.$nextTick(async() => {
            console.log(this.treeConfig)
        })
    }
}

const VueComponent = Vue.extend(component);
export default VueComponent;