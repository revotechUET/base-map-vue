import Vue from 'vue';

export default Vue.directive('green-text', {
  bind: function (el, binding, vnode) {
      el.style.color="green";
  }
})