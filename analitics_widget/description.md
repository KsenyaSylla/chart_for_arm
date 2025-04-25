# Работа виджета аналитики

*Widget.vue* - это шаблон для виджета аналитики. Верстка и стилизация при помощи фреймворка [tailwind.css](https://tailwindcss.com/). Сверстан 1 экземпляр, который рендерится в нужном количестве с помощью цикла *v-for*, отталкиваясь от количества параметров, которые нужно отобразить. (Думаю, можно еще меньше сделать компонент, а каждый экземпляр - отдельный компонент).

Разбит на компоненты:

* Title.vue - название виджета
* PropertyArticle.vue - отображение одного параметра аналитики (например "обработанных роботом"). Дочерний компонент - AreaChart.vue - график. Использованная библиотека [apexcharts](https://apexcharts.com/) и [vue-apexcharts](https://apexcharts.com/docs/vue-charts/)

## для сборки компонента PropertyArticle

Данный компонент отвечает за рендер аналитики одного показателя/параметра
Для корректного отображения требуется передавать:

* propertyLabel, тип данных String, отвечает за отображение названия параметра аналитики
* absolute, тип данных Number, отвечает за абсолютное числовое значение параметра анилитики
* relative, тип данных Number, отвечает за относительное числовое значение парамента аналитики

## Для работы графика

AreaChart - компонент для отрисовки графика, в который передаются обязательные пропсы:

* name, тип данных String - название показателя
* forChart, тип данных Object, пары ключ-значение, где key - это шаг по оси "х", а value - это значение параметра, связанное с key.

## Для подключения к NATS по WSS

const accessNATS - получает данные для подключения к NATS. Обязательные поля:

* URL - url для подключения;
* organization - названии компании - название KV хранилища в NATS;
* user - пользователь;
* pass - пароль;
* project - название проекта - ключ в KV хранилище

Подключение к NATS по WSS посмотреть  [здесь](https://github.com/nats-io/nats.ws)

Подробнее про KV Store  [тут](https://docs.nats.io/nats-concepts/jetstream/key-value-store)

Подписка и получение изменений в режиме реального времени [тут](https://github.com/nats-io/nats.deno/blob/main/jetstream.md), смотреть почти в самом низу страницы.

const countDataToShow - количество отображаемых параметров (по умолчанию - 4)

const dataFromNATS - все данные, полученные из NATS, оборачиваем в ref() для реактивности

## Еще по работе графика

Константа, отвечающая за отрисовку графика - dataForAreaChart, тип Object

* {
  series: [{

    name: name, - что отображаем, показатель. Передается через пропсы

    data: data, - массив значений, полученных из NATS, передается через пропсы

    color: "#1A56DB", - цвет графика

  }],

  options: {

    chart: {

      height: "100%",

      maxWidth: "100%",

      type: "area",

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

      categories: categories, - название категорий по оси Х
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