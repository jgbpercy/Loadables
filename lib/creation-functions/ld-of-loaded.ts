import { of } from 'rxjs';
import { LoadableObservable } from '../loadable-observable';
import { ofLoadedObservable } from './ld-of-loaded-observable';

/**
 * A simple way to create a LoadableObservable for unit testing
 */
export function ofLoaded<TData>(
  item1: TData,
  item2?: TData,
  item3?: TData,
  item4?: TData,
  item5?: TData,
  item6?: TData,
  item7?: TData,
  item8?: TData,
  item9?: TData,
): LoadableObservable<TData>;

export function ofLoaded<TData>(...array: TData[]): LoadableObservable<TData> {
  return ofLoadedObservable(of(...array));
}
