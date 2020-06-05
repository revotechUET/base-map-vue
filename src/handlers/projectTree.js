const WELL = 0;
const ZMAP = 1;
const BOUNDARY = 2;
export default {
    tree: [
        { name: "Wells", children: [] },
        { name: "Z-Map", children: [] },
        { name: "Boundary", children: [] }
    ],
    addWell: function(well) {
        this.tree[WELL].children.push(well);
    },
    addZMap: function(zmap) {
        this.tree[ZMAP].children.push(zmap);
    },
    addBoundary: function(boundary) {
        this.tree[BOUNDARY].children.push(boundary);
    },
}