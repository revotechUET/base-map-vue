import infoDialogComponent from './info-dialog';
import makeDialogFromComponent from "./utils";

const dialogFeature = {
    methods: {
        infoDialog: makeDialogFromComponent(infoDialogComponent)
    }
}
export default function(baseComponent) {
    return baseComponent.extend(dialogFeature);
}