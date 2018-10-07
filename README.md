# Loadables for RxJS

### What?

A simple abstraction built on top of RxJS to represent values that can be loaded and reloaded asynchronously.

Work in progress.

### Why?

Aside from error and complete notifications, RxJS has no opinion about the nature or importance of each value passed from an observable to an observer. That is, of course, a very good thing for a general library! However, when a value is loaded (and potentially reloaded) asynchronously, it can be advantageous to treat notifications that the value is loading differently to notifications that a loaded value has arrived. Having to create two separate observables that track each of these concepts can also be cumbersome. Loadables for RxJS is intended to address that awkwardness.

Also, I made this in order to learn how to create and publish an TypeScript npm package :)

### How?

Get via npm:

```
npm i rxjs-loadables
```

The Loadables library contains three main classes:

- `Loadable`: Represents a variable that can be in a loading state and therefore not contain a currently-valid value, or can be loaded and will therefore contain a value. Should not generally be used directly within user code.
- `LoadableObservable`: A thin layer on top of an RxJS `Observable`, a LoadableObservable should be used by code that wants to consume a loadable value.
- `LoadablesSubject`: A thin layer on top of an RxJS `BehaviorSubject`, LoadableSubject should be used by the code that manages (loads) a loadable value.

More documentation to come!

### Acknowledgements

Thanks to all the people that make RxJS.

Much of the build configuration stuff in this project (npm scripts, tsconfig, webpack config) is currently copied with tweaks and modifications from Nicholas Jamieson / cartant's https://github.com/cartant/rxjs-etc
