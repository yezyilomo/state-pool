---
sidebar_position: 3
---

# Derived & Nested State
With state pool you can subscribe to deeply nested or derived state. Both `store.useState` and `store.useReducer` accepts an optional configuration parameter with which you can pass `selector` & `patcher` options that are used to derive and update state.

Here is a simple example showing how to use `selector` & `Patcher` options

```jsx
store.setState("user", {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
});


function UserName(props){
    const selector = (user) => user.name;  // Subscribe to user.name only
    const patcher = (user, name) => {user.name = name};  // Update user.name

    const [name, setName] = store.useState("user", {selector: selector, patcher: patcher});

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    return (
        <div>
            Name: {name} <br/>
            <input type="text" value={name} onChange={handleNameChange}/>
        </div>
    );
}
```
Here `selector` & `patcher` are used for specifying a way to select deeply nested state(derive new state) and update it.

- `selector` should be a function which takes one parameter which is the global state and returns a selected value. The purpose of this is to subscribe to a deeply nested or derived state.

- `patcher` should be a function which takes two parameters, the first is the global state and the second is the selected value. The purpose of this is to merge back the selected value to the global state once it's updated.