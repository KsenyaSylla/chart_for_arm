<script setup>
import {ref, watch} from "vue"
import apexchart from "vue3-apexcharts"
const props = defineProps({
  name: {String, required: true},
  forChart: {Object, required: true}
});

let dataForAreaChart = ref();

watch(props, v => {
  dataForAreaChart = getDataForAreaChart(props)
}, { immediate: true });


function getDataForAreaChart(props) {

  const name = props.name;
  const forChart = props.forChart;
  const data = Object.values(forChart);// массив значений forChart
  const categories = Object.keys(forChart);// массив ключей forChart

  return {
    series: [{
      name: name,
      data: data,
      color: "#1A56DB",
    }],
    options: {
      chart: {
        height: "100%",
        maxWidth: "100%",
        //type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    }
  }
}


</script>

<template>
  <div id="chart">
    <apexchart type="area" height="350" :options="dataForAreaChart.options" :series="dataForAreaChart.series">
    </apexchart>
  </div>
</template>