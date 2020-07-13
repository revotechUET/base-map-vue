import template from "./template.html";
import "./style.less";
import * as _ from "lodash";
import projectTree from "../../handlers/projectTree";
import dataStore from "../../handlers/dataStore";
import proj4 from "proj4";

import {geoMercator, geoPath, geoGraticule10} from "d3-geo";
import {contours} from "d3-contour";
import {range, extent} from "d3-array";
import {zoom} from "d3-zoom";
import {select, event as d3Event} from "d3-selection";

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

    // this.draw = _.debounce(this.drawRaw, 20);
    this.draw = _.throttle(this.drawRaw, 100);

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
    "geojson": MapGeoJson,
    "boundary": MapBoundary,
    "contour": MapContour,
    "axis": MapAxis,
    "map": MapLand
}

function Map(el, width, height, scale = 100, center = {}) {
    const mapInstance = this;

    const events = ["mousemove", "mousedown"];

    events.forEach(eName => {
        el.addEventListener(eName, function(event) {
            const x = event.offsetX;
            const y = event.offsetY;
            mapInstance.drawings.forEach(obj => {
                if (obj.isInside(mapInstance._context, x, y)) {
                    const handler = obj.events[eName];
                    if (handler) {
                        handler.call(obj, mapInstance._context, x, y);
                    }
                } else {
                    const handler = obj.events[`${eName}-outside`];
                    if (handler) {
                        handler.call(obj, mapInstance._context, x, y);
                    }
                }
            })
        })
    })

    const zoomBehavior = zoom()
        .on('zoom', () => {
            onZoom.call(this);
        });

    select(el).call(zoomBehavior);

    function onZoom() {
        const transform = d3Event.transform;

        const newScale = transform.k * 100;
        this.updateScale(newScale);

        const newCenter = {lng: - transform.x * 10 / newScale, lat: transform.y * 10 / newScale};
        this.updateCenter(newCenter);

        this.doDraw();
    }

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

    this.addObject = (type, configs) => {
        const constructor = objectCatalog[type];
        const obj = new constructor(this._projection, this._pathGenerator, configs);
        // register functions
        obj.destroy = removeObjFn(obj);

        Object.keys(configs.events || {}).forEach(eventName => {
            obj.on(eventName, configs.events[eventName]);
        })

        this.drawings.push(obj);
        this._renderer.enqueue.call(obj, obj.draw, [this._context]);
        return obj;
    };

    this.getBoundary = function() {
        return this.drawings.filter(dw => dw instanceof MapBoundary);
    }

    this.getContour = function() {
        return this.drawings.filter(dw => dw instanceof MapContour);
    }

    this.getMap = function() {
        return this.drawings.filter(dw => dw instanceof MapLand);
    }

    function removeObjFn(obj) {
        return function() {
            const idx = mapInstance.drawings.findIndex(dw => dw === obj);
            if (idx >= 0) {
                const dequeueItem = mapInstance.drawings.splice(idx, 1);
                mapInstance._renderer.dequeue((job) => {
                    return job.thisBinding == dequeueItem;
                    // return job.handler === obj.draw;
                });
            }
        }
    }

    this.doDraw = function() {
        this._renderer.draw();
    }
}

function MapObject(projection, pathGenerator) {
    this.projection = projection;
    this.pathGenerator = pathGenerator;

    this.show = true;

    this.hide = () => this.show = false;
    this.toggle = () => this.show = !this.show;
    this.events = {};
}

MapObject.prototype.on = function(event, handler) {
    this.events[event] = handler;
}

MapObject.prototype.draw = function(context) {
    console.warn("not implemented");
}

MapObject.prototype.isInside = function(context, x, y) {
    if (!this.path) return false;
    return context.isPointInPath(this.path, x, y);
}

