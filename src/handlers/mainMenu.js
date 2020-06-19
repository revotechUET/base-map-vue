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
            projectTree.addWells([{name: "DEMO WELL" + Math.round(Math.random() * 100)}]);
        }
    },{
        label: "ZMap",
        handler: function() {
            console.log(this);
            projectTree.addZMaps([{name: "DEMO ZMAP" + Math.round(Math.random() * 100)}]);
        }
    },{
        label: "Boundary",
        handler: function() {
            console.log(this);
            projectTree.addBoundarys([{name: "DEMO Boundary" + Math.round(Math.random() * 100)}]);
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
    const properties = {
        name: "New Project"
    };
    this.promptDialog({
        title: "New Project",
        inputs: [
            {
                type: 'text',
                label: "Project Name",
                params: properties,
                getValue: (params) => params.name,
                setValue: (params, temp) => {
                    params.name = temp
                }
            }
        ],
        buttons: [
            {label:"Cancel", handler: (close) => close()},
            {label:"OK", handler: (close) => {
                projectTree.changeProject({
                    name: properties.name,
                })
                close();
            }},
        ]
    }).then(msg => {
        console.log(msg);
    })
}

function openProjectButtonClicked() {
    console.log(this);
    this.promptDialog({
        title: "Select Project",
        inputs: [
            {type: 'select', label: "Project"}
        ],
        buttons: [
            {label:"Cancel", handler: (close) => close()},
            {label:"OK", handler: (close) => close()},
        ]
    })
}

function saveProjectButtonClicked() {
    console.log(this);
    this.promptDialog({
        title: "Save Project",
        inputs: [
            {type: 'text', label: "Project Name", getValue: () => 'text'}
        ],
        buttons: [
            {label:"Cancel", handler: (close) => close()},
            {label:"OK", handler: (close) => close()},
        ]
    })
}