---
sidebar_position: 2
---

# useState
`useState` is a hook that used within a react component to subscribe to a state. `useState` works just like `React.useState` hook but it accepts a state object or initial state or state initializer and returns an array of `[state, setState, updateState, stateObject]` rather than `[state, setState]`, In most cases you won't be using `stateObject` so you'll be okay with `[state, setState, updateState]`. In addition to a state object parameter it also accept another optional parameter which is the config object, available configurations are `selector` & `patcher`, these parameters works exactly the same as in `store.useState`. We could say `useState` is a low level implementation of `store.useState`.

```js
// Signature
useState(state: State, config?: {selector: Function, patcher: Function})

// Or in local state as

useState(initialState: Any, config?: {selector: Function, patcher: Function})

// Or with lazy state initializer

useState(stateInitializer: () => Any, config?: {selector: Function, patcher: Function})
```

Below is a simple example showing how to use `useState` hook

```jsx
import React from 'react';
import { createState, useState } from 'state-pool';


const initialState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createState(initialState);

function Component(props){
    const [user, setUser, updateUser] = useState(user);
    // Other stuff ...
}
```

Below is the same example with `selector` and `patcher` configurations

```jsx
const initialState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createState(initialState);


function UserName(props){
    const selector = (user) => user.name;  // Subscribe to user.name only
    const patcher = (user, name) => {user.name = name};  // Update user.name

    const [name, setName] = useState(user, {selector: selector, patcher: patcher});

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    return (
        <div>
            Name: {name}
            <br/>
            <input type="text" value={name} onChange={handleNameChange}/>
        </div>
    );
}
```

# Using useState to manage local state
With **state-pool**, state are just like variables, if declared on a global scope, it’s a global state and if declared on local scope it’s a local state, so the difference between global state and local state in **state-pool** lies where you declare them just like variables.

Here is an example for managing local state with `useState`
```jsx
import React from 'react';
import { useState } from 'state-pool';


function ClicksCounter(props){
    // Here `useState` hook will create "count" state and initialize it with 0
    // Note: the `useState` hook used here is impored from state-pool and not react
    const [count, setCount] = useState(0);

    const incrementCount = (e) => {
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
<br/>

If you don't want **state-pool's** `useState` to collide with **React's** `useState` you can import `StatePool` and use the hook from there,

Here is an example
```jsx
// Example 2.
import React from 'react';
import StatePool from 'state-pool';


function ClicksCounter(props){
    // Here `useState` hook will create "count" state and initialize it with 0
    const [count, setCount] = StatePool.useState(0);

    const incrementCount = (e) => {
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

Here is an example with nested data
```jsx
import { useState } from 'state-pool';


function UserName(props){
    const [user, setUser, updateUser] = useState({name: "Yezy", age: 25, email: "yezy@me.com"});

    const handleNameChange = (e) => {
        updateUser((user) => {
            user.name = e.target.value
        })
    }

    const handleAgeChange = (e) => {
        updateUser((user) => {
            user.age = e.target.value
        })
    }

    return (
        <div>
            <div>Name: {user.name} </div>
            <div>Age: {user.age} </div>
            <input type="text" value={user.name} onChange={handleNameChange}/>
            <input type="text" value={user.age} onChange={handleAgeChange}/>
        </div>
    );
}
```

:::tip

`useState` is used to implement `store.useState` hook.

:::