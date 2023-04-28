import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useReducer, createState } from '../src/';


const count = createState(0);

test('should update count', () => {
    const reducer = (state, action) => action;

    const { result } = renderHook(() => useReducer(reducer, count));

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


const user = createState({ name: "Yezy", age: 20 });

test('should update name', () => {
    const reducer = (state: string, action: string): string => action;

    const selector = (user): string => user.name;
    const patcher = (user, name: string) => { user.name = name }

    const { result } = renderHook(() => useReducer(reducer, user, { selector, patcher }))

    act(() => {
        result.current[1]("Yezy Ilomo")
    })

    expect(result.current[0]).toStrictEqual("Yezy Ilomo")
})


test('Test local state: should update count', () => {
    const reducer = (state, action) => action;

    const { result } = renderHook(() => useReducer(reducer, 0));

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('Test local state: should update name', () => {
    const reducer = (state: string, action: string): string => action;

    const selector = (user): string => user.name;
    const patcher = (user, name: string) => { user.name = name }

    const { result } = renderHook(() => useReducer(reducer, { name: "Yezy", age: 20 }, { selector, patcher }))

    act(() => {
        result.current[1]("Ilomo")
    })

    expect(result.current[0]).toStrictEqual("Ilomo")
})


test('Test local state with state initializer: should update count', () => {
    const reducer = (state, action) => action;

    const { result } = renderHook(() => useReducer(reducer, () => 0));

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('Should return state object as the last item in array', () => {
    const reducer = (state, action) => action;

    const { result } = renderHook(() => useReducer(reducer, 0));

    act(() => {
        result.current[1](1)
    })

    expect(result.current[2].getValue()).toStrictEqual(1)
})