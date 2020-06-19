const WELL = 0;
const ZMAP = 1;
const BOUNDARY = 2;

const mergeArray = function (originArr, newArr, equalFn) {
    for (const item of newArr) {
        const idx = originArr.findIndex(_item => equalFn(_item, item));
        if (idx < 0) {
            originArr.push(item);
        }
    }
};
const tree = [
    { name: "Wells", children: [] },
    { name: "Z-Map", children: [] },
    { name: "Boundary", children: [] }
];

const project = [
    {
        name: "Project", children: tree, '$meta': {expanded: true}
    }
];
const projectTree = {
    tree, project,
    addWells: function(wells = []) {
        mergeArray(this.tree[WELL].children, wells, (w1,w2) => w1 == w2);
    },
    addZMaps: function(zmaps = []) {
        mergeArray(this.tree[ZMAP].children, zmaps, (z1,z2) => z1 == z2);
    },
    addBoundarys: function(boundarys = []) {
        mergeArray(this.tree[BOUNDARY].children, boundarys, (b1,b2) => b1 == b2);
    },
    clearProject: function() {
        this.tree[WELL].children.length = 0;
        this.tree[ZMAP].children.length = 0;
        this.tree[BOUNDARY].children.length = 0;
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