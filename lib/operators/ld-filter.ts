import { MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { isLoaded, Loadable } from '../loadable';

export function ldFilter<T, S extends T>(
  predicate: (value: T, index: number) => value is S,
): OperatorFunction<Loadable<T>, Loadable<S>>;

export function ldFilter<T>(
  predicate: (value: T, index: number) => boolean,
): MonoTypeOperatorFunction<Loadable<T>>;

export function ldFilter<T>(
  predicate: (value: T, index: number) => boolean,
): MonoTypeOperatorFunction<Loadable<T>> {
  return (source: Observable<Loadable<T>>) =>
    source.pipe(
      filter((loadableValue, index) => {
        if (!isLoaded(loadableValue)) {
          return true;
        } else {
          return predicate(loadableValue.data, index);
        }
      }),
    );
}
