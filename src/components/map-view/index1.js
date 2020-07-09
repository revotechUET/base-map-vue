import template from "./template.html";
import "./style.less";
import {WiSelect} from "../../../../misc-component-vue";
import {VContour, VBoundary, VScene, VCartersian, VViewport, VPolygon} from "plot-toolkit-2";
// import {ContourFileImport} from "../../../../contour-module/src/components/index-vue";
// import {ContourFileImport} from "@revotechuet/contour-module";
import * as _ from "lodash";
import projectTree from "../../handlers/projectTree";
import dataStore from "../../handlers/dataStore";
// import {VScene, VRect} from "plot-toolkit-2";

// const components = {WiSelect, VContour, VScene, VCartersian, VViewport, ContourFileImport}
const components = {WiSelect, VContour, VScene, VCartersian, VViewport, VBoundary}
const component =  {
    props: [ "drawWidth", "drawHeight" ],
    template,
    components, 
    data() {
        return {
            vpWidth: 500,
            vpHeight: 500,
            /*
            contourValues: [],
            contourHeaders: {},
            yDirection: "up",
            path: [{x: 10, y: 20}, {x: 50, y: 70}, {x: 30, y: 20}]
            */
        };
    },
    watch: {
        zmap() {
            console.log("zmap debug", this.zmap);
        }
    },
    computed: {
        well() {
            return projectTree.getWells();
        },
        boundary() {
            return projectTree.getBoundarys();
        },
        zmap() {
            return projectTree.getZMaps();
        }
    },
    methods: {
        getData(dataStoreId) {
            return dataStore.getData(dataStoreId) || {};
        },
        openContextMenu: function(event) {
            console.log("debug ", this.zmap, this.boundary, this.well);
            this.showContextMenu(event, [
                {label: "TEST 1", handler: function() {console.log(this.label)}},
                {label: "TEST 2", handler: function() {console.log(this.label)}},
                {label: "TEST 3", handler: function() {console.log(this.label)}},
            ]);
        },
        onDataChanged(changedData) {
            this.contourHeaders = _.clone(changedData.headers);
            this.contourValues = _.flatten(changedData.data);
        },
        zoomFn: function (delta, centerX, centerY, evt) {
            const zoomFactor = 1.1;
            let { x, y } = this.$refs.viewport.pixiObj.children[0].toLocal({ x: centerX, y: centerY });
            this.$refs['viewport'].translate(x, y);
            if (delta > 0) {
                const newVpWidth = this.vpWidth * zoomFactor;
                const newVpHeight = this.vpHeight * zoomFactor;
                this.vpWidth = newVpWidth;
                this.vpHeight = newVpHeight;
                this.$refs['viewport'].translate(- x * zoomFactor, - y * zoomFactor);
            }
            else if (delta < 0) {
                const newVpWidth = this.vpWidth / zoomFactor;
                const newVpHeight = this.vpHeight / zoomFactor;
                this.vpWidth = newVpWidth;
                this.vpHeight = newVpHeight;
                this.$refs['viewport'].translate(- x / zoomFactor, - y / zoomFactor);
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.vpWidth = this.drawWidth;
            this.vpHeight = this.drawHeight;
        })
    }
}

export default component;