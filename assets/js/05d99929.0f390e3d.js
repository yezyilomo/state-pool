"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6252],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return g}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),f=l(r),g=a,d=f["".concat(c,".").concat(g)]||f[g]||u[g]||o;return r?n.createElement(d,i(i({ref:t},p),{},{components:r})):n.createElement(d,i({ref:t},p))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=f;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},7502:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return g},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return u}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],s={sidebar_position:5},c="store.getState",l={unversionedId:"api_reference/high_level_api/store.getState",id:"api_reference/high_level_api/store.getState",title:"store.getState",description:"store.getState is used to get a global state object from a store, it accepts one required parameter which is a key(string) and another optional parameters which is the configuration object(available configurations are default and persist works just like in store.setState). When called, store.getState returns a global state object.",source:"@site/docs/api_reference/high_level_api/store.getState.md",sourceDirName:"api_reference/high_level_api",slug:"/api_reference/high_level_api/store.getState",permalink:"/docs/api_reference/high_level_api/store.getState",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api_reference/high_level_api/store.getState.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"store.useReducer",permalink:"/docs/api_reference/high_level_api/store.useReducer"},next:{title:"store.subscribe",permalink:"/docs/api_reference/high_level_api/store.subscribe"}},p={},u=[],f={toc:u};function g(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"storegetstate"},"store.getState"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"store.getState")," is used to get a global state object from a store, it accepts one required parameter which is a key(string) and another optional parameters which is the configuration object(available configurations are ",(0,o.kt)("inlineCode",{parentName:"p"},"default")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"persist")," works just like in ",(0,o.kt)("inlineCode",{parentName:"p"},"store.setState"),"). When called, ",(0,o.kt)("inlineCode",{parentName:"p"},"store.getState")," returns a global state object."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"// Signature\nstore.getState(key: String, config?: {default: Any, persist: Boolean})\n")),(0,o.kt)("p",null,"Here is how to use it"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"const globalState = store.getState(key);\n")))}g.isMDXComponent=!0}}]);