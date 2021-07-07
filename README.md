# State Pool
React state management library based on global variables and react hooks.

**Features & Advantages**
- Simple, familiar and very minimal core API but powerful
- Built-in state persistence
- Has a very steep learning curve because it works just like react state hooks
- Support selecting deeply nested state
- Support creating global state dynamically
- Support both key based and non-key based global state
- States are stored as global variables(Can be used anywhere)

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
### Managing Global State
Using **state-pool** to manage global state is very simple, all you need to do is
1. Create a global state by using either `createGlobalState` or `store.setState`(for key based global states)
2. Use your global state in a component through `useGlobalState` or `useGlobalStateReducer` hooks

These two steps summarises pretty much everything you need to use **state-pool**.

Below are few examples showing how to manage global states with **state-pool**.

```js
// Example 1.
import React from 'react';
import {store, useGlobalState} from 'state-pool';


store.setState("count", 0);  // Create "count" global state

function ClicksCounter(props){
    // Use "count" global state
    const [count, setCount, updateCount] = useGlobalState("count");

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

<br/>

```js
// Example 2.
import React from 'react';
import {store, useGlobalState} from 'state-pool';


store.setState("user", {name: "Yezy", age: 25});

function UserInfo(props){
    const [user, setUser, updateUser] = useGlobalState("user");

    let updateName = (e) => {
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

### Managing Local State
**state-pool**  allows you to manage local states too, it is shipped with `useLocalState` hook which is equivalent to `useState` with improved way to update state(especially nested ones).

Below are few examples showing how to manage local states with **state-pool**.

```js
// Example 1.
import React from 'react';
import {useLocalState} from 'state-pool';


function ClicksCounter(props){
    const [count, setCount, updateCount] = useLocalState(0);

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

<br/>

```js
// Example 2.
import React from 'react';
import {useLocalState} from 'state-pool';


function UserInfo(props){
    const [user, setUser, updateUser] = useLocalState({name: "Yezy", age: 25});

    let updateName = (e) => {
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

### store
Store is a container for key based global states. Store provides few methods which are used to manage key based global states including `store.setState`, `store.getState`, `store.remove` and `store.clear`.

<br/>

### store.setState
This is used to create a global state and map it to a key so that you won't need to use a global state object directly, instead you use the key to get it. `store.setState` takes two required parameters, a key(string) to map to a global state object and the initial value, In addition to those two parameters it takes a third optional parameter which is the configuration object. `persist` is the only available config which is the flag to determine whether to save/persist state in localStorage or not.

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

**Note:** `store.setState` should be used outside of the component, and normally you would want to initialize your store(by using `store.setState`) before using it, to do so, ensure it's done before calling `ReactDOM.render` in order to load states before the application starts.

<br/>

### useGlobalState hook
`useGlobalState` works just like `useState` hook but it accepts a global state or a key for the global state(for key based global state) and returns an array of `[state, setState, updateState]` rather than `[state, setState]`. In addition to the global state or key parameter it accepts another optional parameter which is the config object, available configurations are `default`, `persist`, `selector` & `patcher`, these will be discussed in detail later.

```js
// Signature
useGlobalState(globalState|key: GlobalState|String, {default: Any, persist: Boolean, selector: Function, patcher: Function})
```

Below is an example showing how to use `useGlobalState` hook

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

let user = createGlobalState(initialGlobalState);

function Component(props){
    const [user, setUser, updateUser] = useGlobalState(user);
    // Other stuff ...
}
```

Or for the case of key based global states
```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

store.setState("user": initialGlobalState);

function Component(props){
    const [user, setUser, updateUser] = useGlobalState("user");
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

As stated earlier `useGlobalState` accepts a second **optional** parameter which is a configuration object, available configurations are:

`default` - This is used to specify the default value if you want `useGlobalState` to create a global state if it doesn't find the one for the key specified in the first argument. For example 

```js
const [user, setUser, updateUser] = useGlobalState("user", {default: null});
```

This piece of code means get the global state for the key `user` if it's not available in a store, create one and assign it the value `null`.


Also in addition to `default` configuration there is `persist` configuration which is the flag to determine whether to save/persist global state in localStorage or not if `useGlobalState` is going to create one dynamically.


Other allowed configurations are `selector` & `patcher`. These are used for specifying a way to select deeply nested state and update it.


`selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.


`patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.

Example.
```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

let user = createGlobalState(initialGlobalState);


function UserName(props){
    const selector = (user) => user.name;  // Subscribe to user.name only
    const patcher = (user, name) => {user.name = name};  // Update user.name

    const [name, setName, updateName] = useGlobalState(user, {selector: selector, patcher: pather});

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


Or for the case of key based global state
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

    const [name, setName, updateName] = useGlobalState("user", {selector: selector, patcher: pather});

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

### useLocalState hook
`useLocalState` works just like `useGlobalState` hook except it accepts initial value as the argument and it's used to manage local states. Basically `useLocalState` is equivalent to `useState` with improved way to update state(especially nested ones). 

```js
// Signature
useLocalState(initialState)
```

For example you can use `useLocalState` hook to manage local state in a functional component as shown below

```js
function Component(props){
    const initialUserState = {
        name: "Yezy",
        age: 25,
        email: "yezy@me.com"
    }
    const [user, setUser, updateUser] = useLocalState(initialUserState);

    // Other stuff ...
}
```

Just like in `useGlobalState`, `updateUser` is a higher order function which accepts another function for updating user as an argument(this another functions takes user(old state) as the argument). So to update any state on user you can do 
```js
updateUser(function(user){
    user.name = "Yezy Ilomo";
    user.age = 26;
})
```
Here you can also return a new state instead of changing the current state i.e
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

### useGlobalStateReducer hook
`useGlobalStateReducer` works just like `useReducer` hook but it accepts a reducer and a global state or key for the global state. In addition to the two parameters mentioned it accepts other optinal perameter which is the configuration object, available configurations are `default`, `persist`, `selector` & `patcher`.


```js
// Signature
useGlobalStateReducer(reducer: Function, globalState|key: GlobalState|String, {default: Any, persist: Boolean, selector: Function, patcher: Function})
```

Below is an example showing how to use `useGlobalStateReducer`

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

let user = createGlobalState(initialGlobalState);

function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function Component(props){
    const [name, dispatch] = useGlobalStateReducer(myReducer, "user");
    
    // Other stuff ...
}
```

Or for the case of key based global state

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
    const [name, dispatch] = useGlobalStateReducer(myReducer, "user");

    // Other stuff ...
}
```

As stated earlier `useGlobalStateReducer` has a third **optional** parameter which is a configuration object, available configurations are:

`default` - This is used to specify the default value if you want `useGlobalStateReducer` to create a global state if it doesn't find the one for the key specified in the first argument. For example 

```js
const [user, dispatch] = useGlobalStateReducer(myReducer, "user", {default: null});
```

This piece of code means get the global state for the key `user` if it's not available in a store, create one and assign it the value `null`.


Also in addition to `default` configuration there is `persist` configuration which is the flag to determine whether to save/persist global state on localStorage or not if `useGlobalState` is going to create one dynamically.


Other allowed configurations are `selector` & `patcher`. These are used for specifying a way to select deeply nested state and update it.


`selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.


`patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.

Example.
```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

let user = createGlobalState(initialGlobalState);


function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function UserInfo(props){
    const selector = (user) => user.name;
    const patcher = (user, name) => {user.name = name};
    
    const [name, dispatch] = useGlobalStateReducer(myReducer, user, {selector: selector, patcher: pather});

    // Other stuffs
}
```

Or for the case of key based global states 

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
    
    const [name, dispatch] = useGlobalStateReducer(myReducer, "user", {selector: selector, patcher: pather});

    // Other stuffs
}
```

**FYI:** `useGlobalState` hook is derived from `useGlobalStateReducer` hook.

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
import {store, useGlobalState} from 'state-pool';


function initializeStore(){
    store.setState("count", 0);
}

initializeStore();

function ClicksCounter(props){
    const [count, setCount, updateCount] = useGlobalState("count");

    let incrementCount = (e) => {
        setCount(count+1);
    }

    let resetCounter = (e) => {
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
This is used to clear the entire store if you don't need the global states in it anymore or you want to reload/reset all global states. It accepts a function to run after clearing the store. Note the function runs before components subscribed to all global states in a store rerenders.

```js
// Signature
store.clear(fn: Function)
```

Below is an example showing how to use it

```js
import React from 'react';
import {store, useGlobalState} from 'state-pool';


function initializeStore(){
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
}

initializeStore();

function UserInfo(props){
    const [user, setUser, updateUser] = useGlobalState("user");

    let updateName = (e) => {
        updateUser(user => {
            user.name = e.target.value;
        });
    }

    let resetStore = (e) => {
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

### store.getState
`store.getState` is used to get a global state object by using a key, it accepts one required parameter which is a key(string) and another optional parameters which is the configuration object(available configurations are `default` and `persist`). `store.getState` returns a global state object. `store.getState` is often used along with `store.setState` in key based global state.

```js
// Signature
store.getState(key: String, {default: Any, persist: Boolean})
```

Here is how to use it

```js
const globalState = store.getState(key);
```

Most of time it's used to get a global state object from a store to pass to `useGlobalState` or `useGlobalStateReducer`. For example

```js
const globalState = store.getState(key);
const [state, setState, updateState] = useGlobalState(globalState);
```

Or

```js
const globalState = store.getState(key);
const [state, dispatch] = useGlobalStateReducer(reducer, globalState);
```

<br/>

## State Persistence
Sometimes you might want to save your global states in local storage probably because you might not want to lose them when the application is closed(i.e you want to retain them when the application starts).

**State Pool** makes it very easy to save your global states in local storage, all you need to do is use `persist` configuration to tell **state-pool** to save your global state in local storage when creating your global state.

No need to worry about updating or loading your global states, **state-pool** has already handled that for you so that you can focus on using your states.

`store.setState` accept a third optional parameter which is the configuration object, `persist` is a configuration which is used to tell **state-pool** whether to save your state in local storage or not. i.e

```js
store.setState(key: String, initialState: Any, {persist: Boolean})
```

Since **state-pool** allows you to create global state dynamically, it also allows you to save those newly created states in local storage if you want, that's why both `useGlobalState` and `useGlobalStateReducer` accepts persist configuration too which just like in `store.setState` it's used to tell **state-pool** whether to save your newly created state in local storage or not. i.e

```js
useGlobalState(key: String, {defaultValue: Any, persist: Boolean})
```
```js
useGlobalStateReducer(reducer: Function, key: String, {defaultValue: Any, persist: Boolean})
```

By default the value of `persist` in all cases is `false`(which means it doesn't save global states to the local storage), so if you want to activate it, set it to be `true`. What's even better about **state-pool** is that you get the freedom to choose what to save in local storage and what's not to, so you don't need to save the whole store in local storage.

<br/>

### store.LOCAL_STORAGE_UPDATE_DEBOUNCE_TIME
When storing state to local storage, `localStorage.setItem` should not be called too often because it triggers the expensive `JSON.stringify` operation to serialize global state in order to save it to the local storage.

Knowing this **state-pool** comes with `store.LOCAL_STORAGE_UPDATE_DEBOUNCE_TIME` which is the variable used to control debounce time for updating state to the local storage when global state changes. The default value is 1000 ms which is equal to 1 second. You can set your values if you don't want to use the default one.
<br/>

Pretty cool, right?
