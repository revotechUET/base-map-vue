import Vue from 'vue';
import {Fragment} from 'vue-fragment';
/*
import VScene from '../../plot-toolkit-2/src/v-scene';
import VCartersian from '../../plot-toolkit-2/src/v-cartersian';
import VViewport from '../../plot-toolkit-2/src/v-viewport';
*/

import {VScene, VCartersian, VViewport} from 'plot-toolkit-2';

// import Plugin from "plot-toolkit-2";
// Vue.use(Plugin);

new Vue({
    el: '#vue-app',
    template: `
        <v-scene :view-width="800" :view-height="600" :transparent="true">
            <v-viewport :view-pos-x="30" :view-pos-y="30" :viewport-width="500" :viewport-height="300"
                :view-width="500" :view-height="400" pan="y" line-color="rgba(0,0,255,0.5)" :line-width="3"> 
                <v-cartersian :view-width="500" :view-height="400"
                    :enabled="true" :draggable="false"
                    :fill-color="0xFFFFFF" :line-width="1" :line-color="0x010101"
                    :real-min-x="0.1" :real-max-x="1500"
                    :real-min-y="30" :real-max-y="130" x-transform="loga" y-transform="linear"
                    :major-ticks-y="5" :minor-ticks-y="5" 
                    :grid="true" tick-label-position-x="high" tick-label-position-y="low" tick-precision="1">
                </v-cartersian>
            </v-viewport>
        </v-scene>
    `,
    components: { VScene, VCartersian, Fragment, VViewport }
});
