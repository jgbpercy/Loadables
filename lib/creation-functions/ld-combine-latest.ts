import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { areLoaded } from '../loadable';
import { LoadableObservable } from '../loadable-observable';
import { LoadableObservableInputTuple } from '../types/types';

export function ldCombineLatest<T extends readonly unknown[]>(
  sources: readonly [...LoadableObservableInputTuple<T>],
): LoadableObservable<T>;

export function ldCombineLatest(
  sources: readonly LoadableObservable<unknown>[],
): LoadableObservable<unknown> {
  return new LoadableObservable(
    combineLatest(sources.map((lo) => lo.fullObservable)).pipe(
      map((loadables) =>
        areLoaded(loadables)
          ? { loaded: true, data: loadables.map((loadable) => loadable.data) }
          : { loaded: false },
      ),
    ),
  );
}
