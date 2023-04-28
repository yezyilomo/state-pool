# [State Pool](https://yezyilomo.github.io/state-pool/)

![Build Status](https://github.com/yezyilomo/state-pool/actions/workflows/node.js.yml/badge.svg?branch=master)
[![Build Size](https://img.shields.io/bundlephobia/minzip/state-pool?label=bundle-size&style=flat)](https://bundlephobia.com/result?p=state-pool)
[![Version](https://img.shields.io/npm/v/state-pool?style=flat)](https://www.npmjs.com/package/state-pool)
[![Downloads](https://img.shields.io/npm/dt/state-pool.svg?style=flat)](https://www.npmjs.com/package/state-pool)

Transform your React app with our state management library! Declare global and local states like variables, powered by the magic of React hooks 🪄✨

## Features & Advantages
- Simple, familiar, flexible and very minimal core API but powerful
- Built-in support for state persistence
- Very easy to learn because its API is very similar to react state hook's API
- Support selecting deeply nested state
- Support creating state dynamically
- Can be used outside react components
- Doesn't wrap your app in context providers
- Very organized API, You can do almost everything with a single import

Want to see how this library is making all that possible?

Check out the full documentation at [yezyilomo.github.io/state-pool](https://yezyilomo.github.io/state-pool/)

You can also try live examples [Here](https://yezyilomo.github.io/state-pool-examples)
<br/>

## How it Works
1. Create a state

2. Subscribe a component(s) to the state created

3. If a component wants to update the state, it sends update request

4. When a state receives update request, it performs the update and send signal to all components subscribed to it for them to update themselves(re-render)

<br/>

## Installation
```sh
npm install state-pool
```

Or 

```sh
yarn add state-pool
```

<br/>

## Getting Started
Using **state-pool** to manage state is very simple, all you need to do is
1. Create and initialize a state by using `createState`
2. Use your state in your component through `useState` hooks

These two steps summarises pretty much everything you need to use **state-pool**.

Below are few examples showing how to use **state-pool** to manage states.

```jsx
// Example 1.
import React from 'react';
import { createState } from 'state-pool';


const count = createState(0);  // Create "count" state and initialize it with 0


function ClicksCounter(props){
    // Use "count" state
    const [count, setCount] = count.useState();

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

The other way to do it is using `useState` from `state-pool`
```jsx
// Example 2.
import React from 'react';
import { createState, useState } from 'state-pool';


const count = createState(0);  // Create "count" state and initialize it with 0


function ClicksCounter(props){
    // Use "count" state
    const [count, setCount] = useState(count);

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

## What about local state?
With **state-pool**, state are just like variables, if declared on a global scope, it’s a global state and if declared on local scope it’s a local state, so the difference between global state and local state in **state-pool** lies where you declare them just like variables.

Here is an example for managing local state
```jsx
// Example 1.
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

<br/>

## Isn't `StatePool.useState` the same thing as `React.useState`?
**Definitely. not!...**

Both can be used to manage local state, and that's where the similarity ends. `StatePool.useState` offers more features, for one it offers a simple way to update nested data unlike `React.useState`, it's also flexible as it's used to manage both global state and local state. So you could say `React.useState` is a subset of `StatePool.useState`.

Here is an example of `StatePool.useState` in action, updating nested data
```jsx
// Example 2.
import React from 'react';
import StatePool from 'state-pool';


const user = StatePool.createState({name: "Yezy", age: 25});

function UserInfo(props){
    const [user, setUser, updateUser] = StatePool.useState(user);

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

With `React.useState` you would need to recreate `user` object when updating `user.name`, but with `StatePool.useState` you don't need that, you just update the value right away. 

That's one advantage of using `StatePool.useState` but there are many more, you'll learn when going through [**documentation**📝](https://yezyilomo.github.io/state-pool/).



## Store based example
If you have many states and you would like to organize them into a store, **state-pool** allows you to do that too and provides a tone of features on top of it.

Here are steps for managing state with a store
1. Create a store(which is basically a container for your state)
1. Create and initialize a state by using `store.setState`
2. Use your state in your component through `store.useState` hooks

These three steps summarises pretty much everything you need to manage state with a store.

Below are few examples of store in action

```jsx
// Example 1.
import { createStore } from 'state-pool';


const store = createStore();  // Create store for storing our state
store.setState("count", 0);  // Create "count" state and add it to the store

function ClicksCounter(props){
    // Use "count" state
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


// Instead of using createStore and store.setState,
// you can combine store creation and initialization as follows

const store = createStore({"user", {name: "Yezy", age: 25}});  // create store and initialize it with user

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

**State-pool** doesn't enforce storing your states in a store, If you don't like using the architecture of store you can still use **state-pool** without it. In **state-pool**, store is just a container for states, so you can still use your states without it, in fact **state-pool** doesn’t care where you store your states as long as you can access them you're good to go.

<br/>

Pretty cool, right?


## [Documentation 📝](https://yezyilomo.github.io/state-pool/)
Full documentation for this project is available at [yezyilomo.github.io/state-pool](https://yezyilomo.github.io/state-pool/), you are advised to read it inorder to utilize this library to the fullest. You can also try live examples [here](https://yezyilomo.github.io/state-pool-examples).


## Running Tests
If you've forked this library and you want to run tests use the following command

```sh
npm test
```
