/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-16 13:33:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/tests/unit/example.spec.ts
 */
import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(Home, {
      propsData: { msg }
    });
    expect(wrapper.text()).to.include(msg);
  });
});
