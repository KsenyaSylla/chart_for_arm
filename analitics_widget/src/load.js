import WidgetConstructor from "./main.js";
import accessNATS from "./accessNATS.js"
import widgetData from "../widgetData.config.js";

//const widget = new WrapperToAccessNATS('#app', {...accessNATS});
const widget = new WidgetConstructor('#app', {widgetData});

window.widget = widget
window.Widget = widget