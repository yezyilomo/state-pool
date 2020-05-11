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
For now you can use this repository link because it's not yet published to npm
```
yarn add https://github.com/yezyilomo/state-pool
```

Or 

```
npm install https://github.com/yezyilomo/state-pool
```

For future use(When it's published to npm)
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


store.init({count: 0})

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


store.init({
    user: {name: "Yezy", age: 25}
})

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
`store` is a container for key based global states. It provides few methods which are used to manage it as explained below

### store.init
`store.init` is used to initialize the store, it accepts a single parameter which is the initial global state, Below is an example of how to use it

```js
const initialGlobalState = {
    user: {
        name: "Yezy",
        age: 25,
        email: "yezy@me.com"
    }
}

store.init(initialState);
```
**Note:** Store must be initialized before using it and the initialization must be done before calling `ReactDOM.render` in order to load state before the application starts.


### store.setState
`store.setState` is used to create global state and map it to a key so that you won't need to use global state object directly instead you use the key to get it, `store.setState` accepts a key(string) to map to a global state object which is going to be created, Here is how to use it

```js
// Must initialize the store first before using it
store.init({})

const userState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}
store.setState("user", userState);
```

### useGlobalState hook
`useGlobalState` works just like `useState` hook but it accepts a key for the global state and returns an array of `[state, updateState]` rather than `[state, setState]`, For example if you have a store setup like

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
[user, updateUser] = useGlobalState("user");
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

`useGlobalState` has the second **optional** argument. This argument is used to specify the default value if you want `useGlobalState` to create it if it doesn't find the global state for the key you specified in the first argument. For example 

```js
[user, updateUser] = useGlobalState("user", null);
```
This piece of code means get me the global state for the key `user` if you don't find it in the store, create and assign it the value `null`.


### useLocalState hook
`useLocalState` works just like `useGlobalState` hook except it accepts initial state as the argument and it's used to manage state locally(within a functional component). Basically `useLocalState` is equivalent to `useState` with improved way to update state(especially nested ones). For example you can use `useLocalState` hook to manage local state in a functional component as below

```js
const initialUserState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}
[user, updateUser] = useLocalState(initialUserState);
```

Just like in `useGlobalState`, `updateUser` is a higher order function which accepts another function for updating user as an argument(this another functions takes user(old state) as the argument). So to update any state on user you can do 
```js
updateUser(function(user){
    user.name = "Yezy Ilomo";
    user.age = 26;
})
```
Here also you can return new state instead of changing state i.e
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
`useGlobalStateReducer` works just like `useReducer` hook but it accepts a reducer and a key for the global state, For example if you have a store setup like

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

[name, dispatch] = useGlobalStateReducer(myReducer, "user");
```

Just like `useGlobalState`, `useGlobalStateReducer` has the third **optional** argument. This argument is used to specify the default value if you want `useGlobalStateReducer` to create it if it doesn't find the global state for the key you specified in the second argument. For example 

```js
[user, dispatch] = useGlobalStateReducer(myReducer, "user", null);
```
This piece of code means get me the global state for the key `user` if you don't find it in the store, create and assign it the value `null`.

<br/>

## Less used APIs
You probably won't need to use these directly as they're mostly used intenally.

### store.getState
`store.getState` is used to get a global state object by using a key, it accepts a key(string) and returns a global state object. `store.getState` is often used along with `store.setState` in key based global state. Here is how to use it

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
**state-pool** allows you to create global state object with `createGlobalState`, it accepts one argument which is the initial state. Here is how to use it

```js
const userName = createGlobalState("Yezy");
```

**Note:** This should be used outside of your component. It is mostly used by `store.setState` to create global state object.


### useGlobal hook
`useGlobal` works just like `useState` hook but it accepts a global state object, For example if you have a global state like
```js
const userName = createGlobalState("Yezy");
```

you can use `useGlobal` hook to get global state in a functional component like
```js
[name, setName] = useGlobal(userName);
```
This is mostly used by `useGlobalState`.


### useGlobalReducer hook
`useGlobalReducer` works just like `useReducer` hook but it accepts a reducer and a global state object, For example if you have a global state like
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

[name, dispatch] = useGlobalReducer(myReducer, userName);
```
**FYI:** `useGlobal` hook is made from `useGlobalReducer` hook.


## Categorization of API for managing global state
The API for managing global state is divided into two parts(Non key based and key based), Key based API is made by using Non key based API, so Non key based is the low level API. We encourage using high level API(key based API) but if you like nothing stops you from using lower level API(Non key based API), infact it's as simple as the key based API. Below is a table showing how these two APIs corresponds.

| Non Key Based               | Key Based     |
| ----------------------------|:-------------:|
| createGlobalState           | store, store.init, store.setState, store.getState |
| useGlobal                   | useGlobalState      |
| useGlobalReducer            | useGlobalStateReducer     |

Pretty cool, right?