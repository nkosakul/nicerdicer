import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TheDice from '../TheDice.vue'

describe('dice', () => {
  it('randomize int', () => {
    const wrapper = mount(TheDice)

    const value = wrapper.vm.randomize()

    expect(value).toBeTypeOf('number')
    expect(value).toBeGreaterThanOrEqual(1)
    expect(value).toBeLessThanOrEqual(6)
  })
  it('roll once', () => {
    const wrapper = mount(TheDice)

    const value = wrapper.vm.roll()
    const value2 = wrapper.vm.roll()

    expect(value).toEqual(value2)
  })
})
