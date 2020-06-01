import Vue from "vue";
import {Plugin} from "vue-fragment";
import template from "./main.template.html";
import './main.style.less';
import components from "./components";
import services from "./services";
import "./directives";

Vue.use(Plugin);

new Vue({
    el: "#vue-app",
    template, components,
    provide: () => services,
    computed: { },
    data: { },
    methods: { },
});