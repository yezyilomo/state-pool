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


test('should create `age` state with the given default value', () => {
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




// Test PERSIST_ENTIRE_STORE = True

const store2 = createStore();

let storage2: {count?: number, age?: number, weight?: number} = {
    "count": 10  // Pre-set count state to storage2
}

store2.persist({
    PERSIST_ENTIRE_STORE: true,
    saveState: (key, value) => {
        storage2[key] = value;
    },
    loadState: (key, noState) => {
        if (storage2.hasOwnProperty(key)) {
            return storage2[key]
        }
        return noState;
    },
    removeState: (key) => {
        delete storage2[key];
    },
    clear: () => {
        storage2 = {};  // Clear a store2
    }
})

store2.setState("count", 0);
store2.setState("weight", 50, {persist: false})  // Won't save this to permanent storage

test('should update count', () => {
    const { result } = renderHook(() => store2.useState("count"))

    act(() => {
        result.current[1](count => count + 1)  // Will use the value from storage2 instead of 0
    })

    expect(result.current[0]).toStrictEqual(11)
})


test('should not save weight to storage2', () => {
    const { result } = renderHook(() => store2.useState("weight"))

    act(() => {
        result.current[1](55)
    })

    expect(result.current[0]).toStrictEqual(55)
    expect(storage2.weight).toStrictEqual(undefined);
})


test('should create `age` state with the given default value', () => {
    const { result } = renderHook(() => store2.useState("age", {default: 18}));

    // age state will be saved to a store2
    expect(storage2.age).toStrictEqual(18);

    act(() => {
        result.current[1](age => age + 2);  // Will use the default value 18
    })

    expect(result.current[0]).toStrictEqual(20);
    expect(storage2.age).toStrictEqual(20);
})
