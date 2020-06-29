import shp from "shpjs";

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
                            projectTree.addZMaps([{
                                name: fileName,
                                data
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

                                    projectTree.addBoundarys([
                                        {
                                            name: file.name,
                                            file,
                                            data: geojson
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

const project = [
    {
        name: "Project", children: tree, '$meta': {expanded: true}
    }
];
const projectTree = {
    tree, project,
    addWells: function(wells = []) {
        mergeArray(this.tree.find(n => n.name == WELL).children, wells, (w1,w2) => w1 == w2);
    },
    addZMaps: function(zmaps = []) {
        mergeArray(this.tree.find(n => n.name == ZMAP).children, zmaps, (z1,z2) => z1 == z2);
    },
    addBoundarys: function(boundarys = []) {
        mergeArray(this.tree.find(n => n.name == BOUNDARY).children, boundarys, (b1,b2) => b1 == b2);
    },
    clearProject: function() {
        this.tree.find(n => n.name == WELL).children.length = 0;
        this.tree.find(n => n.name == ZMAP).children.length = 0;
        this.tree.find(n => n.name == BOUNDARY).children.length = 0;
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