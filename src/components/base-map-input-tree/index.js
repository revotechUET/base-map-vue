import template from "./template.html";
import "./style.less";

const component =  {
    props: [ ],
    template,
    inject: ['apiService'],
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
            const proj = await this.apiService.getProject();
            console.log(proj);
        })
    }
}

export default component;