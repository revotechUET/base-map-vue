import projectTree from './projectTree';
export default [{
    label: "File",
    show: false, 
    children: [{
        label: "New",
        handler: newProjectButtonClicked
    },{
        label: "Open",
        handler: openProjectButtonClicked
    },{
        label: "Save",
        handler: saveProjectButtonClicked
    }]
},{
    label: "Import",
    show: false, 
    children: [{
        label: "Wells",
        handler: function() {
            console.log(this);
            projectTree.addWell({name: "DEMO WELL" + Math.round(Math.random() * 100)});
        }
    },{
        label: "ZMap",
        handler: function() {
            console.log(this);
            projectTree.addZMap({name: "DEMO ZMAP" + Math.round(Math.random() * 100)});
        }
    },{
        label: "Boundary",
        handler: function() {
            console.log(this);
            projectTree.addBoundary({name: "DEMO Boundary" + Math.round(Math.random() * 100)});
        }
    }]
},{
    label: "Export",
    show: false, 
    children: [{
        label: "Wells",
        handler: function() {
            console.log(this);
        }
    },{
        label: "ZMap",
        handler: function() {
            console.log(this);
        }
    },{
        label: "Boundary",
        handler: function() {
            console.log(this);
        }
    }]
}]

function newProjectButtonClicked() {
    console.log(this);
}

function openProjectButtonClicked() {
    console.log(this);
    this.promptDialog({
        title: "Edit props",
        inputs: [
            {type: 'text', label: "Props 1", getValue: () => 1}
        ],
        buttons: [
            {label:"Cancel", handler: (close) => close()},
            {label:"OK", handler: (close) => close()},
        ]
    })
}

function saveProjectButtonClicked() {
    console.log(this);
}