import { of } from 'rxjs';
import { LoadableObservable } from '../loadable-observable';
import { ofLoadedObservable } from './of-loaded-observable';

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
