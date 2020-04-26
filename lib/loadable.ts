export interface Loaded<TData> {
  loaded: true;
  data: TData;
}

export interface Loading {
  loaded: false;
}

/**
 * Basic building block of the Loadbles abstraction.
 *
 * ** You should not generally create Loadables themselves directly in user code unless you know
 * exactly what you're doing.**
 *
 * A Loadable can either be:
 * - Loaded, in which case its laoded property will be true, and it will have a data property of
 * type TData
 * - Loading, in which case its loaded property will false and the data property will be undefined
 */
export type Loadable<TData> = Loaded<TData> | Loading;

/**
 * Checks whether a Loable<TData> is loaded. This is a type guard, so in code branches where it has
 * passed, the loadable will have type Loaded<TData>.
```
 * @param loadable The Loadable to check
 */
export function isLoaded<TData>(loadable: Loadable<TData>): loadable is Loaded<TData> {
  return loadable.loaded;
}

export function areLoaded<TData>(loadables: Loadable<TData>[]): loadables is Loaded<TData>[] {
  return loadables.every((loadable) => loadable.loaded);
}
