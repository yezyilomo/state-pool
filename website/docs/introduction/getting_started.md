---
sidebar_position: 3
---

# Getting Started
Using **state-pool** to manage global state is very simple, all you need to do is
1. Create a store(which is basically a container for your global state)
1. Create and initialize a global state by using `store.setState`
2. Use your global state in your component through `store.useState` hooks

These three steps summarises pretty much everything you need to use **state-pool**.

Below are few examples showing how to use **state-pool** to manage global states.

```jsx
// Example 1.
import React from 'react';
import { createStore } from 'state-pool';


const store = createStore();  // Create store for storing our global state
store.setState("count", 0);  // Create "count" global state and add it to the store

function ClicksCounter(props){
    // Use "count" global state
    const [count, setCount] = store.useState("count");

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


```jsx
// Example 2.
import React from 'react';
import { createStore } from 'state-pool';


const store = createStore();  // Create store for storing our global state
store.setState("user", {name: "Yezy", age: 25});

function UserInfo(props){
    const [user, setUser, updateUser] = store.useState("user");

    const updateName = (e) => {
        updateUser(user => {
            user.name = e.target.value;
        });
    }

    return (
        <div>
            Name: {user.name}
            <br/>
            <input type="text" value={user.name} onChange={updateName}/>
        </div>
    );
}

ReactDOM.render(UserInfo, document.querySelector("#root"));
```
