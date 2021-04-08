import { from, Observable, ObservableInput, of, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Loadable } from '../loadable';

export function ldSwitchMap<T, I>(
  project: (dataValue: T, index: number) => ObservableInput<Loadable<I>>,
): OperatorFunction<Loadable<T>, Loadable<I>> {
  return (source: Observable<Loadable<T>>) =>
    source.pipe(
      switchMap((loadableValue, index) => {
        if (!loadableValue.loaded) {
          return of(loadableValue);
        } else {
          return from(project(loadableValue.data, index));
        }
      }),
    );
}
