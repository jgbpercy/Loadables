import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { isLoaded, Loadable } from '../loadable';

export function ldMap<T, R>(
  project: (value: T, index: number) => R,
): OperatorFunction<Loadable<T>, Loadable<R>> {
  return (source: Observable<Loadable<T>>) =>
    source.pipe(
      map((loadableValue, index) => {
        if (!isLoaded(loadableValue)) {
          return { loaded: false };
        } else {
          return { loaded: true, data: project(loadableValue.data, index) };
        }
      }),
    );
}