function MapGeoJson(projection, pathGenerator, options = {}) {
    MapObject.call(this, projection, pathGenerator);
    this.geojson = options.geojson || null;
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

function MapLand(projection, pathGenerator, options = {}) {
    MapGeoJson.call(this, projection, pathGenerator, options);
    this.type = "boundary";
    this.dataStoreId = options.dataStoreId;
}
// extend the MapGeoJson class
MapLand.prototype = Object.create(MapGeoJson.prototype);
MapLand.prototype.constructor = MapLand;

function MapBoundary(projection, pathGenerator, options = {}) {
    MapGeoJson.call(this, projection, pathGenerator, options);
    this.type = "boundary";
    this.dataStoreId = options.dataStoreId;
}
// extend the MapGeoJson class
MapBoundary.prototype = Object.create(MapGeoJson.prototype);
MapBoundary.prototype.constructor = MapBoundary;

function MapContour(projection, pathGenerator, options = {}) {
    MapGeoJson.call(this, projection, pathGenerator, options);
    this.type = "contour";
    this.dataStoreId = options.dataStoreId;
}
// extend the MapGeoJson class
MapContour.prototype = Object.create(MapGeoJson.prototype);
MapContour.prototype.constructor = MapContour;

function MapWell(projection, pathGenerator, options = {}) {
    MapObject.call(this, projection, pathGenerator, options);
    this.type = "well";
}
// extend the MapObject class
MapWell.prototype = Object.create(MapObject.prototype);
MapWell.prototype.constructor = MapWell;
MapWell.prototype.draw = function(context) {
}

function MapAxis(projection, pathGenerator, options) {
    MapObject.call(this, projection, pathGenerator);
    this.type = "axis";
    this.fillStyle = options.fillStyle;
    this.strokeStyle = options.strokeStyle;
}
// extend the MapObject class
MapAxis.prototype = Object.create(MapObject.prototype);
MapAxis.prototype.constructor = MapGeoJson;
MapAxis.prototype.draw = function(context) {
    context.fillStyle = this.fillStyle;
    context.strokeStyle = this.strokeStyle;

    //draw x axis
    context.textAlign = "center";
    context.textBaseline = "top";
    range(-180, 190, 10).forEach(lng => {
        const pos = this.projection([lng, 0]);
        context.fillRect(pos[0]-1, 0, 2, 5);
        context.strokeText(lng, pos[0], 10);
    })
    // draw y axis
    context.textAlign = "left";
    context.textBaseline = "middle";
    range(-90, 100, 10).forEach(lat => {
        const pos = this.projection([0, lat]);
        context.fillRect(0, pos[1]-1, 5, 2);
        context.strokeText(lat, 10, pos[1]);
    })
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
            scale: 100,
            propView: null,
        };
    },
    watch: {
    },
    computed: {
        wellLength() {
            return projectTree.getWells(true).length;
        },
        boundaryLength() {
            return projectTree.getBoundarys(true).length;
        },
        zmapLength() {
            return projectTree.getZMaps(true).length;
        },
        mapLength() {
            return projectTree.getMaps(true).length;
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
        },
        mapLength() {
            const maps = projectTree.getMaps(true);
            this.map.getMap().forEach(m => m.destroy());
            maps.forEach(m => {
                const data = this.getData(m.dataStoreId);
                this.map.addObject('map', {
                    strokeStyle: "#ccc",
                    fillStyle: "rgba(0, 0, 0, 0.5)",
                    geojson: data
                });
            })
            this.map.doDraw();
        },
        boundaryLength() {
            const boundarys = projectTree.getBoundarys(true);
            console.log("boundary changed", boundarys);
            this.map.getBoundary().forEach(b => b.destroy());
            const self = this;
            const mapObj = this.map;
            boundarys.forEach(b => {
                const data = this.getData(b.dataStoreId);
                data.features.forEach(f => {
                    const boundaryConfig = {
                        strokeStyle: "#00ff00",
                        fillStyle: 'rgba(255, 255, 255, 0.5)',
                        geojson: f,
                        events: {
                            "mousedown": function(context, x, y) {
                                this.fillStyle = "#0000ff";
                                self.propView = this.geojson.properties;
                                mapObj.doDraw();
                            },
                            "mousedown-outside": function(context, x, y) {
                                this.fillStyle = 'rgba(255, 255, 255, 0.5)';
                                mapObj.doDraw();
                            }
                        }
                    }
                    const obj = this.map.addObject("boundary", boundaryConfig);
                })
            })
            this.map.doDraw();
        },
        zmapLength () {
            const zmaps = projectTree.getZMaps(true);
            console.log("zmap changed", zmaps);

            const currZmaps = this.map.getContour();

            // delete existed zmap
            currZmaps.forEach(obj => {
                obj.destroy();
            })

            zmaps.forEach((zmap) => {
                const data = this.getData(zmap.dataStoreId);
                console.log(data);

                const headers = data.headers;
                const values = _.flatten(data.values);
                const _extent = extent(values);
                const step = (_extent[1] - _extent[0]) / 10;
                const thresholds = range(_extent[0], _extent[1], step);

                const secondPrj = "+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";
                const firstPrj = "+proj=utm +zone=49 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

                const swUTM = [headers.minX, headers.minY];
                const neUTM = [headers.maxX, headers.maxY];

                const sw = proj4(firstPrj, secondPrj, swUTM);
                const ne = proj4(firstPrj, secondPrj, neUTM);

                const lngScale = (ne[0] - sw[0]) / headers.numOfCols;
                const latScale = (ne[1] - sw[1]) / headers.numOfRows;

                const contourData = contours()
                    .size([headers.numOfCols, headers.numOfRows])
                    .thresholds(thresholds)
                    (values)
                    .map(({type, value, coordinates}) => {
                        return {type, value, coordinates: coordinates.map(rings => {
                            return rings.map(points => {
                            return points.map(([x, y]) => ([
                                sw[0] + x * lngScale,
                                sw[1] + y * latScale 
                            ]));
                            });
                        })};
                    });

                contourData.forEach(cd => {
                    this.map.addObject("contour", {strokeStyle: "#0000ff", geojson: cd});
                })
            })
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

            // land
            /*
            const landObj = require("./land-low.json");
            this.map.addObject('geojson', {strokeStyle: '#000', fillStyle: 'rgba(0, 0, 0, 0.5)', geojson: landObj});
            */

            // graticule
            const graticule = geoGraticule10();
            this.map.addObject('geojson', {strokeStyle: "#ccc", geojson: graticule});

            // axis
            this.map.addObject('axis', {strokeStyle: "#ff0000"});

            this.map.doDraw();
        })
    }
}

export default component;
