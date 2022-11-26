type Selector<T> = (state: any) => T
type Patcher = (state: any, selectedStateValue: any) => void
type Reducer = (state: any, action: any) => any
type HookConfig = { patcher?: Patcher, selector?: Selector<any> }
type Unsubscribe = () => void


export {
    Selector, Patcher, Reducer, HookConfig, Unsubscribe
}