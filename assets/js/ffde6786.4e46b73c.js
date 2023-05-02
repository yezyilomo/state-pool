"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2913],{3905:(e,t,a)=>{a.d(t,{Zo:()=>S,kt:()=>d});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},s=Object.keys(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var u=r.createContext({}),i=function(e){var t=r.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},S=function(e){var t=i(e.components);return r.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},T=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,s=e.originalType,u=e.parentName,S=o(e,["components","mdxType","originalType","parentName"]),T=i(a),d=n,l=T["".concat(u,".").concat(d)]||T[d]||p[d]||s;return a?r.createElement(l,c(c({ref:t},S),{},{components:a})):r.createElement(l,c({ref:t},S))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var s=a.length,c=new Array(s);c[0]=T;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:n,c[1]=o;for(var i=2;i<s;i++)c[i]=a[i];return r.createElement.apply(null,c)}return r.createElement.apply(null,a)}T.displayName="MDXCreateElement"},5229:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>c,default:()=>p,frontMatter:()=>s,metadata:()=>o,toc:()=>i});var r=a(7462),n=(a(7294),a(3905));const s={sidebar_position:4},c="Typing State",o={unversionedId:"api_reference/typing-state",id:"api_reference/typing-state",title:"Typing State",description:"All state related functions support implicity and explicity typing.",source:"@site/docs/api_reference/typing-state.md",sourceDirName:"api_reference",slug:"/api_reference/typing-state",permalink:"/state-pool/docs/api_reference/typing-state",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api_reference/typing-state.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"useReducer",permalink:"/state-pool/docs/api_reference/low_level_api/useReducer"}},u={},i=[],S={toc:i};function p(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},S,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"typing-state"},"Typing State"),(0,n.kt)("p",null,"All state related functions support implicity and explicity typing."),(0,n.kt)("p",null,"Examples"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"store.setState<number>('count', 0);\n\nstore.useState<number>('count');\n\nstore.useReducer<number, action>(reducer, 'count');\n\n// For none key based\nconst count = createState<number>(0);\n\nuseState<number>(count);\n\nuseReducer<number, action>(reducer, count);\n\n\n// Typing with selector\nstore.setState<{name: string, age: number}>('user', {name: 'Yezy', age: 25});\n\nstore.useState<string>('user', {selector: user => user.name});\nstore.useState<number>('age', {selector: user => user.age});\n\nstore.useReducer<string, action>(reducer, 'user', {selector: user => user.name});\nstore.useReducer<number, action>(reducer, 'user', {selector: user => user.age});\n\n// For none key based\nconst user = createState<{name: string, age: number}>({name: 'Yezy', age: 25});\n\nuseState<string>(user, {selector: user => user.name});\nuseState<number>(user, {selector: user => user.age});\n\nuseReducer<string, action>(reducer, user, {selector: user => user.name});\nuseReducer<number, action>(reducer, user, {selector: user => user.age});\n")),(0,n.kt)("br",null),(0,n.kt)("br",null),(0,n.kt)("h1",{id:"blue-print-for-typing-hooks"},"Blue print for typing hooks"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Note:")," ",(0,n.kt)("inlineCode",{parentName:"p"},"T")," is for base/original state type, ",(0,n.kt)("inlineCode",{parentName:"p"},"ST")," for selected state type and ",(0,n.kt)("inlineCode",{parentName:"p"},"A")," for reducer action."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"// useState.js   (For useState)\n\nconst [state: T, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = useState<T>(state: State<T> | T)\n\nconst [state: ST, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = useState<ST, T>(state: State<T> | T, { selector: Selector<ST> })\n\nconst [state: ST, setState: SetState<ST>, updateState: UpdateState<ST>, stateObj: State<T>] = useState<ST, T>(state: State<T> | T, { selector: Selector<ST>, patcher: Patcher<ST> })\n\n\n// State.js   (For state.useState)\n\nconst [state: T, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = state<T>.useState()\n\nconst [state: ST, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = state<T>.useState<ST>({ selector: Selector<ST> })\n\nconst [state: ST, setState: SetState<ST>, updateState: UpdateState<ST>, stateObj: State<T>] = state<T>.useState<ST>({ selector: Selector<ST>, patcher: Patcher<ST> })\n\n// Store.js   (For store.useState)\n\nconst [state: T, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = store.useState<T>(key, { default: T });\n\nconst [state: ST, setState: SetState<T>, updateState: UpdateState<T>, stateObj: State<T>] = store.useState<ST, T>(key, { selector: Selector<ST>, default: T })\n\nconst [state: ST, setState: SetState<ST>, updateState: UpdateState<ST>, stateObj: State<T>] = store.useState<ST, T>(key, { selector: Selector<ST>, patcher: Patcher<ST>, default: T })\n\n\n// useReducer.js   (For useReducer)\n\ntype Reducer = (state: T, action: A) => T\nconst [state: T, dispatch: (action: A) => void, stateObj: State<T>] = useReducer<T, A>(type Reducer = Reducer<T, A>, state: State<T> | T)\n\ntype Reducer = (state: T, action: A) => T\nconst [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, state: State<T> | T, { selector: Selector<ST> })\n\ntype Reducer = (state: ST, action: A) => ST\nconst [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, state: State<T> | T, { selector: Selector<ST>, patcher: Patcher<ST> })\n\n\n// State.js  (For state.useReducer)\n\ntype Reducer = (state: T, action: A) => T\nconst [state: T, dispatch: (action: A) => void, stateObj: State<T>] = state<T>.useReducer<T, A>(type Reducer = Reducer<T, A>)\n\ntype Reducer = (state: T, action: A) => T\nconst [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = state<T>.useReducer<ST, A>(type Reducer = Reducer<T, A>, { selector: Selector<ST> })\n\ntype Reducer = (state: ST, action: A) => ST\nconst [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = state<T>.useReducer<ST, A>(type Reducer = Reducer<T, A>, { selector: Selector<ST>, patcher: Patcher<ST> })\n\n\n// Store.js   (For store.useReducer)\n\ntype Reducer = (state: T, action: A) => T\nconst [state: T, dispatch: (action: A) => void, stateObj: State<T>] = store.useReducer<T, A>(type Reducer = Reducer<T, A>, key, { default: T });\n\ntype Reducer = (state: T, action: A) => T\nconst [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = store.useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, key, { selector: Selector<ST>, default: T })\n\ntype Reducer = (state: ST, action: A) => ST\nconst [state: ST, dispatch: (action: A) => void, stateObj: State<T>] = store.useReducer<ST, A, T>(type Reducer = Reducer<ST, A>, key, { selector: Selector<ST>, patcher: Patcher<ST>, default: T })\n")))}p.isMDXComponent=!0}}]);