import { shallowMount } from '@vue/test-utils'
import { test, expect } from "vitest"
import PieChart from '../src/components/PieChart.vue'

test('chart is rendering', () => {
    const wrapper = shallowMount(PieChart, {
        props: {
            //name: "Обработанных ботом",
            forChart: {
                '01 February': 6500,
                '02 February': 6418,
                '03 February': 6456,
                '04 February': 6526,
                '05 February': 6536,
            }
        }
    })
    console.log("pieChart element is -> ", wrapper.find("[type='pie']").html())
    expect(wrapper.get("[type='pie']")).toBeTruthy(); 
})