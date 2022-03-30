import { Observable } from "rxjs";
import { LoadableObservable } from '../loadable-observable';
import { map } from "rxjs/operators";

export function ofLoadedObservable<TData>(
  ofObservable: Observable<TData>,
): LoadableObservable<TData> {
  return new LoadableObservable(
    ofObservable.pipe(
      map(value => {
        return {
          loaded: true,
          data: value,
        };
      }),
    ),
  );
}
