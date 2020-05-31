import Vue from "vue";
const componentName = "contour-file-import";
const component = {
    props: { },
    data: () => ({ }),
    inject: ['example'],
    computed: {
        test: function() {
            return this.example.test("abc")
        } 
    },
    template: '<div v-green-text>{{test}}</div>',
    mounted() { },
    methods: { },
    watch: { }
}

Vue.component(componentName, component);
export default component;