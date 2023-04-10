import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createState, useState, createStore } from '../src/';


const count = createState(0);

let testVal1 = 0;

test('should update testVal1 through a subscriber', () => {
    const { result } = renderHook(() => useState(count))

    act(() => {
        count.subscribe((value) => {
            testVal1 = ++testVal1;
        })
        result.current[1](count => 1)
    })

    expect(testVal1).toStrictEqual(1);
})


const user = createState({ name: "Yezy", weight: 65 });

let testVal2 = 0;

test('should increment testVal2 twice through subscribers', () => {
    const { result } = renderHook(() => useState(user))

    act(() => {
        user.select(user => user.weight).subscribe((value) => {
            testVal2 = ++testVal2;
        })

        user.select(user => user.name).subscribe((value) => {
            testVal2 = ++testVal2;
        })

        result.current[2](user => { user.weight = 66; user.name = "Ilomo"; });
    })

    expect(testVal2).toStrictEqual(2);
})


const store = createStore();
store.setState("count", 0);

let testVal3 = 0;

test('should update testVal3 through subscribers', () => {
    const { result } = renderHook(() => store.useState("count"))

    act(() => {
        store.subscribe((key, value) => {
            testVal3 = ++testVal3;
        })
        result.current[1](count => 1)
    })

    expect(testVal3).toStrictEqual(1);
})