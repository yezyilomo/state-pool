---
sidebar_position: 4
---


# Typing State
All state related functions support implicity and explicity typing 

```ts
store.setState<number>('count', 0);

store.useState<number>('count');

store.useReducer<number>(reducer, 'count');

// For none key based
const count = createGlobalState<number>(0);

useGlobalState<number>(count);

useGlobalStateReducer<number>(reducer, count);


// Typing with selector
store.setState<{name: string, age: number}>('user', {name: 'Yezy', age: 25});

store.useState<string>('user', {selector: user => user.name});
store.useState<number>('age', {selector: user => user.age});

store.useReducer<string>(reducer, 'user', {selector: user => user.name});
store.useReducer<number>(reducer, 'user', {selector: user => user.age});

// For none key based
const user = createGlobalState<{name: string, age: number}>({name: 'Yezy', age: 25});

useGlobalState<string>(user, {selector: user => user.name});
useGlobalState<number>(user, {selector: user => user.age});

useGlobalStateReducer<string>(reducer, user, {selector: user => user.name});
useGlobalStateReducer<number>(reducer, user, {selector: user => user.age});
```
