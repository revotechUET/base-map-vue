import Vue from "vue";
import {Plugin} from "vue-fragment";
import template from "./main.template.html";
import './main.style.less';
import components from "./components";

Vue.use(Plugin);

new Vue({
    el: "#vue-app",
    template, components,
    data: {
        test: "text test"
    },
    methods: { }
});