<script setup>
import { ref, inject, onMounted } from 'vue';
import Title from './Title.vue';
import PropertyArticle from './PropertyArticle.vue';
import { start } from '../utils/nats.js'


//переменная, заменяющая пришедшие из натс данные
 const testData = {
     "a-night-at-the-opera":
         { "all-chats": { "label": "Обработанных ботом", "absolute": 37202, "relative": 33.1 }, "chats-processed": { "label": "Обработанных ботом и оператором", "absolute": 20238, "relative": 18.01 }, "chats-unassigned": { "label": "Потерянных на операторе", "absolute": 371, "relative": 0.33 }, "chats-lost-by-operator": { "label": "Определено тематик", "absolute": 46402, "relative": 24.16 } },
     "the-game":
         { "all-chats": { "label": "Все диалоги", "absolute": "56", "relative": "95" }, "chats-processed": { "label": "Диалоги, обработанные ботом и оператором", "absolute": "34", "relative": "15" }, "chats-unassigned": { "label": "Диалоги, неназначенные оператору", "absolute": "4", "relative": "1" }, "chats-lost-by-operator": { "label": "Диалоги, пропущенные оператором", "absolute": "1", "relative": "0.05" } }
 };
const columns = {
    "1": "grid",
    "2": "grid grid-cols-2",
    "3": "grid grid-cols-3",
    "4": "grid grid-cols-4"
};


const widgetDataTEST = inject('widgetData').widgetData;
//console.log(widgetDataTEST);

//в эту переменную надо будет передавать данные для отображения компиляции необходимого виджета из JSON извне
const widgetData = {
    title: widgetDataTEST.widgetData.title,
    countDataToShow: widgetDataTEST.widgetData.countDataToShow,
    chartType: widgetDataTEST.widgetData.chartType,
    columns: columns
}
//console.log(widgetData);

//const accessNATS = { ...widgetDataTEST.accessNATS }
//console.log(accessNATS);
const countDataToShow = widgetData.countDataToShow; //количество необходимых строк для отображения.
const reconnectDelay = 5000; //пауза перед попыткой реконнекта после ошибки при подключении к NATS
const dataFromNATS = ref([]);
let generalError = ref(false);
let cannotConnect = ref(false);
let inlvalidProject = ref(true); // проверка на правильное имя проекта
const invalidProjectText = "ошибка в названии проекта"; // назвние проекта = ключ в хранилище, ошибка в acsessNats.project
let deletedValue = ref(false); //корректо не срабатывает
const deletedValueText = "все данные по проекту удалены";
let invalidJSON = ref(false); // проверка на валидность JSON
const invalidJSONtext = "ошибка в JSON";

let resievedData = testData["a-night-at-the-opera"];
//console.log(resievedData);
if (dataFromNATS.value.length < countDataToShow) {
    for (let key in resievedData) {
        dataFromNATS.value.push(resievedData[key]);
    }
}

generalError.value = false;
cannotConnect.value = false;
inlvalidProject.value = false;
deletedValue.value = false;
invalidJSON.value = false;

//цикл для тестовой передачи данных в дочерний компонент через пропсы из цикла v-for, который берет данные из ref-переменной
 for (let i = 0; i < dataFromNATS.value.length; i++) {
     dataFromNATS.value[i].forChart = {
         '01 February': 6500,
         '02 February': 6418,
         '03 February': 6456,
         '04 February': 6526,
         '05 February': 7456,
     }
 }

/* onMounted(() => {
    start(accessNATS, dataFromNATS);
}); */
</script>

<template>
    <div class="container"> <!--такой класс отвечает как раз за размер компонента-->
        <Title :title="widgetData.title"></Title>
        <section class="widget"
            v-show="!inlvalidProject && !invalidJSON && !deletedValue && !cannotConnect && !generalError">
            <div :class="widgetData.columns[2]">
                <!--Реализовать изменяемое количество колонок в зависимости от виджета-->
                <PropertyArticle v-for="item in dataFromNATS" :key="item.label" :propertyLabel="item.label"
                    :absolute="item.absolute" :relative="item.relative" :forChart="item.forChart"
                    :chartType="widgetData.chartType">
                </PropertyArticle>
            </div>
        </section>
        <h2 class="title__error" v-show="generalError">error</h2>
        <h2 class="title__error" v-show="cannotConnect">cannot connect </h2>
        <h2 class="title__error" v-show="inlvalidProject">{{ invalidProjectText }}</h2>
        <h2 class="title__error" v-show="invalidJSON">{{ invalidJSONtext }}</h2>
        <h2 class="title__error" v-show="deletedValue">{{ deletedValueText }}</h2>
    </div>
</template>