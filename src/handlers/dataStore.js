const store = {};
function genID() {
    return Math.random().toString(36).substr(2, 9);
}
export default {
    storeData: function(object) {
        const id = genID();
        store[id] = object;
        return id;
    },
    getData: function(id) {
        return store[id];
    },
    flushStore: function() {
        for(const k in store) {
            delete store[k];
        }
    }
}