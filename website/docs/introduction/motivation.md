---
sidebar_position: 1
---

# Motivation

![Build Status](https://github.com/yezyilomo/state-pool/actions/workflows/node.js.yml/badge.svg?branch=master)
[![Build Size](https://img.shields.io/bundlephobia/minzip/state-pool?label=bundle-size&style=flat)](https://bundlephobia.com/result?p=state-pool)
[![Version](https://img.shields.io/npm/v/state-pool?style=flat)](https://www.npmjs.com/package/state-pool)
[![Downloads](https://img.shields.io/npm/dt/state-pool.svg?style=flat)](https://www.npmjs.com/package/state-pool)

Transform your React app with our state management library! Declare global and local states like variables, powered by the magic of React hooks 🪄✨

## Features & Advantages
- Simple, familiar, flexible and very minimal core API but powerful
- Built-in support for state persistence
- Very easy to learn because its API is very similar to react state hook's API
- Support selecting deeply nested state
- Support creating state dynamically
- Can be used outside react components
- Doesn't wrap your app in context providers
- Very organized API, You can do almost everything with a single import


## State Flow
1. Create a state

2. Subscribe a component(s) to the state created

3. If a component wants to update the state, it sends update request

4. When a state receives update request, it performs the update and send signal to all components subscribed to it for them to update themselves(re-render)

You can try live examples [Here](https://yezyilomo.github.io/state-pool-examples)