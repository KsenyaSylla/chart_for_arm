<script setup>
import { ref, watch } from "vue"
import apexchart from "vue3-apexcharts"
const props = defineProps({
    //name: String,
    forChart: Object,
});
let dataForPieChart = ref();

watch(props, v => {
    dataForPieChart = getDataForPieChart(props)
}, { immediate: true });


function getDataForPieChart(props) {

    const forChart = props.forChart;


    return {
        series: Object.values(forChart),// массив значений forChart,
        chartOptions: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: Object.keys(forChart),// массив ключей forChart,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    }
}
</script>
<template>

    <div id="chart">
        <apexchart type="pie" width="380" :options="dataForPieChart.chartOptions" :series="dataForPieChart.series"></apexchart>
    </div>
</template>