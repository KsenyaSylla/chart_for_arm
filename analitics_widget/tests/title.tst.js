import { shallowMount } from '@vue/test-utils'
import { expect, test} from "vitest"
import Title from '../src/components/Title.vue'

test('Title', () => {
    const wrapper = shallowMount(Title, {
      props: {
          title: 'Hello World'
      }
    })
    console.log("title_component is ->", wrapper.find('h2').html())
    // see if the message renders
    expect(wrapper.find('h2').text()).toEqual('Hello World')
})