function makeDialogFromComponent(component) {
    return async function (bindings) {
        return new Promise((resolve, reject) => {
            this.$modal.show(component, {
                ...bindings
            }, {
                adaptive: true,
                draggable: true,
                resizable: true,
                scrollable: true,
                height: 'auto',
                clickToClose: false
            }, {
                'closed': (event) => resolve(event)
            })
        })
    }
}

export { makeDialogFromComponent as default };
