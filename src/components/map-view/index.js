import template from "./template.html";
import "./style.less";
import {WiSelect} from "../../../../misc-component-vue";
import {VContour, VScene, VCartersian, VViewport, VPolygon} from "plot-toolkit-2";
// import {ContourFileImport} from "../../../../contour-module/src/components/index-vue";
// import {ContourFileImport} from "@revotechuet/contour-module";
import * as _ from "lodash";
// import {VScene, VRect} from "plot-toolkit-2";

// const components = {WiSelect, VContour, VScene, VCartersian, VViewport, ContourFileImport}
const components = {WiSelect, VContour, VScene, VCartersian, VViewport}
const component =  {
    props: [ "drawWidth", "drawHeight" ],
    template,
    components, 
    data() {
        return {
            contourValues: [],
            contourHeaders: {},
            vpWidth: 500,
            vpHeight: 500,
            yDirection: "up",
            path: [{x: 10, y: 20}, {x: 50, y: 70}, {x: 30, y: 20}]
        };
    },
    watch: {},
    computed: {
        minX() { return this.contourHeaders.minX},
        maxX() { return this.contourHeaders.maxX},
        minY() { return this.yDirection === "up" ? this.contourHeaders.maxY:this.contourHeaders.minY},
        maxY() { return this.yDirection === "up" ? this.contourHeaders.minY:this.contourHeaders.maxY},
    },
    methods: {
        openContextMenu: function(event) {
            // console.log("DEBUG[outside] ", this);
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
            // this.$refs['viewport'].translate(x, y);
            if (delta < 0) {
                // this.$refs['viewport'].translate(-x * zoomFactor, -y * zoomFactor);
                const newVpWidth = this.vpWidth * zoomFactor;
                const newVpHeight = this.vpHeight * zoomFactor;
                this.vpWidth = Math.min(3500, newVpWidth);
                this.vpHeight = Math.min(3500, newVpHeight);
                if (this.vpWidth == newVpWidth)
                    this.$refs['viewport'].translate(x-x * zoomFactor, y-y * zoomFactor);
                // else 
                //     this.$refs['viewport'].translate(-x, -y);
            }
            else if (delta > 0) {
                // this.$refs['viewport'].translate(-x / zoomFactor, -y / zoomFactor);
                const newVpWidth = this.vpWidth / zoomFactor;
                const newVpHeight = this.vpHeight / zoomFactor;
                this.vpWidth = Math.max(this.drawWidth, newVpWidth);
                this.vpHeight = Math.max(this.drawHeight, newVpHeight);
                if (this.vpWidth == newVpWidth)
                    this.$refs['viewport'].translate(x-x / zoomFactor, y-y / zoomFactor);
                // else 
                //     this.$refs['viewport'].translate(-x, -y);
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