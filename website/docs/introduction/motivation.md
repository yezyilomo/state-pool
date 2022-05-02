---
sidebar_position: 1
---

# Motivation

![Build Status](https://github.com/yezyilomo/state-pool/actions/workflows/node.js.yml/badge.svg?branch=master)
[![Build Size](https://img.shields.io/bundlephobia/minzip/state-pool?label=bundle-size&style=flat)](https://bundlephobia.com/result?p=state-pool)
[![Version](https://img.shields.io/npm/v/state-pool?style=flat)](https://www.npmjs.com/package/state-pool)
[![Downloads](https://img.shields.io/npm/dt/state-pool.svg?style=flat)](https://www.npmjs.com/package/state-pool)

State pool is a React state management library based on global variables and react hooks.

## Features & Advantages
- Simple, familiar, flexible and very minimal core API but powerful
- Built-in support for state persistence
- Very easy to learn because its API is very similar to react state hook's API
- Support selecting deeply nested state
- Support creating global state dynamically
- Can be used outside react components
- Support both key based and non-key based global state
- States are stored as global variables(Can be used anywhere)
- Doesn't wrap your app in context providers
- Very organized API, You can do almost everything with a single import


## Architectural Diagram
![Architecture Diagram](https://raw.githubusercontent.com/yezyilomo/state-pool/master/docs/images/architecture_diagram.png)


## State Flow
1. Create a global state

2. Subscribe a component(s) to a created global state

3. If a component wants to update a global state, it sends update request

4. When a global state receives update request, it performs the update and send signal to all components subscribed to it for them to update themselves(re-render)