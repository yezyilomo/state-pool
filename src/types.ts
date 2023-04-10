// Note; In all cases ST stands for type of selected state and T for base/original state

// Function to call to unsubscribe from a state or a store
export type Unsubscribe = () => void

// Reducer tha's passed in useReducer hook
export type Reducer<ST, A> = (state: ST, action: A) => ST

// What's important is the type of what's returned, lib is the one passing state, so noworries
export type Selector<ST> = (state: any) => ST

// What's important is the type of value(to set), the lib is the one passing state, so noworries
export type Patcher<ST> = (state: any, value: ST) => void

// Function for initializing state
export type StateInitializer<T> = () => T

// What's important is the export type of what's returned, lib is the one passing state
export type StateUpdater<ST> = (state: ST) => ST

// Given the obj to modify, it does modifications and return nothing
export type StateModifier<ST> = (state: ST) => void

// Setter returned by useState hook
export type SetState<ST> = (newState: ST | StateUpdater<ST>) => void

// Updater returned by useState hook
export type UpdateState<ST> = (updater: StateModifier<ST>) => void