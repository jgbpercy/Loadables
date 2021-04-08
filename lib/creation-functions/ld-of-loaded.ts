import { of } from 'rxjs';
import { LoadableObservable } from '../loadable-observable';
import { ofLoadedObservable } from './ld-of-loaded-observable';

export function ofLoaded<TData>(array: TData[]): LoadableObservable<TData> {
  return ofLoadedObservable(of(...array));
}
