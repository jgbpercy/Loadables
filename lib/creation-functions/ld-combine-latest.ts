import { combineLatest, Observable, SchedulerLike } from 'rxjs';
import { isArray } from 'rxjs/internal/util/isArray';
import { isScheduler } from 'rxjs/internal/util/isScheduler';
import { map } from 'rxjs/operators';

import { isLoaded, Loadable } from '../loadable';
import { LoadableObservable } from '../loadable-observable';

export function ldCombineLatest<T, T2>(
  v1: LoadableObservable<T>,
  v2: LoadableObservable<T2>,
  scheduler?: SchedulerLike,
): LoadableObservable<[T, T2]>;
export function ldCombineLatest<T, T2, T3>(
  v1: LoadableObservable<T>,
  v2: LoadableObservable<T2>,
  v3: LoadableObservable<T3>,
  scheduler?: SchedulerLike,
): LoadableObservable<[T, T2, T3]>;
export function ldCombineLatest<T, T2, T3, T4>(
  v1: LoadableObservable<T>,
  v2: LoadableObservable<T2>,
  v3: LoadableObservable<T3>,
  v4: LoadableObservable<T4>,
  scheduler?: SchedulerLike,
): LoadableObservable<[T, T2, T3, T4]>;
export function ldCombineLatest<T, T2, T3, T4, T5>(
  v1: LoadableObservable<T>,
  v2: LoadableObservable<T2>,
  v3: LoadableObservable<T3>,
  v4: LoadableObservable<T4>,
  v5: LoadableObservable<T5>,
  scheduler?: SchedulerLike,
): LoadableObservable<[T, T2, T3, T4, T5]>;
export function ldCombineLatest<T, T2, T3, T4, T5, T6>(
  v1: LoadableObservable<T>,
  v2: LoadableObservable<T2>,
  v3: LoadableObservable<T3>,
  v4: LoadableObservable<T4>,
  v5: LoadableObservable<T5>,
  v6: LoadableObservable<T6>,
  scheduler?: SchedulerLike,
): LoadableObservable<[T, T2, T3, T4, T5, T6]>;

export function ldCombineLatest<T>(
  array: LoadableObservable<T>[],
  scheduler?: SchedulerLike,
): LoadableObservable<T[]>;
export function ldCombineLatest<R>(
  array: LoadableObservable<any>[],
  scheduler?: SchedulerLike,
): LoadableObservable<R>;

export function ldCombineLatest(
  ...loadableObservables: Array<
    any | LoadableObservable<any> | Array<LoadableObservable<any>> | SchedulerLike
  >
): LoadableObservable<any> {
  let scheduler: SchedulerLike | null = null;
  const lastArg = loadableObservables[loadableObservables.length - 1];
  if (isScheduler(lastArg)) {
    scheduler = lastArg;
    loadableObservables.pop();
  }

  if (loadableObservables.length === 1 && isArray(loadableObservables[0])) {
    // tslint:disable-next-line:no-parameter-reassignment
    loadableObservables = loadableObservables[0];
  }

  const fullObservables = (loadableObservables as LoadableObservable<any>[]).map(
    lo => lo.fullObservable,
  );
  let combinedObservables: Observable<Loadable<any>[]>;
  if (scheduler) {
    combinedObservables = combineLatest(fullObservables, scheduler);
  } else {
    combinedObservables = combineLatest(fullObservables);
  }

  return new LoadableObservable(
    combinedObservables.pipe(
      map(loadables => {
        if (loadables.some(loadable => !isLoaded(loadable))) {
          return Loadable.loading<any>();
        } else {
          return Loadable.loaded(loadables.map(x => x.data));
        }
      }),
    ),
  );
}
