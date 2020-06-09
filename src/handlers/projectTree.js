const WELL = 0;
const ZMAP = 1;
const BOUNDARY = 2;
export default {
    tree: [
        { name: "Wells", children: [] },
        { name: "Z-Map", children: [] },
        { name: "Boundary", children: [] }
    ],
    mergeArray: function(originArr, newArr, equalFn) {
        for (const item of newArr) {
            const idx = originArr.findIndex(_item => equalFn(_item, item));
            if (idx < 0) {
                originArr.push(item);
            }
        }
    },
    addWells: function(wells) {
        this.mergeArray(this.tree[WELL].children, wells, (w1,w2) => w1.idWell == w2.idWell);
    },
    addZMaps: function(zmaps) {
        this.mergeArray(this.tree[ZMAP].children, zmaps, (z1,z2) => z1 == z2);
    },
    addBoundarys: function(boundarys) {
        this.mergeArray(this.tree[BOUNDARY].children, boundarys, (b1,b2) => b1 == b2);
    },
}