import Vue from 'vue';
import "./style.less";

const resizableItem = Vue.directive('resizable-item', {
    bind: function(el, binding, vnode) {
        el.classList.add('resize-item');

        const handle = document.createElement('div');
        handle.classList.add('resize-handle');
        el.prepend(handle);
        if (binding.modifiers.disable) {
            handle.classList.add("resize-handle-disable")
        }
        // console.log(binding)

        setTimeout(() => {
            const isVertical = el.parentElement.classList.contains('resize-vertical');

            // init default size
            if (binding.value && isFinite(binding.value.defaultSize)) {
                el.style[isVertical ? "height":"width"] = `${binding.value.defaultSize}px`
            }

            const style = window.getComputedStyle(el);
            handle.draggable = true;
            handle.ondragstart = function (event) {
                // console.log("drag start");
            }
            handle.ondrag = (event) => {
                // console.log("dragging");
                if (Math.random() < 0.2) {
                    requestAnimationFrame(() => {
                        console.log("Hmm", event.offsetX, event.offsetY);
                        if (!event || !event.offsetX || !event.offsetY) {
                            return;
                        }
                        if (isVertical) {
                            const height = parseInt(style.getPropertyValue('height'));
                            el.style.height = `${height + event.offsetY}px`;
                        } else {
                            const width = parseInt(style.getPropertyValue('width'));
                            el.style.width = `${width + event.offsetX}px`;
                        }

                    });
                }
            }
            handle.ondragend = function (event) {
                // console.log("drag end", event.offsetX);
                requestAnimationFrame(() => {
                    if (isVertical) {
                        const height = parseInt(style.getPropertyValue('height'));
                        el.style.height = `${height + event.offsetY}px`;
                    } else {
                        const width = parseInt(style.getPropertyValue('width'));
                        el.style.width = `${width + event.offsetX}px`;
                    }
                });
            }
        })
    }
})
const resizableContainer = Vue.directive('resizable-container', {
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

export default {
    resizableContainer,
    resizableItem
}