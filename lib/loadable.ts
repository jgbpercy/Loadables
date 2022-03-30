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
 * A Loadable can either be:
 * - `Loaded`, in which case its `loaded` property will be `true`, and it will have a `data` property of
 * type `TData`
 * - `Loading`, in which case its `loaded` property will `false` and it will not have a `data` property
 */
export type Loadable<TData> = Loaded<TData> | Loading;

/**
 * Checks whether a `Loable<TData>` is loaded. This is a type guard, so in code branches where it has
 * passed, the loadable will have type `Loaded<TData>`.
 */
export function isLoaded<TData>(loadable: Loadable<TData>): loadable is Loaded<TData> {
  return loadable.loaded;
}

/**
 * Checks whether every item in a `Loadable<TData>[]` is loaded. This is a type guard, so in code branches
 * where is has passed, the array will have type `Loaded<TData>[]`.
 */
export function areLoaded<TData>(loadables: Loadable<TData>[]): loadables is Loaded<TData>[] {
  return loadables.every((loadable) => loadable.loaded);
}
