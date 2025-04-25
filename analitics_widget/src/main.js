import { createApp } from 'vue'
import App from './App.vue'
import VueApexCharts from "vue3-apexcharts";
import './index.css'

export default class WidgetConstructor {
    constructor(targetElId, widgetData) {
        this.target = document.querySelector(targetElId)
        this.app = createApp(App, widgetData).use(VueApexCharts);
        this.vm = this.app.mount(this.target);
        this.target.classifier = this
    }

    destroy() {
        if (this.app && this.vm) {
            this.app.unmount();
            this.vm = null;
            this.app = null;
        }
    }

    findById(id) {
        return this.target.querySelector(`[data-key="${id}"]`)
    }
}