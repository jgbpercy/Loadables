import { of } from 'rxjs';
import { LoadableObservable } from '../loadable-observable';
import { ofLoadedObservable } from './of-loaded-observable';

export function ofLoaded<TData>(array: TData[]): LoadableObservable<TData> {
  return ofLoadedObservable(of(...array));
}
