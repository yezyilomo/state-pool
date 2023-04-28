---
sidebar_position: 4
---


# Typing State
All state related functions support implicity and explicity typing.

Examples

```ts
store.setState<number>('count', 0);

store.useState<number>('count');

store.useReducer<number, action>(reducer, 'count');

// For none key based
const count = createState<number>(0);

useState<number>(count);

useReducer<number, action>(reducer, count);


// Typing with selector
store.setState<{name: string, age: number}>('user', {name: 'Yezy', age: 25});

store.useState<string>('user', {selector: user => user.name});
store.useState<number>('age', {selector: user => user.age});

store.useReducer<string, action>(reducer, 'user', {selector: user => user.name});
store.useReducer<number, action>(reducer, 'user', {selector: user => user.age});

// For none key based
const user = createState<{name: string, age: number}>({name: 'Yezy', age: 25});

useState<string>(user, {selector: user => user.name});
useState<number>(user, {selector: user => user.age});

useReducer<string, action>(reducer, user, {selector: user => user.name});
useReducer<number, action>(reducer, user, {selector: user => user.age});
```

<br/><br/>

# Blue print for typing hooks
**Note:** `T` is for base/original state type, `ST` for selected state type and `A` for reducer action.

```ts
// useState.js   (For useState)

const [state: T, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = useState<T>(state: State<T> | T)

const [state: ST, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = useState<ST, T>(state: State<T> | T, { selector: Selector<ST> })

const [state: ST, setState: SetState<ST>, updateState: UpdateState<ST>, stateObj: State<T>] = useState<ST, T>(state: State<T> | T, { selector: Selector<ST>, patcher: Patcher<ST> })


// State.js   (For state.useState)

const [state: T, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = state<T>.useState()

const [state: ST, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = state<T>.useState<ST>({ selector: Selector<ST> })

const [state: ST, setState: SetState<ST>, updateState: UpdateState<ST>, stateObj: State<T>] = state<T>.useState<ST>({ selector: Selector<ST>, patcher: Patcher<ST> })

// Store.js   (For store.useState)

const [state: T, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = store.useState<T>(key, { default: T });

const [state: ST, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = store.useState<ST, T>(key, { selector: Selector<ST>, default: T })

const [state: ST, setState: SetState<ST>, updateState: UpdateState<ST>, stateObj: State<T>] = store.useState<ST, T>(key, { selector: Selector<ST>, patcher: Patcher<ST>, default: T })


// useReducer.js   (For useReducer)

type Reducer = (state: T, action: A) => T
const [state: T, dispatch: (action: A) => void, stateObj: State<T>] = useReducer<T, A>(type Reducer = Reducer<T, A>, state: State<T> | T)

type Reducer = (state: T, action: A) => T
const [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, state: State<T> | T, { selector: Selector<ST> })

type Reducer = (state: ST, action: A) => ST
const [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, state: State<T> | T, { selector: Selector<ST>, patcher: Patcher<ST> })


// State.js  (For state.useReducer)

type Reducer = (state: T, action: A) => T
const [state: T, dispatch: (action: A) => void, stateObj: State<T>] = state<T>.useReducer<T, A>(type Reducer = Reducer<T, A>)

type Reducer = (state: T, action: A) => T
const [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = state<T>.useReducer<ST, A>(type Reducer = Reducer<T, A>, { selector: Selector<ST> })

type Reducer = (state: ST, action: A) => ST
const [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = state<T>.useReducer<ST, A>(type Reducer = Reducer<T, A>, { selector: Selector<ST>, patcher: Patcher<ST> })


// Store.js   (For store.useReducer)

type Reducer = (state: T, action: A) => T
const [state: T, dispatch: (action: A) => void, stateObj: State<T>] = store.useReducer<T, A>(type Reducer = Reducer<T, A>, key, { default: T });

type Reducer = (state: T, action: A) => T
const [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = store.useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, key, { selector: Selector<ST>, default: T })

type Reducer = (state: ST, action: A) => ST
const [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = store.useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, key, { selector: Selector<ST>, patcher: Patcher<ST>, default: T })
```
