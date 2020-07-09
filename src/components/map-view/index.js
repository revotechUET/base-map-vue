import template from "./template.html";
import "./style.less";
import {geoMercator, geoPath, geoGraticule10} from "d3-geo";
import * as _ from "lodash";
import projectTree from "../../handlers/projectTree";
import dataStore from "../../handlers/dataStore";

function Renderer(context = null, options = {}) {
    const renderer = this;
    this.queue = [];
    this.currentContext = context;
    this.width = options.width;
    this.height = options.height;

    this.drawRaw = () => {
        if (this.currentContext) {
            this.currentContext.clearRect(0, 0, this.width, this.height);
        }
        this.queue.forEach(task => {
            requestAnimationFrame(() => {
                task.handler.call(task.thisBinding || this, ...task.args);
            })
        })
    }

    this.draw = _.debounce(this.drawRaw, 100);

    this.dequeue = function(matchingFn) {
        const taskIdx = this.queue.findIndex(job => matchingFn(job));
        const job = this.queue.splice(taskIdx, 1);
        return job;
    }

    this.enqueue = function(handlerFn, args = []) {
        const task = {
            handler: handlerFn,
            thisBinding: this,
            args
        };
        renderer.queue.push(task);
        return task;
    }
}

// ============================================
const objectCatalog = {
    "geojson": MapGeoJson
}

function Map(el, width, height, scale = 100, center = {}) {
    const mapInstance = this;
    el.addEventListener("mousemove", function(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        mapInstance.drawings.forEach(obj => {
            if (obj.isInside(mapInstance._context, x, y)) {
                console.log("hit object", obj);
                obj.fillStyle = "#00ff00";
                mapInstance.doDraw();
            }
        })
    })
    this._context = el.getContext('2d');
    this._projection = geoMercator()
        .translate([width / 2, height / 2])
        .scale(scale)
        .center([center.lng || 0, center.lat || 0]);
    this._pathGenerator = geoPath(this._projection);

    this._renderer = new Renderer(this._context, { width, height });

    this.drawings = [];

    this.updateScale = function(newScale) {
        this._projection.scale(newScale);
    }

    this.updateCenter = function(center = {}) {
        const currCenter = this._projection.center();
        const newLat = _.isFinite(Number(center.lat)) ? center.lat : currCenter[1];
        const newLng = _.isFinite(Number(center.lng)) ? center.lng : currCenter[0];

        this._projection.center([newLng, newLat]);
    }

    this.addObject = (type, ...configs) => {
        const constructor = objectCatalog[type];
        const obj = new constructor(this._projection, this._pathGenerator,...configs);
        obj.destroy = removeObjFn(obj);
        this.drawings.push(obj);
        this._renderer.enqueue.call(obj, obj.draw, [this._context]);
        return obj;
    };

    function removeObjFn(obj) {
        return function() {
            const idx = mapInstance.drawings.findIndex(dw => dw == obj);
            if (idx >= 0) {
                mapInstance.drawings.splice(idx, 1);
                mapInstance._renderer.dequeue((job) => {
                    return job.handler == obj.draw;
                });

                mapInstance.doDraw();
            }
        }
    }

    this.doDraw = function() {
        this._renderer.draw();
    }
}

function MapObject(projection, pathGenerator, destro) {
    this.projection = projection;
    this.pathGenerator = pathGenerator;

    this.show = true;

    this.hide = () => this.show = false;
    this.toggle = () => this.show = !this.show;
}

MapObject.prototype.draw = function(context) {
    console.warn("not implemented");
}

MapObject.prototype.isInside = function(context, x, y) {
    if (!this.path) return false;
    return context.isPointInPath(this.path, x, y);
}

function MapGeoJson(projection, pathGenerator, geojson = null, options = {}) {
    MapObject.call(this, projection, pathGenerator);
    this.geojson = geojson;
    this.path = null;

    this.fillStyle = options.fillStyle || null;
    this.strokeStyle = options.strokeStyle || null;
}
// extend the MapObject class
MapGeoJson.prototype = Object.create(MapObject.prototype);
MapGeoJson.prototype.constructor = MapGeoJson;

MapGeoJson.prototype.draw = function(context) {
    if (!this.geojson) return;

    if (this.fillStyle)
        context.fillStyle = this.fillStyle;
    if (this.strokeStyle)
        context.strokeStyle = this.strokeStyle;

    const path = this.pathGenerator(this.geojson);
    this.path = new Path2D(path);

    if (this.fillStyle) {
        context.fill(this.path);
    }
    if (this.strokeStyle)
        context.stroke(this.path);
}


// ============================================

const component =  {
    props: [ "drawWidth", "drawHeight" ],
    template,
    components: {},
    data() {
        return {
            map: null,
            centerLat: 0,
            centerLng: 0,
            scale: 100
        };
    },
    watch: {
    },
    computed: {
        wellLength() {
            return projectTree.getWells().length;
        },
        boundaryLength() {
            return projectTree.getBoundarys().length;
        },
        zmapLength() {
            return projectTree.getZMaps().length;
        }
    },
    watch: {
        centerLat() {
            this.map && this.map.updateCenter({lat: this.centerLat});
            this.map.doDraw();
        },
        centerLng() {
            this.map && this.map.updateCenter({lng: this.centerLng});
            this.map.doDraw();
        },
        scale() {
            this.map && this.map.updateScale(this.scale);
            this.map.doDraw();
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
    },
    mounted() {
        this.$nextTick(() => {
            this.map = new Map(this.$refs.drawCanvas, this.drawWidth, this.drawHeight, 100, {lat: 0, lng: 0});
            const graticule = geoGraticule10();
            this.map.addObject('geojson', graticule, {strokeStyle: "#ccc"});

            const landObj = require("./land-med.json");
            landObj.features.forEach(f => {
                this.map.addObject('geojson', f, {strokeStyle: "#000"});
            })
            // this.map.addObject('geojson', landObj, {strokeStyle: "#000"});

            this.map.doDraw();
        })
    }
}

export default component;
