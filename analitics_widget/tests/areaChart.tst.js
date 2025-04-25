import { shallowMount } from '@vue/test-utils'
import { test, expect } from "vitest"
import AreaChart from '../src/components/AreaChart.vue'

test('chart is rendering', () => {
    const wrapper = shallowMount(AreaChart, {
        props: {
            name: "Обработанных ботом",
            forChart: {
                '01 February': 6500,
                '02 February': 6418,
                '03 February': 6456,
                '04 February': 6526,
                '05 February': 6536,
            }
        }
    });
    console.log("areaChart element is -> ", wrapper.find("[type='area']").html());
    expect(wrapper.get("[type='area']")).toBeTruthy();
})