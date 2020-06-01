import Vue from 'vue';
import "./style.less";

Vue.directive('resizable-item', {
    bind: function(el, binding, vnode) {
        el.classList.add('resize-item');

        const handle = document.createElement('div');
        handle.classList.add('resize-handle');
        el.prepend(handle);
        if (binding.modifiers.disable) {
            handle.classList.add("resize-handle-disable")
        }

        const style = window.getComputedStyle(el);

        handle.draggable = true;
        handle.ondragstart = function(event) {
            console.log("drag start");
        }
        handle.ondrag = function(event) {
            console.log("dragging");
        }
        handle.ondragend = function(event) {
            console.log("drag end", event.offsetX);
            const width = parseInt(style.getPropertyValue('width'));
            el.style.width = `${width + event.offsetX}px`;
        }
    }
})

export default Vue.directive('resizable-container', {
    bind: function(el, binding, vnode) {
        el.classList.add("resize-container");
        if (binding.modifiers.horizontal) {
            el.classList.add("resize-horizontal");
            for(const cEle of el.children) {
                cEle.querySelector('div>.resize-handle').classList.add('resize-handle-horizontal');
            }
        }
        else if (binding.modifiers.vertical) {
            el.classList.add("resize-vertical");
            for(const cEle of el.children) {
                cEle.querySelector('div>.resize-handle').classList.add('resize-handle-vertical');
            }
        }
    }
})