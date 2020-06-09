import template from './template.html';
import "./style.less";

export default {
    template,
    props: ['title', 'content', 'buttons'],
    methods: {
        buttonClicked: function(handler) {
            handler && handler(() => this.$emit('close'));
        }
    }
}