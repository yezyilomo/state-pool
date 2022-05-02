# State Pool

![Build Status](https://github.com/yezyilomo/state-pool/actions/workflows/node.js.yml/badge.svg?branch=master)
[![Build Size](https://img.shields.io/bundlephobia/minzip/state-pool?label=bundle-size&style=flat)](https://bundlephobia.com/result?p=state-pool)
[![Version](https://img.shields.io/npm/v/state-pool?style=flat)](https://www.npmjs.com/package/state-pool)
[![Downloads](https://img.shields.io/npm/dt/state-pool.svg?style=flat)](https://www.npmjs.com/package/state-pool)

React state management library based on global variables and react hooks.

## Features & Advantages
- Simple, familiar, flexible and very minimal core API but powerful
- Built-in support for state persistence
- Very easy to learn because its API is very similar to react state hook's API
- Support selecting deeply nested state
- Support creating global state dynamically
- Can be used outside react components
- Support both key based and non-key based global state
- States are stored as global variables(Can be used anywhere)
- Doesn't wrap your app in context providers
- Very organized API, You can do almost everything with a single import

<br/>

## Architectural Diagram
![Architecture Diagram](https://raw.githubusercontent.com/yezyilomo/state-pool/master/docs/images/architecture_diagram.png)

<br/>

### State Flow
1. Create a global state

2. Subscribe a component(s) to a created global state

3. If a component wants to update a global state, it sends update request

4. When a global state receives update request, it performs the update and send signal to all components subscribed to it for them to update themselves(re-render)

<br/>

## Installation
```
yarn add state-pool
```

Or 

```
npm install state-pool
```

<br/>

## Getting Started
Using **state-pool** to manage global state is very simple, all you need to do is
1. Create a store(which is basically a container for your global state)
1. Create and initialize a global state by using `store.setState`
2. Use your global state in your component through `store.useState` hooks

These three steps summarises pretty much everything you need to use **state-pool**.

Below are few examples showing how to use **state-pool** to manage global states.

```js
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

<br/>

```js
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

<br/>


Pretty cool, right?