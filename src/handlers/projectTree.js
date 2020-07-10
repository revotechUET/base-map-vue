import shp from "shpjs";
import dataStore from "./dataStore";

const WELL = "Wells";
const ZMAP = "Z-Map";
const BOUNDARY = "Boundary";

const mergeArray = function (originArr, newArr, equalFn) {
    for (const item of newArr) {
        const idx = originArr.findIndex(_item => equalFn(_item, item));
        if (idx < 0) {
            originArr.push(item);
        }
    }
};

const wellNodeContextMenu = [
    {
        label: "Import Wells", handler: function (close) {
            const vueComponent = this;
            close();
            if (vueComponent.importWellDialog) {
                vueComponent.importWellDialog({
                    onLoadWells: function(wells) {
                        console.log(wells);
                        projectTree.addWells(wells);
                    }
                })
            }
        }
    }
];

const zmapNodeContextMenu = [
    {
        label: "Import Zmap", handler: function (close) {
            const vueComponent = this;
            close();
            if (vueComponent.importZmapDialog) {
                vueComponent.importZmapDialog({
                    onLoadData: function(data) {
                        console.log("DATA LOADED", data);
                        const file = data.file;
                        if (file) {
                            const fileName = file.name;
                            const dataStoreId = dataStore.storeData(data);
                            projectTree.addZMaps([{
                                name: fileName,
                                dataStoreId
                            }])
                        }
                    }
                })
            }
        }
    }
];

const boundaryNodeContextMenu = [
    {
        label: "Import Boundary", handler: function (close) {
            const vueComponent = this;
            close();
            if (vueComponent.promptDialog) {
                vueComponent.importFileDialog({
                    onLoadFile: function(file) {
                        console.log("File loaded", file);

                        const reader = new FileReader();
                        reader.onload = function(event) {
                            shp(event.target.result)
                                .then(geojson => {
                                    console.log("loaded geojson", geojson);

                                    const dataStoreId = dataStore.storeData(geojson);
                                    projectTree.addBoundarys([
                                        {
                                            name: file.name,
                                            file,
                                            dataStoreId
                                        }
                                    ])
                                });
                        }
                        reader.readAsArrayBuffer(file);
                    }
                })
            }
        }
    }
];

const tree = [
    {
        name: WELL,
        children: [],
        contextMenu: wellNodeContextMenu
    },
    {
        name: ZMAP,
        children: [],
        contextMenu: zmapNodeContextMenu
    },
    {
        name: BOUNDARY,
        children: [],
        contextMenu: boundaryNodeContextMenu
    }
];

function toTreeConfig(arr, type) {
    arr.forEach(item => {
        item.show = false;
        item.type = type;
        item.onClick = function() {
            this.show = !this.show;
        }
    })
    return arr;
}

const project = [
    {
        name: "Project", children: tree, '$meta': {expanded: true}
    }
];
const projectTree = {
    tree, project,
    getWells: function(showOnly = false) {
        const result = this.tree.find(n => n.name == WELL).children;
        if (showOnly)
            return result.filter(r => r.show == true);
        return result;
    },
    getZMaps: function(showOnly = false) {
        const result = this.tree.find(n => n.name == ZMAP).children;
        if (showOnly)
            return result.filter(r => r.show == true);
        return result;
    },
    getBoundarys: function(showOnly = false) {
        const result = this.tree.find(n => n.name == BOUNDARY).children;
        if (showOnly)
            return result.filter(r => r.show == true);
        return result;
    },
    addWells: function(wells = []) {
        const _wells = toTreeConfig(wells, 'well');
        // mergeArray(this.tree.find(n => n.name == WELL).children, _wells, (w1,w2) => w1 == w2);
        mergeArray(this.getWells(), _wells, (w1,w2) => w1 == w2);
    },
    addZMaps: function(zmaps = []) {
        const _zmaps = toTreeConfig(zmaps, 'zmap');
        // mergeArray(this.tree.find(n => n.name == ZMAP).children, _zmaps, (z1,z2) => z1 == z2);
        mergeArray(this.getZMaps(), _zmaps, (z1,z2) => z1 == z2);
    },
    addBoundarys: function(boundarys = []) {
        const _boundarys = toTreeConfig(boundarys, 'boundary');
        // mergeArray(this.tree.find(n => n.name == BOUNDARY).children, _boundarys, (b1,b2) => b1 == b2);
        mergeArray(this.getBoundarys(), _boundarys, (b1,b2) => b1 == b2);
    },
    clearProject: function() {
        this.tree.find(n => n.name == WELL).children.length = 0;
        this.tree.find(n => n.name == ZMAP).children.length = 0;
        this.tree.find(n => n.name == BOUNDARY).children.length = 0;
        dataStore.flushStore();
    },
    changeProject: function(newProject) {
        this.clearProject();
        this.project[0].name = newProject.name;
        this.addWells(newProject.wells);
        this.addZMaps(newProject.zmaps);
        this.addBoundarys(newProject.boundarys);
    }
}

export default projectTree;
