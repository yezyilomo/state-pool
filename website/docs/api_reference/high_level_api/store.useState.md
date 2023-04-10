---
sidebar_position: 3
---

# store.useState
`store.useState` is a hook that's used to get a state from a store, it's a way for a component to subscribe to a state from a store. `store.useState` works just like `React.useState` hook but it accepts a key for the state and returns an array of `[state, setState, updateState]` rather than `[state, setState]`. In addition to the key parameter it also accept another optional parameter which is the config object, available configurations are `default`, `persist`, `selector` & `patcher`, these will be discussed in detail later.

```js
// Signature
store.useState(
    key: String,
    config?: {default: Any, persist: Boolean, selector: Function, patcher: Function}
)
```

Below is an example showing how to use `store.useState` hook

```js
const initialState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

store.setState("user", initialState);

function Component(props){
    const [user, setUser, updateUser] = store.useState("user");
    // Other stuff
}
```

Here `updateUser` is a higher order function which accepts another function for updating user as an argument(this another functions takes user(old state) as the argument). So to update any value on user you could do

```js
updateUser(function(user){
    user.name = "Yezy Ilomo";
    user.age = 26;
})
```

Or you could just use `setUser` instead of `updateUser` i.e

```js
setUser({name: "Yezy Ilomo", age: 26, email: "yezy@me.com"});
```

Or

```js
setUser(function(user){
    return {
        name: "Yezy Ilomo",
        age: 26,
        email: user.email
    }
})
```

As stated earlier `store.useState` takes a second optional parameter which is a configuration object, available configurations are:
- `default` - This is used to specify the default value if you want `store.useState` to create a state if it doesn't find the one for the key specified in the first argument. For example

  ```js
  const [user, setUser, updateUser] = store.useState("user", {default: null});
  ```

  This piece of code means, get the state for the key "user" if it's not available in a store, create one and assign it the value `null`.

- Also in addition to `default` configuration there is `persist` configuration which is the flag to determine whether to save/persist state in your preferred storage or not. Here `persist` configuration is only used if `store.useState` is going to create state dynamically(by using `default` config).
<br/>

Other allowed configurations are `selector` & `patcher`. These are used for specifying a way to select deeply nested state and update it.

- `selector` should be a function which takes one parameter which is the state and returns a selected value. The purpose of this is to subscribe to a deeply nested state or derived state.

- `patcher` should be a function which takes two parameters, the first is the state and the second is the selected value. The purpose of this is to merge back the selected value to the state once it's updated.

  Example.
  ```jsx
  const initialState = {
      name: "Yezy",
      age: 25,
      email: "yezy@me.com"
  }
  
  store.setState("user", initialState);
  
  
  function UserName(props){
      const selector = (user) => user.name;  // Subscribe to user.name only
      const patcher = (user, name) => {user.name = name};  // Update user.name
  
      const [name, setName] = store.useState("user", {selector: selector, patcher: patcher});
  
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
