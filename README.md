# [State Pool](https://yezyilomo.github.io/state-pool/)

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
- States are stored as global variables(Can be used anywhere)
- Doesn't wrap your app in context providers
- Very organized API, You can do almost everything with a single import

Want to see how this library is making all that possible?

Check out the full documentation at [yezyilomo.github.io/state-pool](https://yezyilomo.github.io/state-pool/)

You can also try live examples [Here](https://yezyilomo.github.io/state-pool-examples)
<br/>

## How it Works
1. Create a global state

2. Subscribe a component(s) to a created global state

3. If a component wants to update a global state, it sends update request

4. When a global state receives update request, it performs the update and send signal to all components subscribed to it for them to update themselves(re-render)

<br/>

## Installation
```sh
yarn add state-pool
```

Or 

```sh
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

```jsx
// Example 1.
import { createStore } from 'state-pool';


const store = createStore();  // Create store for storing our global state
store.setState("count", 0);  // Create "count" global state and add it to the store

function ClicksCounter(props){
    // Use "count" global state
    const [count, setCount] = store.useState("count");

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={e => setCount(++count)}>Click</button>
        </div>
    );
}
```

<br/>

```jsx
// Example 2.
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
```

<br/>

**State-pool** doesn't enforce storing your states in a store, If you don't like using the architecture of store you can still use **state-pool** without it. In **state-pool** store is just a container for global states, so you can still use your global states without it, in fact **state-pool** doesn’t care where you store your global states as long as you can access them,

Here is an example of how to use state-pool without a store

```js
import { createGlobalState, useGlobalState } from 'state-pool';


// Create count global state and initialize it with 0
const count = createGlobalState(0);

function ClicksCounter(props){
    // Use count global state
    const [count, setCount] = useGlobalState(count);

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={e => setCount(++count)}>Increment</button>
        </div>
    );
}
```
<br/>

Pretty cool, right?


## [Documentation 📝](https://yezyilomo.github.io/state-pool/)
Full documentation for this project is available at [yezyilomo.github.io/state-pool](https://yezyilomo.github.io/state-pool/), you are advised to read it inorder to utilize this library to the fullest. You can also try live examples [here](https://yezyilomo.github.io/state-pool-examples).


## Running Tests
If you've forked this library and you want to run tests use the following command

```sh
npm test
```
