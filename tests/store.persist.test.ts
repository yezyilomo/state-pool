import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createStore } from '../src/';


const store = createStore();

let storage: {count?: number, age?: number} = {
    "count": 10  // Pre-set count state to storage
}

store.persist({
    saveState: (key, value) => {
        storage[key] = value;
    },
    loadState: (key, noState) => {
        if (storage.hasOwnProperty(key)) {
            return storage[key]
        }
        return noState;
    },
    removeState: (key) => {
        delete storage[key];
    },
    clear: () => {
        storage = {};  // Clear a store
    }
})

store.setState("count", 0, {persist: true});

test('should update count', () => {
    const { result } = renderHook(() => store.useState("count"))

    act(() => {
        result.current[1](count => count + 1)  // Will use the value from storage instead of 0
    })

    expect(result.current[0]).toStrictEqual(11)
})


test('should create `age` global state with the given default value', () => {
    const { result } = renderHook(() => store.useState("age", {default: 18, persist: true}));

    // age state will be saved to a store
    expect(storage.age).toStrictEqual(18);

    act(() => {
        result.current[1](age => age + 2);  // Will use the default value 18
    })

    expect(result.current[0]).toStrictEqual(20);
    expect(storage.age).toStrictEqual(20);
})


test('should remove count state from store and storage', () => {
    const { result } = renderHook(() => store.useState("count"))

    act(() => {
        store.remove("count", () => {
            store.setState("count", 5, {persist: true});
        });  // This will remove count state from a store and reset it
    })

    expect(result.current[0]).toStrictEqual(5);
    expect(storage.count).toStrictEqual(5);
    expect(storage.age).toStrictEqual(20);
})


test('should clear both store and storage', () => {
    const { result } = renderHook(() => store.useState("count"))

    act(() => {
        store.clear(() => {
            store.setState("count", 10, {persist: true});
        });  // This will clear a store and reset count state
    })

    expect(result.current[0]).toStrictEqual(10);
    expect(storage.count).toStrictEqual(10);
    expect(storage.age).toStrictEqual(undefined);
})
