<script setup>
import {ref, watch} from "vue"
import apexchart from "vue3-apexcharts"
const props = defineProps({
    //name: String,
    forChart: Object,
});

let dataForBarChart = ref();

watch(props, v => {
    dataForBarChart = getDataForBarChart(props)
}, { immediate: true });


function getDataForBarChart(props) {

    //const name = props.name;
    const forChart = props.forChart;
    const data = Object.values(forChart);// массив значений forChart
    const categories = Object.keys(forChart);// массив ключей forChart

    return {

        series: [{
            data: data
        }],
        options: {
            chart: {
                type: 'bar',
                height: 380
            },
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom'
                    },
                }
            },
            colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
                '#f48024', '#69d2e7'
            ],
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            xaxis: {
                categories: categories,
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            /*  title: {
                 text: name,
                 align: 'center',
                 floating: true
             }, */
            /* subtitle: {
                text: 'Category Names as DataLabels inside bars',
                align: 'center',
            }, */
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            }
        }
    }
}
</script>

<template>
    <div id="chart">
        <apexchart type="bar" height="380" :options="dataForBarChart.options" :series="dataForBarChart.series"></apexchart>
    </div>
</template>