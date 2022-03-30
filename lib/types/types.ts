import { LoadableObservable } from '../loadable-observable';

export type LoadableObservableInputTuple<T> = {
  [K in keyof T]: LoadableObservable<T[K]>;
};
