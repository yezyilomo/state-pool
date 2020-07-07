# state-pool
React state management library based on global variables and react hooks.

## Architecture
![Architecture Diagram](https://raw.githubusercontent.com/yezyilomo/state-pool/master/docs/images/architecture_diagram.png)

### State Flow
1. Create a global state(which is technically a global variable)

2. Subscribe a component(s) to a created global state

3. If a component wants to update a global state, it sends update request

4. When a global state receives update request, it performs the update and send update signal to all components subscribed to it for them to update themselves(re-render)


## Installing
```
yarn add state-pool
```

Or 

```
npm install state-pool
```

## Getting Started
### Using Global State
```js
// Example 1.
import React from 'react';
import {store, useGlobalState} from 'state-pool';


store.setState("count", 0);

function ClicksCounter(props){
    const [count, updateCount] = useGlobalState("count");

    let incrementCount = (e) => {
        updateCount(count => count+1)
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


```js
// Example 2.
import React from 'react';
import {store, useGlobalState} from 'state-pool';


store.setState("user", {name: "Yezy", age: 25});

function UserInfo(props){
    const [user, updateUser] = useGlobalState("user");

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

### Using Local State
```js
// Example 1.
import React from 'react';
import {useLocalState} from 'state-pool';


function ClicksCounter(props){
    const [count, updateCount] = useLocalState(0);

    let incrementCount = (e) => {
        updateCount(count => count+1)
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


```js
// Example 2.
import React from 'react';
import {useLocalState} from 'state-pool';


function UserInfo(props){
    const [user, updateUser] = useLocalState({name: "Yezy", age: 25});

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

## API
### store
`store` is a container for key based global states. It provides few methods which are used to manage global states as explained below

### store.setState
`store.setState` is used to create global state and map it to a key so that you won't need to use global state object directly instead you use the key to get it, `store.setState` takes two required parameters, a key(string) to map to a global state object and the inital state, In additon to those two parameters it takes a third optional parameter which is the configuration object. `persist` is the only available config which is the flag to determine whether to save/persist state on localStorage or not.

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

### store.init
`store.init` is used to initialize the store, it accepts one required parameter which is the initial global states(key -> value) and another optional parameter which is the configuration object. `persist` is the only available config which is the flag to determine whether to save/persist state on localStorage or not. The `store.init` provides a way to set many global states at once, internally it's using `store.setState`.

```js
// Signature
store.init(initialGlobalStates: Object, {persist: Boolean});
```

Below is an example of how to use it

```js
const initialGlobalState = {
    user: {
        name: "Yezy",
        age: 25,
        email: "yezy@me.com"
    },
    profile: {
        url: "https://yezyilomo.com",
        rating: 5
    }
}
store.init(initialGlobalState);
```

You could accomplish the same thing with `store.setState` as
```js
const user = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const profile = {
    url: "https://yezyilomo.com",
    rating: 5
}

store.setState("user", user);
store.setState("profile", profile);
// As you see, we're setting each global state separately
```
So the choice is yours.

**Note:** Both `store.setState` and `store.init` should be used outside of the component, and usually you would want to initialized your store(by using either `store.setState` or `store.init`) before using it, to do so, ensure it's done before calling `ReactDOM.render` in order to load state before the application starts.

### useGlobalState hook
`useGlobalState` works just like `useState` hook but it accepts a key for the global state and returns an array of `[state, updateState]` rather than `[state, setState]`. In addition to the key parameter it accepts another optional parameter which is the config object, available configurations are `default`, `persist`, `selector` & `patcher`, these are discussed in detail later.

```js
// Signature
useGlobalState(key: String, {default: Any, persist: Boolean, selector: Function, patcher: Function})
```

For example if you have a store setup like

```js
const initialGlobalState = {
    user: {
        name: "Yezy",
        age: 25,
        email: "yezy@me.com"
    }
}

store.init(initialGlobalState);
```

you can use `useGlobalState` hook to get global state in a functional component like
```js
const [user, updateUser] = useGlobalState("user");
```

Here `updateUser` is a higher order function which accepts another function for updating user as an argument(this another functions takes user(old state) as the argument). So to update any state on user you can do 
```js
updateUser(function(user){
    user.name = "Yezy Ilomo";
    user.age = 26;
})
```
You can also return new state instead of changing state i.e
```js
updateUser(function(user){
    return {
        name: "Yezy Ilomo",
        age: 26,
        email: "yezy@me.com"
    }
})
```

As stated earlier `useGlobalState` accepts the second **optional** parameter(configuration object), `default` configuration is used to specify the default value if you want `useGlobalState` to create a global state if it doesn't find the one for the key specified in the first argument. For example 

```js
const [user, updateUser] = useGlobalState("user", {default: null});
```
This piece of code means get me the global state for the key `user` if you don't find it in the store, create and assign it the value `null`.

Also in addition to `default` configuration there is `persist` configuration which is the flag to determine whether to save/persist state on localStorage or not if it's going to create one.


Other allowed configurations are `selector` & `patcher`. These configurations are used for specifying a way to select deeply nested state and update it.


`selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.


`patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.

Example.
```js
const initialGlobalState = {
    user: {
        name: "Yezy",
        age: 25,
        email: "yezy@me.com"
    }
}

store.init(initialGlobalState);


function UserName(props){
    const selector = (user) => user.name;  // Subscribe to user.name only
    const patcher = (user, name) => {user.name = name};  // Update user.name

    const [name, updateName] = useGlobalState("user", {selector: selector, patcher: pather});

    let handleNameChange = (e) => {
        updateName(name => e.target.value);
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

### useLocalState hook
`useLocalState` works just like `useGlobalState` hook except it accepts initial state as the argument and it's used to manage state locally(within a functional component). Basically `useLocalState` is equivalent to `useState` with improved way to update state(especially nested ones). 

```js
// Signature
useLocalState(initialState)
```

For example you can use `useLocalState` hook to manage local state in a functional component as below

```js
const initialUserState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}
const [user, updateUser] = useLocalState(initialUserState);
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

### useGlobalStateReducer hook
`useGlobalStateReducer` works just like `useReducer` hook but it accepts a reducer and a key for the global state. In addition to the two parameters mentioned it accepts other optinal perameter which is the configuration object, available configurations are `default`, `persist`, `selector` & `patcher`, these are discussed in detail later.


```js
// Signature
useGlobalStateReducer(reducer: Function, key: String, {default: Any, persist: Boolean, selector: Function, patcher: Function})
```

For example if you have a store setup like

```js
const initialGlobalState = {
    user: {
        name: "Yezy",
        age: 25,
        email: "yezy@me.com"
    }
}

store.init(initialGlobalState);
```

you can use `useGlobalStateReducer` hook to get global state in a functional component like
```js
function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

const [name, dispatch] = useGlobalStateReducer(myReducer, "user");
```

As stated earlier `useGlobalStateReducer` has a third **optional** parameter(configuration object). `default` configuration is used to specify the default value if you want `useGlobalStateReducer` to create a global state if it doesn't find the one for the key specified in the first argument. For example 

```js
const [user, dispatch] = useGlobalStateReducer(myReducer, "user", {default: null});
```
This piece of code means get me the global state for the key `user` if you don't find it in the store, create and assign it the value `null`.

In addition to `default` configuration it has `persist` configuration which is the flag to determine whether to save/persist state on localStorage or not, if it's going to create one.

Other allowed configurations are `selector` & `patcher`. These configurations are used for specifying a way to select deeply nested state and update it.


`selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested state.


`patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.

Example.
```js
const initialGlobalState = {
    user: {
        name: "Yezy",
        age: 25,
        email: "yezy@me.com"
    }
}

store.init(initialGlobalState);


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


## State Persistence
Saving/persisting global states in localStorage with `state-pool` is very easy, all you need to do is tell `state-pool` to save your state in localStorage by using `persist` configuration when creating your global state, no need to worry about updating or loading it, `state-pool` already handled that for you so that you can focus on using your state. As discussed before both `store.setState` and `store.init` accept an optional parameter(configuration object) with `persist` configuration which is used to tell `state-pool` whether to save your state in local storage or not. i.e

```js
store.setState(key: String, initialState: Any, {persist: Boolean})
```

```js
store.init(initialGlobalStates: Object, {persist: Boolean});
```

Since `state-pool` allows you to create global state dynamically(at runtime), it also allows you to save those created states to localStorage if you want, that's why both `useGlobalState` and `useGlobalStateReducer` accepts `persist` configuration too which just like in `store.setState` and `store.init` it's used to tell `state-pool` whether to save your newly created state in local storage or not. i.e

```js
useGlobalState(key: String, {defaultValue: Any, persist: Boolean})
```

```js
useGlobalStateReducer(reducer: Function, key: String, {defaultValue: Any, persist: Boolean})
```
By default the value of `persist` in all cases is `false`(which means it doesn't save global state to the local storage), so if you want to activate it, set it to be `true`.
What's even better about `state-pool` is that you get the freedom to choose what to save on localStorage and what not to. With `state-pool` you don't need to save the whole store in local storage.

### store.LOCAL_STORAGE_UPDATE_DEBOUNCE_TIME(in milliseconds)
This is the variable used to set debounce time for updating state to the localStorage when global state changes. `localStorage.setItem` should not be called too often because it triggers the expensive `JSON.stringify` operation to serialize global state in order to save it to the localStorage. Therefore this variable is used to control that, The default value is 1000 ms which is equal to 1 second. You can set your values if you don't want to use the default one.
<br/>

### store.remove
This is used to remove a global state from store if you don't need it anymore or you want to reload/reset it. It accepts a global state key or a list of keys to remove and a function to run after removing global state(s) and before components subscribed to removed global state(s) rerenders.

```js
// Signature
store.remove(key: String/[String], fn: Function)
```

Below is an example showing how to use it

```js
// Example 1.
import React from 'react';
import {store, useGlobalState} from 'state-pool';


function initializeStore(){
    store.setState("count", 0);
}

initializeStore();

function ClicksCounter(props){
    const [count, updateCount] = useGlobalState("count");

    let incrementCount = (e) => {
        updateCount(count => count+1)
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

### store.clear
This is used to clear the entire store if you don't need the global states in it anymore or you want to reload/reset all global states. It accepts a function to run after clearing the store and before components subscribed to all global states in it rerenders.

```js
// Signature
store.clear(fn: Function)
```

Below is an example showing how to use it

```js
// Example 2.
import React from 'react';
import {store, useGlobalState} from 'state-pool';


function initializeStore(){
    const initialGlobalState = {
        user: {
            name: "Yezy",
            age: 25,
            email: "yezy@me.com"
        },
        profile: {
            url: "https://yezyilomo.com",
            rating: 5
        }
    }
    store.init(initialGlobalState);
}

initializeStore();

function UserInfo(props){
    const [user, updateUser] = useGlobalState("user");

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
From the code above, when you click `Reset Store` button `store.clear` will remove all global states from the store and create them again by executing `initializeStore`. This might come in handy when you need to clear all data when user logs out of the application.


**NOTE:** both `store.remove` and `store.clear` when executed causes all components subscribed to global states which are removed to rerender.


## Low level APIs
`state-pool` provides a low level API which you can use to add other features on top of it. You probably won't need to use these directly but if you do nothing stops you from using it.

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

Most times it's used to get a global state object to pass to `useGlobal` or `useGlobalReducer`. For example

```js
const globalState = store.getState(key);
const [state, setState] = useGlobal(globalState);
```

Or

```js
const globalState = store.getState(key);
const [state, setState] = useGlobalReducer(reducer, globalState);
```

### createGlobalState
**state-pool** allows you to create global state object with `createGlobalState`, it accepts one argument which is the initial state.

```js
// Signature
createGlobalState(initialState: Any)
```

Here is how to use it

```js
const userName = createGlobalState("Yezy");
```

**Note:** This should be used outside of your component. It is mostly used by `store.setState` to create global state object.

### useGlobal hook
`useGlobal` works just like `useState` hook but it accepts one required parameter which is the global state object and another optional parameter which is the configuration object(allowed configurations are `selector` & `patcher`). These configurations are used for specifying a way to select deeply nested state and update it.

```js
// Signature
useGlobal(globalState: Object, {selector: Function, patcher: Function})
```

For example if you have a global state like
```js
const userName = createGlobalState("Yezy");
```

you can use `useGlobal` hook to get global state in a functional component like
```js
const [name, setName] = useGlobal(userName);
```
This is mostly used by `useGlobalState`.

### useGlobalReducer hook
`useGlobalReducer` works just like `useReducer` hook but it accepts a reducer and a global state object. In addition to those two parameters it accepts another optional parameter which is the configuration object(available configurations are `selector` & `patcher`) just like in `useGlobal`. These configurations are used for specifying a way to select deeply nested state and update it.

```js
// Signature
useGlobalReducer(reducer: Function, globalState: Object)
```

For example if you have a global state like
```js
const userName = createGlobalState("Yezy");
```

you can use `useGlobalReducer` hook to get global state in a functional component like
```js
function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

const [name, dispatch] = useGlobalReducer(myReducer, userName);
```
**FYI:** `useGlobal` hook is made from `useGlobalReducer` hook.


## Categorization of API for managing global state
The API for managing global state is divided into two parts(Non key based and key based), Key based API is made by using Non key based API, so Non key based is the low level API. We encourage using high level API(key based API) but if you like nothing stops you from using lower level API(Non key based API), infact it's as simple as the key based API. Below is a table showing how these two APIs corresponds.

| Non Key Based               | Key Based     |
| ----------------------------|:-------------:|
| createGlobalState           | store, store.init, store.setState, store.getState |
| useGlobal                   | useGlobalState, store.subscribe |
| useGlobalReducer            | useGlobalStateReducer     |

Pretty cool, right?
