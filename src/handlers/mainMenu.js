import projectTree from './projectTree';
export default [{
    label: "File",
    show: false, 
    children: [{
        label: "New",
        handler: function() {
            printFn(this);
        }
    },{
        label: "Open",
        handler: function() {
            printFn(this);
        }
    },{
        label: "Save",
        handler: function() {
            printFn(this);
        }
    }]
},{
    label: "Import",
    show: false, 
    children: [{
        label: "Wells",
        handler: function() {
            printFn(this);
            projectTree.addWell({name: "DEMO WELL" + Math.round(Math.random() * 100)});
        }
    },{
        label: "ZMap",
        handler: function() {
            printFn(this);
            projectTree.addZMap({name: "DEMO ZMAP" + Math.round(Math.random() * 100)});
        }
    },{
        label: "Boundary",
        handler: function() {
            printFn(this);
            projectTree.addBoundary({name: "DEMO Boundary" + Math.round(Math.random() * 100)});
        }
    }]
},{
    label: "Export",
    show: false, 
    children: [{
        label: "Wells",
        handler: function() {
            printFn(this);
        }
    },{
        label: "ZMap",
        handler: function() {
            printFn(this);
        }
    },{
        label: "Boundary",
        handler: function() {
            printFn(this);
        }
    }]
}]

function printFn(obj) {
    console.log(obj.label);
}