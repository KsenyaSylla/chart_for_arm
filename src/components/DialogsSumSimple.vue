<script setup>
import { ref } from 'vue'
import { connect } from "nats.ws";
// shim the websocket library
globalThis.WebSocket = require("websocket").w3cwebsocket;
//connect = require("nats.ws");

// write some code that runs on the server

// write some code that runs

const testData = [
  {
    "label": 'Обработанных ботом',
    'absolut': 37202,
    'relative': 33.1
  },
  {
    "label": 'Обработанных ботом и оператором',
    'absolut': 20238,
    'relative': 18.01
  },
  {
    "label": 'Потерянных на операторе',
    'absolut': 371,
    'relative': 0.33
  },
  {
    "label": 'Определено тематик',
    'absolut': 46402,
    'relative': 24.16
  }
];

const data = ref(testData)

</script>

<template>
  <div class="container">
    <h2 class="title">Количество диалогов</h2>
    <!--структура под таблицу, rows = 4, column = 3, можно попробовать фигачить через v-for,
      например-->
    <article class="dialogSum">
      <template v-for="item in data" :key="item.label">
        <div class="sumTitle">{{ item.label }}</div>
        <div class="absolutSum">{{ item.absolut }}</div>
        <div class="relativeSum">{{ item.relative }}</div>
      </template>
    </article>
  </div>
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
