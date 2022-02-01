# State Pool

![Build Status](https://github.com/yezyilomo/state-pool/actions/workflows/node.js.yml/badge.svg?branch=master)
[![Build Size](https://img.shields.io/bundlephobia/minzip/state-pool?label=bundle-size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=state-pool)
[![Version](https://img.shields.io/npm/v/state-pool?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/state-pool)
[![Downloads](https://img.shields.io/npm/dt/state-pool.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/state-pool)

React state management library based on global variables and react hooks.

**Features & Advantages**
- Simple, familiar and very minimal core API but powerful
- Very flexible API, almost everything is customizable
- Built-in support for state persistence
- Very easy to learn because its API is very similar to react state hook's API
- Support selecting deeply nested state
- Support creating global state dynamically
- Can be used outside react components
- Support both key based and non-key based global state
- States are stored as global variables(Can be used anywhere)
- Typescript support
- Doesn't wrap your app in context providers
- You can create as many stores as you want
- Very organized API, You can do literally everything by importing just one part of this library

<br/>

## Architectural Diagram
![Architecture Diagram](https://raw.githubusercontent.com/yezyilomo/state-pool/master/docs/images/architecture_diagram.png)

<br/>

### State Flow
1. Create a global state(which is technically a global variable)

2. Subscribe a component(s) to a created global state

3. If a component wants to update a global state, it sends update request

4. When a global state receives update request, it performs the update and send update signal to all components subscribed to it for them to update themselves(re-render)

<br/>

## Installing
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
1. Create/Set a global state by using `store.setState`
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
    const [count, setCount, updateCount] = store.useState("count");

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

## API
### createStore
Store is a container for key based global states. Store provides few methods which are used to manage key based global states including `store.setState`, `store.getState`, `store.remove`, `store.clear`, `store.useState` and `store.useReducer`. Store is created by using `createStore` API as 

```js
import { createStore } from 'state-pool';

const store = createStore();
```

<br/>

### store.setState
This is used to create a global state and map it to a key so that you won't need to use a global state object directly, instead you use the key to get it. `store.setState` takes two required parameters, a key(string) to map to a global state object and the initial value, In addition to those two parameters it takes a third optional parameter which is the configuration object. `persist` is the only available config which is the flag to determine whether to save/persist state in a permanent storage or not.

```js
// Signature
store.setState(key: String, initialState: Any, {persist: Boolean})
```

Here is how to use it

```js
const userState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}
store.setState("user", userState);
```

**Note:** `store.setState` should be used outside of react component.

<br/>

### store.useState hook
`store.useState` works just like `React.useState` hook but it accepts a key for the global state and returns an array of `[state, setState, updateState]` rather than `[state, setState]`. In addition to the key parameter it also accept another optional parameter which is the config object, available configurations are `default`, `persist`, `selector` & `patcher`, these will be discussed in detail later.

```js
// Signature
store.useState(key: string, {default: any, persist: boolean, selector: function, patcher: function})
```

Below is an example showing how to use `store.useState` hook

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

store.setState("user": initialGlobalState);

function Component(props){
    const [user, setUser, updateUser] = store.useState("user");
    // Other stuff
}
```

Here updateUser is a higher order function which accepts another function for updating user as an argument(this another functions takes user(old state) as the argument). So to update any value on user you can do

```js
updateUser(function(user){
    user.name = "Yezy Ilomo";
    user.age = 26;
})
```

You can also return a new state instead of changing it i.e

```js
updateUser(function(user){
    return {
        name: "Yezy Ilomo",
        age: 26,
        email: "yezy@me.com"
    }
})
```

Or you can just use `setUser` instead of `updateUser` i.e

```js
setUser({name: "Yezy Ilomo", age: 26, email: "yezy@me.com"});
```

As stated earlier store.useState accepts a second optional parameter which is a configuration object, available configurations are:
- `default` - This is used to specify the default value if you want store.useState` to create a global state if it doesn't find the one for the key specified in the first argument. For example

  ```js
  const [user, setUser, updateUser] = store.useState("user", {default: null});
  ```

  This piece of code means get the global state for the key user if it's not available in a store, create one and assign it the value `null`.

- Also in addition to `default` configuration there is `persist` configuration which is the flag to determine whether to save/persist global state in your preferred storage or not. Here persist configuration is only used if `store.useState` is going to create global state dynamically.

<br/>
Other allowed configurations are `selector` & `patcher`. These are used for specifying a way to select deeply nested state and update it.

- `selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.

- `patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.

Example.
```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

store.setState("user": initialGlobalState);


function UserName(props){
    const selector = (user) => user.name;  // Subscribe to user.name only
    const patcher = (user, name) => {user.name = name};  // Update user.name

    const [name, setName, updateName] = store.useState("user", {selector: selector, patcher: patcher});

    let handleNameChange = (e) => {
        setName(e.target.value);
        // updateName(name => e.target.value);  You can do this if you like to use `updatName`
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

<br/>

### store.useReducer hook
`store.useReducer` works just like `React.useReducer` hook but it accepts a reducer and a key for the global state. In addition to the two parameters mentioned it also accept other optinal perameter which is the configuration object, available configurations are `default`, `persist`, `selector` & `patcher`.

```js
// Signature
store.useReducer(reducer: function, key: string, {default: any, persist: boolean, selector: function, patcher: function })
```

Below is an example showing how to use

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

store.setState("user": initialGlobalState);

function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function Component(props){
    const [name, dispatch] = store.useReducer(myReducer, "user");

    // Other stuff ...
}
```

As stated earlier `store.useReducer` has a third optional parameter which is a configuration object, available configurations are:

- `default` - This is used to specify the default value if you want `store.useReducer` to create a global state if it doesn't find the one for the key specified in the first argument. For example

  ```js
  const [user, dispatch] = store.useReducer(myReducer, "user", {default: null});
  ```

  This piece of code means get the global state for the key `user` if it's not available in a store, create one and assign it the value null.
  
- Also in addition to `default` configuration there is `persist` configuration which is the flag to determine whether to save/persist global state on your preferred storage or not if `store.useReducer` is going to create one dynamically.

Other allowed configurations are `selector` & `patcher`. These are used for specifying a way to select deeply nested state and update it.

- `selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.

- `patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.
Example.

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

store.setState("user": initialGlobalState);


function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function UserInfo(props){
    const selector = (user) => user.name;
    const patcher = (user, name) => {user.name = name};
    
    const [name, dispatch] = store.useReducer(myReducer, "user", {selector: selector, patcher: patcher});

    // Other stuff
}
```
<br/>

### store.getState
`store.getState` is used to get a global state object by using a key, it accepts one required parameter which is a key(string) and another optional parameters which is the configuration object(available configurations are `default` and `persist`). When called, `store.getState` returns a global state object.

```js
// Signature
store.getState(key: String, {default: Any, persist: Boolean})
```

Here is how to use it

```js
const globalState = store.getState(key);
```

<br/>

### store.subscribe & globalState.subscribe
If you want to listen to changes in a store you can subscribe to it by using `store.subscribe`. it accepts an observer function. For example 

```js
// Subscribe to store changes
const unsubscribe = store.subscribe(function({key: String, value: Any}){
    // key is the key for a global state that has changed 
    // value is the new value of a global state
})

// You can unsubscribe by calling the result
unsubscribe();
```

If you want to subscribe to a single global state you can use 

```js
// Subscribe to store changes
const unsubscribe = store.getState(key).subscribe(function(value){
    // value is the new value of a global state 
})

// You can unsubscribe by calling the result
unsubscribe();
```

You can even subscribe to a deeply nested state by using a selector as 

```js
store.getState(key).subscribe({
    observer:  function(value){
        // value is the new value of a global state 
    },
    selector: function(value){
        return  selected_state
    })
})
```
With this observer function will only be called when the selected state changes
<br/>

### store.remove
This is used to remove a global state from store if you don't need it anymore or you want to reload/reset it. It accepts a global state key or a list of keys to remove and a function to run after removing such global state(s). Note the function runs before components subscribed to removed global state(s) re-renders.

```js
// Signature
store.remove(key: String/[String], fn: Function)
```

Below is an example showing how to use it

```js
import React from 'react';
import { createStore } from 'state-pool';


const store = createStore();
store.setState("count", 0);

function ClicksCounter(props){
    const [count, setCount, updateCount] = store.useState("count");

    const incrementCount = (e) => {
        setCount(count+1);
    }

    const resetCounter = (e) => {
        store.remove("count", initializeStore)
    }

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={incrementCount}>Click</button>
            <button onClick={resetCounter}>Reset</button>
        </div>
    );
}

ReactDOM.render(ClicksCounter, document.querySelector("#root"));
```

From the code above, when you click `Reset` button `store.remove` will remove `count` global state and create it again by executing `initializeStore`.


**NOTE:** If we had more than one state to delete we could do

```js
store.remove([key1, key2, key3, ...], initializeStore);
```

<br/>

### store.clear
This is used to clear the entire store if you don't need all global states in it anymore or you want to reload/reset all global states. It accepts a function to run after clearing the store. Note the function runs before components subscribed to all global states in a store rerenders.

```js
// Signature
store.clear(fn: Function)
```

Below is an example showing how to use it

```js
import React from 'react';
import { createStore } from 'state-pool';


const store = createStore();

const user = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}
    
const profile = {
    url: "https://yezyilomo.com",
    rating: 5
}
store.setState("user": user);
store.setState("profile": profile);


function UserInfo(props){
    const [user, setUser, updateUser] = store.useState("user");

    const updateName = (e) => {
        updateUser(user => {
            user.name = e.target.value;
        });
    }

    const resetStore = (e) => {
        store.clear(initializeStore);
    }

    return (
        <div>
            Name: {user.name}
            <br/>
            <input type="text" value={user.name} onChange={updateName}/>
             <button onClick={resetStore}>Reset Store</button>
        </div>
    );
}

ReactDOM.render(UserInfo, document.querySelector("#root"));
```
From the code above, when you click `Reset Store` button `store.clear` will remove all global states from the store and create them again by executing `initializeStore`. This might come in handy when you need to clear all data when user logs out of your application.


**NOTE:** both `store.remove` and `store.clear` when executed causes all components subscribed to global states which are removed to rerender.

<br/>

### store.persist(State Persistence)
Sometimes you might want to save your global states in a permanent storage probably because you might not want to lose them when the application is closed(i.e you want to retain them when the application starts).

**State pool** makes it very easy to save your global states in your preferred permanent storage, all you need to do is:

1. Tell state-pool how to save your global state by using `store.persist`
2. Use `persist` configuration to tell state-pool to save your global state in your preferred storage when creating your global state.

When telling **state-pool**  how to save global state to a permanent storage we need to implement four functions which are 

1. `saveState`: This is for saving your global state to your preferred permanent storage, it should accept a `key` as the first parameter and `value` as the second parameter. This function is called automatically when `store.setState` is executed and when the  global state changes
2. `loadState`: This is used for loading state from your preferred permanent storage, it should accept a `key` as the only parameter. This function is called when `store.setState` is executed and need initial value for the global state
3. `removeState’: This is used for removing state from a permanent storage, it should accept a `key` as the only parameter. This function is called when `store.remove` is executed
4. `clear`: This is used for clearing an entire permanent storage, it doesn’t accept any parameter. This function is called when `store.clear` is executed.

Now the way to implement these is by calling `store.persist` and pass them as shown below 

```js
store.persist({
    saveState: function(key, value){/*your code to save state */},
    loadState: function(key){/*your code to load state */},
    removeState: function(key){/*your code to remove state */},
    clear: function(){/*your code to clear storage */}
})
```

After implementing these four functions you're good to go, you won’t need to worry about calling them, **state-pool** will be doing that for you automatically so that you can focus on using your states.

As discussed earlier `store.setState` accept a third optional parameter which is the configuration object, persist is one of configurations which is used to tell **state-pool** whether to save your state in a permanent storage or not. i.e

```js
store.setState(key: String, initialState: Any, {persist: Boolean})
```

Since **state-pool** allows you to create global state dynamically, it also allows you to save those newly created states in your permanent storage if you want, that's why both `store.useState` and `store.useReducer` accept a `persist` configuration too which just like in `store.setState` it's used to tell state-pool whether to save your newly created state in a permanent storage or not. i.e

```js
store.useState(key: String, {defaultValue: Any, persist: Boolean})
```

```js
store.useReducer(reducer: function, key: String, {defaultValue: Any, persist: Boolean})
```

By default the value of `persist` in all cases is false(which means it doesn't save global states to a permanent storage), so if you want to activate it, set it to be true.

What's even better about **state-pool** is that you get the freedom to choose what to save in your permanent storage and what's not to, so you don't need to save the whole store in your permanent storage, but if you want to save the whole store you can use `PERSIST_ENTIRE_STORE` configuration.

Below is an example showing how you could implement state persistance in local storage.

```js
import { createStore } from 'state-pool';

const store = createStore();

let timerId: any = null
const DEBOUNCE_TIME = 1000  // In milliseconds

store.persist({
    PERSIST_ENTIRE_STORE: true,  // Use this only if you want to persist the entire store
    saveState: function(key, value, isInitialSet){
        const doStateSaving = () => {
            try {
                const serializedState = JSON.stringify(state);
                window.localStorage.setItem(key, serializedState);
            } catch {
                // Ignore write errors
            }
        }

        if(isInitialSet){
            // We don't debounce saving state since it's the initial set
            // so it's called only once and we need our storage to be updated
            // right away
            doStateSaving();
        }
        else {
            // Here we debounce saving state because it's the update and this function
            // is called every time the store state changes. However, it should not
            // be called too often because it triggers the expensive `JSON.stringify` operation.
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                
            }, DEBOUNCE_TIME);
        }
    },
    loadState: function(key){
        try {
            const serializedState = window.localStorage.getItem(key);
            if (serializedState === null) {
                // No state saved
                return undefined
            }
            return JSON.parse(serializedState);
        } catch (err) {
            // Failed to load state
            return undefined
        }
    },
    removeState: function(key){
        window.localStorage.removeItem(key);
    },
    clear: function(){
        window.localStorage.clear();
    }
})

```

<br/>


## Low level API(Non key based API)
### createGlobalState
**state-pool** allows you to create global state object with `createGlobalState`, it accepts one argument which is the initial value.

```js
// Signature
createGlobalState(initialValue: Any)
```

Here is how to use it

```js
const userName = createGlobalState("Yezy");
```

**Note:** This should be used outside of react component.

<br/>

### useGlobalState hook
`useGlobalState` works just like `useState` hook but it accepts a global state and returns an array of `[state, setState, updateState]` rather than `[state, setState]`. In addition to the global state or key parameter it accepts another optional parameter which is the config object, available configurations are `selector` & `patcher`, these will be discussed in detail later.

```js
// Signature
useGlobalState(globalState: GlobalState, {selector: Function, patcher: Function})
```

Below is an example showing how to use `useGlobalState` hook

```js
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

Here `updateUser` is a higher order function which accepts another function for updating user as an argument(this another functions takes user(old state) as the argument). So to update any value on user you can do 

```js
updateUser(function(user){
    user.name = "Yezy Ilomo";
    user.age = 26;
})
```

You can also return a new state instead of changing it i.e
```js
updateUser(function(user){
    return {
        name: "Yezy Ilomo",
        age: 26,
        email: "yezy@me.com"
    }
})
```

Or you can just use `setUser` instead of `updateUser` i.e
```js
setUser({name: "Yezy Ilomo", age: 26, email: "yezy@me.com"});
```

<br/>

As stated earlier `useGlobalState` accepts a second **optional** parameter which is a configuration object, available configurations are `selector` & `patcher`, these are used for specifying a way to select deeply nested state and update it.


- `selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.


- `patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.

Example.
```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createGlobalState(initialGlobalState);


function UserName(props){
    const selector = (user) => user.name;  // Subscribe to user.name only
    const patcher = (user, name) => {user.name = name};  // Update user.name

    const [name, setName, updateName] = useGlobalState(user, {selector: selector, patcher: patcher});

    const handleNameChange = (e) => {
        setName(e.target.value);
        // updateName(name => e.target.value);  You can do this if you like to use `updatName`
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

<br/>

### useGlobalStateReducer hook
`useGlobalStateReducer` works just like `useReducer` hook but it accepts a reducer and a global state. In addition to the two parameters mentioned it accepts other optinal perameter which is the configuration object, available configurations are `selector` & `patcher`.


```js
// Signature
useGlobalStateReducer(reducer: Function, globalState: GlobalState, {selector: Function, patcher: Function})
```

Below is an example showing how to use `useGlobalStateReducer`

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createGlobalState(initialGlobalState);

function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function Component(props){
    const [name, dispatch] = useGlobalStateReducer(myReducer, user);
    
    // Other stuff ...
}
```

As stated earlier `useGlobalStateReducer` has a third **optional** parameter which is a configuration object, available configurations are `selector` & `patcher`, these are used for specifying a way to select deeply nested state and update it.


- `selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.


- `patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.

Example.
```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createGlobalState(initialGlobalState);


function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function UserInfo(props){
    const selector = (user) => user.name;
    const patcher = (user, name) => {user.name = name};
    
    const [name, dispatch] = useGlobalStateReducer(myReducer, user, {selector: selector, patcher: patcher});

    // Other stuffs
}
```

**FYI:** `useGlobalState` hook is derived from `useGlobalStateReducer` hook.

<br/>

Pretty cool, right?
