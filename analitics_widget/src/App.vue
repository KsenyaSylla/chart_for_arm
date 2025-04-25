<script setup>
import { provide } from "vue";
import Widget from './components/Widget.vue';

const widgetData = defineProps({
  widgetData: {
    type: Object,
    required: true
  }
})

provide('widgetData', {...widgetData})
</script>

<template>
  <Suspense>
    <Widget />
    <template #fallback>
      Loading...<!--сделать страницу загрузки?-->
    </template>
  </Suspense>
</template>
