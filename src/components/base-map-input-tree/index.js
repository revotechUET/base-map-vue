import template from "./template.html";
import "./style.less";
import * as apiService from "../../services/apiService";

const component =  {
    props: [ ],
    template,
    inject: [],
    data: function() {
        return {
            tree: [ ]
        };
    },
    watch: {},
    methods: {
        getLabel: (node) => node.name,
        getIcon: () => ""
    },
    mounted() {
        this.$nextTick(async() => {
        })
    }
}

export default component;