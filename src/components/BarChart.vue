<template>
  <Bar id="my-chart-id" aria-label="bar chart" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: [
          'Как получить доступ',
          'Проверка статуса изготовления',
          'Как проверить номер очереди',
          'ЗДИ. Не могу заказать питание',
          'Как удалить учетную запись',
          'куда обратиться, если не включили',
          'Отображается ЕПД, которыый уже'
        ],
        datasets: [
          {
            label: 'Использование статьи', //что именно отображается в столбиках
            axis: 'y',
            data: [3385, 2419, 1788, 1780, 1754, 1723, 1716],
            fill: false,
            color: 'rgb(142, 143, 145)',
            backgroundColor: 'rgba(80, 164, 151, 0.2)', //#50a497 - цвет столбиков в примере
            borderColor: 'rgb(80, 164, 151)',
            borderWidth: 1
          }
        ]
      },
      chartOptions: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true
      }
    }
  }
}
</script>
