import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useState, createState } from '../src/';


const count = createState(0);

test('should update count', () => {
    const { result } = renderHook(() => useState(count))

    act(() => {
        result.current[1](count => ++count)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('should set count', () => {
    const { result } = renderHook(() => useState(count))

    act(() => {
        result.current[1](5)
    })

    expect(result.current[0]).toStrictEqual(5)
})



const user = createState<{ name: string, age: number }>({ name: "Yezy", age: 20 });

test('should update name', () => {
    const selector = (user) => user.name;
    const patcher = (user, name) => { user.name = name }

    const { result } = renderHook(() => useState(user, { selector, patcher }))

    act(() => {
        result.current[1]((name) => "Yezy Ilomo")
    })

    expect(result.current[0]).toStrictEqual("Yezy Ilomo")
})


test('should set name', () => {
    // If you specify the type of what you're selecting & patcher it'll automatically know what to return
    const selector = (user) => user.name;
    const patcher = (user, name) => { user.name = name }

    const { result } = renderHook(() => useState(user, { selector, patcher }))

    act(() => {
        result.current[1]("Ilomo Yezy")
    })

    expect(result.current[0]).toStrictEqual("Ilomo Yezy")
})


test('should update name without patcher', () => {
    const selector = (user) => user.name;

    const { result } = renderHook(() => user.useState({ selector }))

    act(() => {
        result.current[2]((usr) => { usr.name = "Ilomo" })
    })

    expect(result.current[0]).toStrictEqual("Ilomo")
})


test('Test local state: should update count', () => {
    const { result } = renderHook(() => useState(0))

    act(() => {
        result.current[1](count => ++count)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('Test local state: should set name', () => {
    // If you specify the type of what you're selecting & patcher it'll automatically know what to return
    const selector = (user) => user.name;
    const patcher = (user, name) => { user.name = name }

    const { result } = renderHook(() => useState({ name: "Yezy", age: 27 }, { selector, patcher }))

    act(() => {
        result.current[1]("Ilomo Yezy")
    })

    expect(result.current[0]).toStrictEqual("Ilomo Yezy")
})


test('Test local state with state initializer: should update count', () => {
    const { result } = renderHook(() => useState(() => 0))

    act(() => {
        result.current[1](count => ++count)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('Should return state object as the last item in array', () => {
    const { result } = renderHook(() => useState(0))

    act(() => {
        result.current[1](count => ++count)
    })

    expect(result.current[3].getValue()).toStrictEqual(1)
})


