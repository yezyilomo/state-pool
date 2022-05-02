import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createStore } from '../src/';


const store = createStore();
store.setState("count", 0);

let testVal1 = 0;
let testVal2 = 0;

test('should update testVal1 & testVal2 through subscribers', () => {
    const { result } = renderHook(() => store.useState("count"))

    act(() => {
        store.subscribe((key, value) => {
            testVal1 = 1
        })
        store.getState("count").subscribe((value) => {
            testVal2 = 2
        })
        result.current[1](count => 1)
    })

    expect(testVal1).toStrictEqual(1);
    expect(testVal2).toStrictEqual(2);
})