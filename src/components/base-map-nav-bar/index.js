import template from "./template.html";
import "./style.less";
const component =  {
    props: [ ],
    template,
    data: function() {
        return {
        };
    },
    watch: {},
    methods: {
        getLabel: (node) => node.name,
        getIcon: () => ""
    },
    mounted() {}
}

export default component;