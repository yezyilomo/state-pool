---
sidebar_position: 2
---

# useState
`useState` is a hook that used within a react component to subscribe to a state. `useState` works just like `React.useState` hook but it accepts a state object and returns an array of `[state, setState, updateState]` rather than `[state, setState]`. In addition to a state object parameter it also accept another optional parameter which is the config object, available configurations are `selector` & `patcher`, these parameters works exactly the same as in `store.useState`. We could say `useState` is a low level implementation of `store.useState`.

```js
// Signature
useState(State: State, config?: {selector: Function, patcher: Function})
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

Below is an example with `selector` and `patcher` configurations

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

:::tip

`useState` is used to implement `store.useState` hook.

:::