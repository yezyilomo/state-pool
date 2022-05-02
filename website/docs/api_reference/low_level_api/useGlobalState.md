---
sidebar_position: 2
---

# useGlobalState
`useGlobalState` is a hook that used within a react component to subscribe to a global state. `useGlobalState` works just like `React.useState` hook but it accepts a global state object and returns an array of `[state, setState, updateState]` rather than `[state, setState]`. In addition to a global state object parameter it also accept another optional parameter which is the config object, available configurations are `selector` & `patcher`, these parameters works exactly the same as in `store.useState`. We could say `useGlobalState` is a low level implementation of `store.useState`.

```js
// Signature
useGlobalState(globalState: GlobalState, config?: {selector: Function, patcher: Function})
```

Below is a simple example showing how to use `useGlobalState` hook

```jsx
import React from 'react';
import { createGlobalState, useGlobalState } from 'state-pool';


const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createGlobalState(initialGlobalState);

function Component(props){
    const [user, setUser, updateUser] = useGlobalState(user);
    // Other stuff ...
}
```

Below is an example with `selector` and `patcher` configurations

```jsx
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createGlobalState(initialGlobalState);


function UserName(props){
    const selector = (user) => user.name;  // Subscribe to user.name only
    const patcher = (user, name) => {user.name = name};  // Update user.name

    const [name, setName] = useGlobalState(user, {selector: selector, patcher: patcher});

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

:::tip

`useGlobalState` is used to implement `store.useState` hook.

:::