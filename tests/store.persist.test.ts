import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createStore } from '../src/';


const store = createStore();

const storage = {
    "count": 10,
    "age": 26
}

store.persist({
    saveState: (key, value) => {
        storage[key] = value;
    },
    loadState: (key) => {
        return storage[key]
    }
})
store.setState("count", 0, {persist: true});

test('should update count', () => {
    const { result } = renderHook(() => store.useState("count"))

    act(() => {
        result.current[2](count => count + 1)  // Will use the value from storage instead of 0
    })

    expect(result.current[0]).toStrictEqual(11)
})


test('should create `age` global state with the given default value', () => {
    const { result } = renderHook(() => store.useState("age", {default: 18, persist: true}));

    act(() => {
        result.current[2](age => age + 2)  // Will use the value from storage instead of 18
    })

    expect(result.current[0]).toStrictEqual(28)
})
