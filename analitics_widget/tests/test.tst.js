import { mount } from '@vue/test-utils'
import { expect, describe, test, vi, beforeEach } from "vitest"
import PropertyArticle from '../src/components/PropertyArticle.vue'

const mocks = vi.hoisted(() => {
  return {
    AreaChart: vi.fn(),
    PieChart: vi.fn(),
    BarChart: vi.fn()
  }
})
vi.mock('../components/AreaChart.vue', () => {
  return { default: mocks.AreaChart }
})
vi.mock('../components/BarChart.vue', () => {
  return { default: mocks.BarChart }
})
vi.mock('../components/PieChart.vue', () => {
  return { default: mocks.PieChart }
})


describe('PropertyArticle', () => {


  beforeEach(() => {
    mocks.AreaChart.mockClear()
    mocks.BarChart.mockClear()
    mocks.PieChart.mockClear()
  })

  test('check default chartType and not rendering others (v-if is working correct)', () => {
    const wrapper = mount(PropertyArticle, {
      props: {
        propertyLabel: 'Hello World',
        absolute: 100,
        relative: 50,
        forChart: {
          'aaa': 111,
        },
      }
    })
    //проверили, что отрисовает именно те данные, которые мы передали
    expect(wrapper.find('h5').text()).toEqual('Hello World')
    expect(wrapper.find('#absolute').text()).toEqual("100")
    expect(wrapper.find('#relative').text()).toEqual("50")
  })

  test('check default chartType and not rendering others (v-if is working correct)', () => {
    const wrapper = mount(PropertyArticle, {
      props: {
        propertyLabel: 'Hello World',
        absolute: 100,
        relative: 50,
        forChart: {
          'aaa': 111,
        },
      }
    })


    //  console.log(mocks.AreaChart.mock.calls[0][0]);

    //Что по дефолту он отрисовал именно areaChart с переданными нами (в тесте) пропсами, а остальные 2 графика не отрисовал (логика работы v-if)
    expect(mocks.AreaChart).toHaveBeenCalledTimes(1);
    expect(mocks.AreaChart).toHaveBeenCalledWith({
      forChart: { aaa: 111 },
      name: "Hello World",
    },
      null
    );
    expect(mocks.BarChart).toHaveBeenCalledTimes(0);
    expect(mocks.PieChart).toHaveBeenCalledTimes(0);
  })


  test('chartType=bar', () => {
    const wrapper = mount(PropertyArticle, {
      props: {
        propertyLabel: '123',
        absolute: 100,
        relative: 50,
        forChart: {
          'bbb': 222,
        },
        chartType: "bar"
      }
    })
    // отрисовал именно barChart с переданными нами (в тесте) пропсами, а остальные 2 графика не отрисовал (логика работы v-if)
    expect(mocks.BarChart).toHaveBeenCalledTimes(1);
    expect(mocks.BarChart).toHaveBeenCalledWith({
      forChart: { bbb: 222 },
      name: "123",
    },
      null
    );
    expect(mocks.AreaChart).toHaveBeenCalledTimes(0);
    expect(mocks.PieChart).toHaveBeenCalledTimes(0);
  })


  test('chartType=pie and render PieChart', () => {
    const wrapper = mount(PropertyArticle, {
      props: {
        propertyLabel: 'pie-chart',
        absolute: 100,
        relative: 50,
        forChart: {
          'ccc': 333,
        },
        chartType: "pie"
      }
    })
    // отрисовал именно barChart с переданными нами (в тесте) пропсами, а остальные 2 графика не отрисовал (логика работы v-if)
    expect(mocks.PieChart).toHaveBeenCalledTimes(1);
    expect(mocks.PieChart).toHaveBeenCalledWith({
      forChart: { ccc: 333 },
      name: "pie-chart",
    },
      null
    );
    expect(mocks.AreaChart).toHaveBeenCalledTimes(0);
    expect(mocks.BarChart).toHaveBeenCalledTimes(0);
  })
})