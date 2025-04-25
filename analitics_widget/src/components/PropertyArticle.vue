<script setup>
import AreaChart from './AreaChart.vue';
import PieChart from './PieChart.vue';
import BarChart from './BarChart.vue';
defineProps({
    propertyLabel: { String, required: true },
    absolute: { Number, required: true },
    relative: { Number, required: true },
    forChart: { Object, required: true },
    chartType: { String, default: "area" }
})
</script>

<template>
    <div>
        <div class="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
            <div class="flex justify-between">
                <div>
                    <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">{{ propertyLabel }}
                    </h5>
                    <p class="text-base font-normal text-gray-500 dark:text-gray-400" id="absolute">{{ absolute }}
                    </p>
                </div>
                <div
                    class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center" id="relative">
                    {{ relative }}
                    <svg class="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 10 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 13V1m0 0L1 5m4-4 4 4" />
                    </svg>
                </div>
            </div>
            <BarChart v-if="chartType == 'bar'" :name="propertyLabel" :forChart="forChart" />
            <PieChart v-if="chartType == 'pie'" :name="propertyLabel" :forChart="forChart" />
            <AreaChart v-if="chartType == 'area'" :name="propertyLabel" :forChart="forChart" />
            <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                <div class="flex justify-between items-center pt-5">
<!--Сделать по умолчанию - сегодня, сохранять данные для отрисовки за каждый час (почасовая статистика) -->
                    <select
                        class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white">
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                    </select>
                    <a href="#"
                        class="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                        Users Report
                        <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 9 4-4-4-4" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>