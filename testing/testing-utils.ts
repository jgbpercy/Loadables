import { TestScheduler } from 'rxjs/testing';
import { Loadable } from '../lib/loadable';

export interface LoadableValueMap {
  [key: string]: Loadable<string>;
}

export interface LoadedValueMap {
  [key: string]: boolean;
}

export interface DataValueMap {
  [key: string]: string;
}

export function getTestScheduler(): TestScheduler {
  return new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
}

export function getLoadedValueMap(sourceValueMap: LoadableValueMap): LoadedValueMap {
  const loadedValueMap: LoadedValueMap = {};

  Object.keys(sourceValueMap).forEach((key) => {
    loadedValueMap[key] = sourceValueMap[key].loaded;
  });

  return loadedValueMap;
}

export function getDataValueMap(sourceValueMap: LoadableValueMap): DataValueMap {
  const dataValueMap: DataValueMap = {};

  Object.keys(sourceValueMap).forEach((key) => {
    const loadable = sourceValueMap[key];

    dataValueMap[key] = loadable.loaded ? loadable.data : 'UNEXPECTED VALUE';
  });

  return dataValueMap;
}
