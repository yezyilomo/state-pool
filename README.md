# state-pool
React state management library based on global variables and react hooks.

## Architecture

### State Flow
1. Create a global state(which is technically a global variable)

2. Subscribe a component(s) to a created global state

3. If a component wants to update a global state, it sends an update request

4. When a global state receives the update request, it performs the update and send update signal to all components subscribed to it for them to update themselves(re-render)


## Installing
```
yarn add state-pool
```

Or 

```
npm install state-pool
```

## Getting Started
```js
import React from 'react';
import {creatGlobalState, useGlobalState} from 'state-pool';


let clicksCount = createGlobalState(0);

function ClicksCounter(props){
    const [count, setCount] = useGlobalState(clicksCount);

    let incrementCount = (e) => {
        setCount(count+1)
    }

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={incrementCount}>Click</button>
        </div>
    );
}

ReactDOM.render(ClicksCounter, document.querySelector("#root"));
```

## API
### `createGlobalState`
**state-pool** allows you to create global state with `createGlobalState`, `createGlobalState` accepts one argument which is the initial state. Here is how to use it

```js
const userName = createGlobalState("Yezy");
```

**Note:** This should be used outside of your component.


### `useGlobalState` hook
`useGlobalState` works just like `useState` hook but it accepts a global state object, For example if you have a global state like
```js
const userName = createGlobalState("Yezy");
```

you can use `useGlobalState` hook to get global state in a functional component like
```js
[name, setName] = useGlobalState(userName);
```


### `useGlobalStateReducer` hook
`useGlobalStateReducer` works just like `useReducer` hook but it accepts a reducer  and a global state object, For example if you have a global state like
```js
const userName = createGlobalState("Yezy");
```

you can use `useGlobalStateReducer` hook to get global state in a functional component like
```js
function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

[name, setName] = useGlobalStateReducer(myReducer, userName);
```

### `setGlobalState`
`setGlobalState` is used to create global state and map it to a key so that you won't need to use global state object directly instead you use the key to get it, `setGlobalState` accepts a key(string) to map to a global state object which is going to be created, Here is how to use it

```js
setGlobalState(key, initialState);
```

### `getGlobalState`
`getGlobalState` is used to get a global state object by using a key, it accepts a key(string) and returns a global state object. `getGlobalState` is often used along with `setGlobalState` in key bases global state. Here is how to use it

```js
const globalState = getGlobalState(key);
```

Most times you will be using it to get a global state object to pass to `useGlobalState` or `useGlobalStateReducer`. For example

```js
const globalState = getGlobalState(key);
const [state, setState] = useGlobalState(globalState);
```

Or

```js
const globalState = getGlobalState(key);
const [state, setState] = useGlobalStateReducer(reducer, globalState);
```

Pretty cool, right?