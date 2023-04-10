---
sidebar_position: 3
---

# useReducer
This is an alternative to `useState`, it works just like `React.useReducer` hook(If you’re familiar with `React.useReducer`, you already know how this works). It accepts a reducer and a state object as parameters, it returns the current state paired with a dispatch method. In addition to the two parameters it also accept another optinal perameter which is the configuration object, available configurations are `selector` and `patcher` they work exactly the same just like in `useState`.


```js
// Signature
useReducer(
    reducer: Function,
    State: State,
    config?: {selector: Function, patcher: Function}
)
```

Below is a simple example showing how to use `useReducer`

```js
const initialState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createState(initialState);

function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function Component(props){
    const [name, dispatch] = useReducer(myReducer, user);
    
    // Other stuff ...
}
```

Below is an example with `selector` and `patcher` parameters

```js
const initialState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createState(initialState);


function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function UserInfo(props){
    const selector = (user) => user.name;
    const patcher = (user, name) => {user.name = name};
    
    const [name, dispatch] = useReducer(myReducer, user, {selector, patcher});

    // Other stuffs
}
```

:::tip

`useState` hook is derived from `useReducer` hook, also this hook is used to implement `store.useReducer`.

:::