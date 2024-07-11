<script setup>
import { ref } from 'vue'

const testData = {
  'Обработанных ботом': {
    'абсолютное значение': 37202,
    'относительное значение': 33.1
  },
  'Обработанных ботом и оператором': {
    'абсолютное значение': 20238,
    'относительное значение': 18.01
  },
  'Потерянных на операторе': {
    'абсолютное значение': 371,
    'относительное значение': 0.33
  },
  'Определено тематик': {
    'абсолютное значение': 46402,
    'относительное значение': 24.16
  }
}

const data = ref(testData)
console.log(data.value['Обработанных ботом'])
</script>

<template>
  <DialogSumSimple>
    <div class="container">
      <h2 class="title">Количество диалогов</h2>
      <!--структура под таблицу, rows = 4, column = 3, можно попробовать фигачить через v-for,
      например-->
      <article class="dialogSum">
        <div class="sumTitle">sumTitle</div>
        <div class="absolutSum">absoluteSum</div>
        <div class="relativeSum">relativeSum</div>
        <div class="sumTitle">sumTitle</div>
        <div class="absolutSum">absoluteSum</div>
        <div class="relativeSum">relativeSum</div>
        <div class="sumTitle">sumTitle</div>
        <div class="absolutSum">absoluteSum</div>
        <div class="relativeSum">relativeSum</div>
        <div class="sumTitle">sumTitle</div>
        <div class="absolutSum">absoluteSum</div>
        <div class="relativeSum">relativeSum</div>
      </article>
    </div>
  </DialogSumSimple>
</template>

<style scoped lang="scss">
.container {
  width: 50%;
  border: 1px solid grey;
  border-radius: 5px;
  -webkit-box-shadow: -4px 4px 8px 0px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: -4px 4px 8px 0px rgba(0, 0, 0, 0.2);
  box-shadow: -4px 4px 8px 0px rgba(0, 0, 0, 0.2);
  .title {
    text-align: center;
  }
  .dialogSum {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    .sumTitle,
    .absolutSum,
    .relativeSum {
      padding: 0.5em;
    }
  }
}
</style>
